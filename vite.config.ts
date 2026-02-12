import path from 'path';
import { createSign } from 'crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

const FIREBASE_LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup';
const DEFAULT_FIREBASE_WEB_API_KEY = 'AIzaSyCu_FlxY1wTwRA-CM-wqUp0gWOJhAgotEw';
const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const readJsonBody = async (req: NodeJS.ReadableStream): Promise<any> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const text = Buffer.concat(chunks).toString('utf-8');
  if (!text) return {};
  return JSON.parse(text);
};

const normalizePhoneNumber = (phone: string) => phone.replace(/[^\d+]/g, '');
const normalizePem = (pem: string) => pem.replace(/\\n/g, '\n');
const toBase64Url = (value: string) => Buffer.from(value).toString('base64url');

const getAdminEmails = (env: Record<string, string>) =>
  (env.ADMIN_EMAILS || env.BIZGO_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const verifyRequestAdmin = async (req: any, env: Record<string, string>) => {
  const adminEmails = getAdminEmails(env);
  if (adminEmails.length === 0) return { ok: true, email: '' };

  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const firebaseApiKey = env.FIREBASE_API_KEY || DEFAULT_FIREBASE_WEB_API_KEY;
  if (!bearerToken || !firebaseApiKey) {
    return { ok: false, status: 401, message: '관리자 인증 정보가 없습니다.' };
  }

  const lookupResponse = await fetch(`${FIREBASE_LOOKUP_URL}?key=${encodeURIComponent(firebaseApiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: bearerToken }),
  });

  if (!lookupResponse.ok) {
    return { ok: false, status: 401, message: 'Firebase 인증 검증에 실패했습니다.' };
  }

  const lookupData = await lookupResponse.json();
  const authedEmail = (lookupData?.users?.[0]?.email || '').toLowerCase();
  if (!authedEmail || !adminEmails.includes(authedEmail)) {
    return { ok: false, status: 403, message: '관리자 권한이 없습니다.' };
  }

  return { ok: true, email: authedEmail };
};

const getServiceAccessToken = async (env: Record<string, string>) => {
  let clientEmail = env.FIREBASE_SERVICE_ACCOUNT_EMAIL || '';
  let privateKey = env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
    ? normalizePem(env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY)
    : '';

  if ((!clientEmail || !privateKey) && env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
      clientEmail = clientEmail || serviceAccount?.client_email || '';
      privateKey = privateKey || (serviceAccount?.private_key ? normalizePem(serviceAccount.private_key) : '');
    } catch (error) {
      throw new Error('SERVICE_ACCOUNT_JSON_PARSE_FAILED');
    }
  }

  if (!clientEmail || !privateKey) {
    throw new Error('SERVICE_ACCOUNT_NOT_CONFIGURED');
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    aud: GOOGLE_OAUTH_TOKEN_URL,
    scope: 'https://www.googleapis.com/auth/identitytoolkit',
    iat,
    exp,
  };

  const unsignedToken = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(JSON.stringify(payload))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');
  const assertion = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error('OAUTH_TOKEN_EXCHANGE_FAILED');
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData?.access_token as string | undefined;
  if (!accessToken) {
    throw new Error('OAUTH_ACCESS_TOKEN_MISSING');
  }

  return accessToken;
};

const createBizgoSmsProxyPlugin = (env: Record<string, string>): Plugin => ({
  name: 'bizgo-sms-proxy',
  configureServer(server) {
    server.middlewares.use('/api/admin/send-sms', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'POST 메서드만 허용됩니다.' }));
        return;
      }

      const bizgoApiUrl = env.BIZGO_API_URL;
      const bizgoApiKey = env.BIZGO_API_KEY;
      if (!bizgoApiUrl || !bizgoApiKey) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: '서버 환경변수(BIZGO_API_URL, BIZGO_API_KEY)가 설정되지 않았습니다.' }));
        return;
      }

      try {
        const body = await readJsonBody(req);
        const message = typeof body?.message === 'string' ? body.message.trim() : '';
        const recipients = Array.isArray(body?.recipients) ? body.recipients : [];

        if (!message) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: '문자 내용을 입력해주세요.' }));
          return;
        }

        const phones = recipients
          .map((item: any) => (typeof item?.phone === 'string' ? normalizePhoneNumber(item.phone) : ''))
          .filter((phone: string) => !!phone);

        if (phones.length === 0) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: '유효한 전화번호가 없습니다.' }));
          return;
        }

        const adminAuth = await verifyRequestAdmin(req, env);
        if (!adminAuth.ok) {
          res.statusCode = adminAuth.status || 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: adminAuth.message || '문자 발송 권한이 없습니다.' }));
          return;
        }

        const sendResults = await Promise.allSettled(
          phones.map((phone) =>
            fetch(bizgoApiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bizgoApiKey}`,
              },
              body: JSON.stringify({
                phone,
                message,
                sendTime: new Date().toISOString(),
              }),
            }),
          ),
        );

        const successCount = sendResults.filter(
          (result) => result.status === 'fulfilled' && result.value.ok,
        ).length;
        const failedCount = phones.length - successCount;

        if (successCount === 0) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: '비즈고 문자 발송에 실패했습니다.' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ok: true,
            successCount,
            failedCount,
            message: failedCount > 0 ? `일부 실패(${failedCount}건)` : '전송 완료',
          }),
        );
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: '문자 발송 처리 중 서버 오류가 발생했습니다.' }));
      }
    });
  },
});

const createFirebaseAdminDeletePlugin = (env: Record<string, string>): Plugin => ({
  name: 'firebase-admin-delete',
  configureServer(server) {
    server.middlewares.use('/api/admin/delete-auth-user', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'POST 메서드만 허용됩니다.' }));
        return;
      }

      try {
        const adminAuth = await verifyRequestAdmin(req, env);
        if (!adminAuth.ok) {
          res.statusCode = adminAuth.status || 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: adminAuth.message || '관리자 권한이 없습니다.' }));
          return;
        }

        const body = await readJsonBody(req);
        const targetUserId = typeof body?.targetUserId === 'string' ? body.targetUserId.trim() : '';
        if (!targetUserId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: '삭제할 사용자 아이디가 필요합니다.' }));
          return;
        }

        const targetEmail = `${targetUserId.replace(/@myapp\.com$/i, '')}@myapp.com`;
        const projectId = env.FIREBASE_PROJECT_ID || 'fair-education-backend-eb45a';
        const accessToken = await getServiceAccessToken(env);

        const lookupRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/accounts:lookup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ email: [targetEmail] }),
          },
        );

        if (!lookupRes.ok) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: 'Firebase Auth 사용자 조회에 실패했습니다.' }));
          return;
        }

        const lookupData = await lookupRes.json();
        const localId = lookupData?.users?.[0]?.localId as string | undefined;
        if (!localId) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, alreadyDeleted: true }));
          return;
        }

        const deleteRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/accounts:delete`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ localId }),
          },
        );

        if (!deleteRes.ok) {
          const deleteError = await deleteRes.json().catch(() => ({}));
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: deleteError?.error?.message || 'Firebase Auth 계정 삭제에 실패했습니다.' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, deleted: true }));
      } catch (error: any) {
        const message =
          error?.message === 'SERVICE_ACCOUNT_NOT_CONFIGURED'
            ? '서비스 계정 환경변수(FIREBASE_SERVICE_ACCOUNT_EMAIL, FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY 또는 FIREBASE_SERVICE_ACCOUNT_JSON)가 설정되지 않았습니다.'
            : error?.message === 'SERVICE_ACCOUNT_JSON_PARSE_FAILED'
              ? 'FIREBASE_SERVICE_ACCOUNT_JSON 형식이 올바르지 않습니다.'
              : error?.message === 'OAUTH_TOKEN_EXCHANGE_FAILED'
                ? '서비스 계정 인증 토큰 발급에 실패했습니다. 서비스 계정 키/프로젝트 권한을 확인해주세요.'
                : '관리자 삭제 처리 중 서버 오류가 발생했습니다.';
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/fair-education-alliance/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), createBizgoSmsProxyPlugin(env), createFirebaseAdminDeletePlugin(env)],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
