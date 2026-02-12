
import React, { useEffect, useRef, useState } from 'react';
import { UserIcon } from '../components/icons/UserIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { LockClosedIcon } from '../components/icons/LockClosedIcon';
import { InformationCircleIcon } from '../components/icons/InformationCircleIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { UserPlusIcon } from '../components/icons/UserPlusIcon';
import { XMarkIcon } from '../components/icons/XMarkIcon';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import type { User } from '../types';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          roadAddress: string;
          jibunAddress: string;
          bname: string;
          buildingName: string;
          apartment: string;
        }) => void;
      }) => {
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const DAUM_POSTCODE_SCRIPT_SRC = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

const InputField: React.FC<{ id: string, label: string, type: string, placeholder: string, icon?: React.ReactNode, note?: string, children?: React.ReactNode, required?: boolean, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean, readOnly?: boolean, onClick?: (e: React.MouseEvent<HTMLInputElement>) => void, inputClassName?: string }> = 
  ({ id, label, type, placeholder, icon, note, children, required, value, onChange, disabled, readOnly, onClick, inputClassName }) => (
  <div className="w-full max-w-md mx-auto">
    {label && (
      <label htmlFor={id} className={`block text-sm font-bold mb-2 ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: `h-5 w-5 ${disabled ? 'text-gray-300' : 'text-[#2563eb]'}` })}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        readOnly={readOnly}
        className={`block w-full rounded-md border-2 border-[#2563eb] py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-sm transition-all ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' : 'bg-white text-black'
        } ${inputClassName || ''}`}
        placeholder={placeholder}
        required={required}
      />
      {children}
    </div>
    {note && <p className={`mt-2 text-xs font-medium ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>{note}</p>}
  </div>
);

const CheckboxField: React.FC<{ id: string, label: string, required: boolean, linkText?: string, disabled?: boolean, checked?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, onLinkClick?: () => void }> = 
  ({ id, label, required, linkText, disabled, checked, onChange, onLinkClick }) => (
  <div className="flex flex-col items-start w-full max-w-md mx-auto">
    <div className="flex items-center">
        <div className="flex h-5 items-center">
        <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`h-5 w-5 rounded border-2 border-[#2563eb] text-blue-600 focus:ring-blue-200 ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''}`}
        />
        </div>
        <div className="ml-3 text-sm">
        <label htmlFor={id} className={`${disabled ? 'text-gray-400' : 'text-gray-900 font-bold'}`}>
            {label} <span className={`${disabled ? 'text-gray-300' : 'text-gray-500'}`}>{required ? '(필수)' : '(선택)'}</span>
        </label>
        </div>
    </div>
    {linkText && (
        <div className={`mt-1 ml-8 text-sm ${disabled ? 'text-gray-300' : 'text-blue-600'}`}>
            <button 
                type="button"
                onClick={(e) => { e.preventDefault(); onLinkClick?.(); }}
                className={disabled ? 'pointer-events-none' : 'underline hover:text-blue-700 font-semibold'}
            >
                {linkText}
            </button>
        </div>
    )}
  </div>
);

const BenefitItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <CheckIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700 font-medium">{children}</span>
    </li>
);

const TERMS_OF_SERVICE = `제1조(목적)
이 약관은 공정교육바른인천연합(이하 "단체")이 운영하는 홈페이지(이하 "사이트")에서 제공하는 서비스의 이용조건 및 절차, 회원과 단체의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조(회원 가입)
1. 이용자는 단체가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
2. 회원은 일반회원과 정회원으로 구분되며, 정회원의 경우 가입 후 별도의 승인 절차를 거쳐야 합니다.

제3조(서비스의 이용 및 중단)
1. 사이트는 연중무휴, 1일 24시간 제공을 원칙으로 합니다.
2. 단체는 시스템 점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.

제4조(회원의 의무)
1. 회원은 관계 법령, 본 약관의 규정, 이용 안내 및 사이트상에 공지한 주의사항을 준수하여야 합니다.
2. 회원은 본인의 아이디 및 비밀번호를 관리할 책임이 있으며, 이를 제3자가 이용하게 해서는 안 됩니다.

제5조(회원 탈퇴 및 자격 상실)
1. 회원은 단체에 언제든지 탈퇴를 요청할 수 있으며 단체는 즉시 회원탈퇴를 처리합니다.
2. 회원이 타인의 명의를 이용하거나 허위 사실을 기재한 경우, 단체는 회원 자격을 제한하거나 정지시킬 수 있습니다.`;

const PRIVACY_POLICY = `공정교육바른인천연합 개인정보처리방침

공정교육바른인천연합(이하 '단체')은 이용자의 개인정보를 중요시하며, "개인정보 보호법"을 준수하고 있습니다.

1. 수집하는 개인정보 항목
단체는 회원가입, 원활한 고객상담, 각종 서비스 등 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
- 필수항목: 이름, 아이디, 비밀번호, 휴대전화번호
- 선택항목: 이메일 주소, 홍보물 수신 여부

2. 개인정보의 수집 및 이용목적
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 고지사항 전달
- 신규 서비스 개발 및 마케팅·광고에의 활용

3. 개인정보의 보유 및 이용기간
회원의 개인정보는 회원가입 후 서비스를 제공하는 기간 동안 보유하며, 회원 탈퇴 시 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.

4. 동의 거부 권리
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수항목에 대한 동의 거부 시 회원가입이 제한될 수 있습니다.`;

interface SignUpPageProps {
    onCheckId?: (id: string) => Promise<boolean>;
    onSignUp: (user: User, password: string) => Promise<void>;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onCheckId, onSignUp }) => {
  const [userId, setUserId] = useState('');
  const [idCheckResult, setIdCheckResult] = useState<'success' | 'fail' | null>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreements, setAgreements] = useState({
      terms: false,
      privacy: false,
      marketing: false
  });

  const [modalType, setModalType] = useState<'none' | 'terms' | 'privacy'>('none');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const addressSearchContainerRef = useRef<HTMLDivElement>(null);

  const loadAddressSearchScript = () => {
      return new Promise<void>((resolve, reject) => {
          if (window.daum?.Postcode) {
              resolve();
              return;
          }

          const existingScript = document.getElementById(DAUM_POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;
          if (existingScript) {
              existingScript.addEventListener('load', () => resolve(), { once: true });
              existingScript.addEventListener('error', () => reject(new Error('주소 검색 스크립트 로드에 실패했습니다.')), { once: true });
              return;
          }

          const script = document.createElement('script');
          script.id = DAUM_POSTCODE_SCRIPT_ID;
          script.src = DAUM_POSTCODE_SCRIPT_SRC;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('주소 검색 스크립트 로드에 실패했습니다.'));
          document.body.appendChild(script);
      });
  };

  const handleOpenAddressModal = async () => {
      try {
          await loadAddressSearchScript();
          setIsAddressModalOpen(true);
      } catch (error) {
          alert('주소 검색 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
  };

  useEffect(() => {
      if (!isAddressModalOpen || !addressSearchContainerRef.current || !window.daum?.Postcode) return;

      addressSearchContainerRef.current.innerHTML = '';

      const postcode = new window.daum.Postcode({
          oncomplete: (data) => {
              const baseAddress = data.roadAddress || data.jibunAddress || '';
              const extraParts: string[] = [];

              if (data.bname && /[동로가]$/.test(data.bname)) {
                  extraParts.push(data.bname);
              }
              if (data.buildingName && data.apartment === 'Y') {
                  extraParts.push(data.buildingName);
              }

              const fullAddress = extraParts.length > 0 ? `${baseAddress} (${extraParts.join(', ')})` : baseAddress;
              setAddress(fullAddress);
              setIsAddressModalOpen(false);

              requestAnimationFrame(() => {
                  document.getElementById('addressDetail')?.focus();
              });
          }
      });

      postcode.embed(addressSearchContainerRef.current);
  }, [isAddressModalOpen]);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(rawValue)) {
          alert('아이디는 영문과 숫자만 입력할 수 있습니다.');
      }
      const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9]/g, '');
      setUserId(sanitizedValue);
      setIdCheckResult(null); 
  };

  const handleCheckId = async () => {
      if (!userId.trim()) {
          alert('아이디를 입력해주세요.');
          document.getElementById('userid')?.focus();
          return;
      }
      if (onCheckId) {
          try {
              const isAvailable = await onCheckId(userId);
              setIdCheckResult(isAvailable ? 'success' : 'fail');
              if (isAvailable) {
                  alert('사용 가능한 아이디입니다.');
              } else {
                  alert('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
                  setUserId(''); 
                  document.getElementById('userid')?.focus();
              }
          } catch (error) {
              setIdCheckResult(null);
              alert(error instanceof Error ? error.message : '아이디 중복 확인 중 오류가 발생했습니다.');
          }
      }
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setAgreements(prev => ({
          ...prev,
          [name]: checked
      }));
  };

  const formatPhoneNumber = (value: string) => {
      const digits = value.replace(/\D/g, '').slice(0, 11);

      if (digits.startsWith('02')) {
          if (digits.length <= 2) return digits;
          if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
          if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
          return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
      }

      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (idCheckResult === null) {
          alert('아이디 중복 확인을 해주세요.');
          const idInput = document.getElementById('userid');
          if (idInput) idInput.focus();
          return;
      }

      if (idCheckResult === 'fail') {
          alert('이미 사용 중인 아이디입니다.');
          return;
      }

      if (password !== passwordConfirm) {
          alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
          return;
      }

      if (!agreements.terms || !agreements.privacy) {
          alert('필수 약관에 동의해주세요.');
          return;
      }

      const newUser: User = {
          id: userId,
          name: name,
          level: '일반회원', 
          phone: phone,
          email: '',
          address: address,
          addressDetail: addressDetail
      };

      try {
          await onSignUp(newUser, password);
      } catch (error) {
          alert(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
      }
  };

  return (
    <div className="bg-blue-50/30">
      <header className="bg-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl font-extrabold">회원가입</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-orange-100 font-medium text-center">
            공정교육바른인천연합과 함께 건강한 시민사회를 만들어가세요. <br />
            회원이 되시면 다양한 혜택과 활동 기회를 누리실 수 있습니다.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center mb-10">
              <UserIcon className="w-7 h-7 mr-3 text-blue-600" />
              회원 정보 입력
            </h2>

            <form onSubmit={handleSubmit} className="space-y-10">
              <section>
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold border-b-2 border-blue-100 pb-3 mb-6 text-gray-900">기본 정보</h3>
                </div>
                <div className="space-y-6">
                  <InputField 
                    id="name" 
                    label="이름" 
                    type="text" 
                    placeholder="이름을 입력해주세요" 
                    icon={<UserIcon />} 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <div className="space-y-3">
                    <InputField 
                        id="address" 
                        label="주소" 
                        type="text" 
                        placeholder="기본 주소를 입력해주세요" 
                        icon={<LocationPinIcon />} 
                        required 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        readOnly
                        inputClassName="cursor-pointer"
                        onClick={handleOpenAddressModal}
                    >
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <SearchIcon className="h-5 w-5 text-[#2563eb]" strokeWidth={2} />
                      </div>
                    </InputField>
                    <InputField 
                        id="addressDetail" 
                        label="" 
                        type="text" 
                        placeholder="나머지 주소를 입력해주세요" 
                        required 
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                    />
                  </div>
                  
                  <InputField 
                    id="phone" 
                    label="전화번호" 
                    type="tel" 
                    placeholder="010-1234-5678" 
                    icon={<PhoneIcon />} 
                    note="긴급 연락 및 행사 안내에 활용됩니다."
                    required 
                    value={phone}
                    onChange={handlePhoneChange}
                  />

                  <div className="w-full max-w-md mx-auto">
                    <label htmlFor="userid" className="block text-sm font-bold mb-2 text-gray-900">
                        아이디 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-grow">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-[#2563eb]" />
                            </div>
                            <input
                                type="text"
                                id="userid"
                                name="userid"
                                value={userId}
                                onChange={handleIdChange}
                                className={`block w-full rounded-md border-2 py-3 pl-10 pr-4 text-black shadow-sm focus:ring-4 focus:ring-blue-100 sm:text-sm transition-all ${
                                    idCheckResult === 'success' ? 'border-green-500 bg-green-50' : 
                                    idCheckResult === 'fail' ? 'border-red-500 bg-red-50' : 'border-[#2563eb] bg-white focus:border-blue-500'
                                }`}
                                placeholder="사용할 아이디"
                                required
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleCheckId}
                            className="bg-blue-600 text-white border-2 border-blue-600 px-6 py-2 rounded-md text-sm font-extrabold whitespace-nowrap transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-95"
                        >
                            중복확인
                        </button>
                    </div>
                    {idCheckResult === 'success' && <p className="mt-2 text-sm text-green-700 font-bold">사용 가능한 아이디입니다.</p>}
                    {idCheckResult === 'fail' && <p className="mt-2 text-sm text-red-700 font-bold">이미 사용 중인 아이디입니다.</p>}
                    {!idCheckResult && <p className="mt-2 text-xs text-gray-500 font-medium">로그인 시 사용할 아이디를 입력 후 중복확인을 해주세요.</p>}
                  </div>

                  <InputField 
                    id="password" 
                    label="비밀번호" 
                    type="password" 
                    placeholder="6자리 이상 입력해주세요" 
                    icon={<LockClosedIcon />} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputField 
                    id="password-confirm" 
                    label="비밀번호 확인" 
                    type="password" 
                    placeholder="비밀번호를 다시 입력해주세요" 
                    icon={<LockClosedIcon />} 
                    required 
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  >
                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <InformationCircleIcon className="h-5 w-5 text-[#2563eb]" />
                    </div>
                  </InputField>
                </div>
              </section>

              <section>
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold border-b-2 border-blue-100 pb-3 mb-6 text-gray-900">약관 동의</h3>
                </div>
                <div className="space-y-5">
                    <CheckboxField 
                        id="terms" 
                        label="이용약관에 동의합니다" 
                        required={true} 
                        linkText="약관 전문 보기 >" 
                        checked={agreements.terms}
                        onChange={handleAgreementChange}
                        onLinkClick={() => setModalType('terms')}
                    />
                    <CheckboxField 
                        id="privacy" 
                        label="개인정보처리방침에 동의합니다" 
                        required={true} 
                        linkText="개인정보처리방침 보기 >" 
                        checked={agreements.privacy}
                        onChange={handleAgreementChange}
                        onLinkClick={() => setModalType('privacy')}
                    />
                    <CheckboxField 
                        id="marketing" 
                        label="마케팅 정보 수신에 동의합니다" 
                        required={false} 
                        checked={agreements.marketing}
                        onChange={handleAgreementChange}
                    />
                    <div className="max-w-md mx-auto w-full">
                        <p className="text-xs text-gray-500 font-bold ml-8">행사 안내, 교육 정보 등을 이메일로 받아보실 수 있습니다.</p>
                    </div>
                </div>
              </section>
              
              <div className="pt-8 border-t-2 border-blue-100 flex flex-col items-center">
                  <button 
                    type="submit" 
                    className="w-full max-w-md flex justify-center items-center gap-x-3 py-4 px-6 border-transparent rounded-md shadow-lg text-xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.01] active:scale-98"
                  >
                    <UserPlusIcon className="w-7 h-7" />
                    회원가입 완료
                  </button>
                  <p className="mt-6 text-base text-gray-700 font-bold">
                    이미 회원이신가요? <a href="#" onClick={(e) => { e.preventDefault(); }} className="font-black text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2">로그인하기</a>
                  </p>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-100">
                <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">회원 혜택 안내</h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-extrabold text-blue-700 mb-2 flex items-center text-lg">
                            일반회원 
                            <span className="ml-2 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-black">MEMBER</span>
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <BenefitItem>기본적인 웹 서비스 이용</BenefitItem>
                            <BenefitItem>게시판 글쓰기 및 댓글 참여</BenefitItem>
                            <BenefitItem>교육 프로그램 참여 및 신청</BenefitItem>
                            <BenefitItem>회원 전용 행사 참여</BenefitItem>
                            <BenefitItem>월간 소식지 이메일 수신</BenefitItem>
                            <BenefitItem>온라인 자료실 접근</BenefitItem>
                        </ul>
                    </div>
                    <div className="border-t-2 border-blue-50 pt-6">
                        <h4 className="font-extrabold text-blue-700 mb-2 flex items-center text-lg">
                            정회원 
                            <span className="ml-2 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-black">FULL</span>
                        </h4>
                        <p className="text-xs text-gray-500 mb-4 font-bold">일반회원 가입 후 승급 절차를 거치게 되며, 다음 권한이 추가됩니다.</p>
                        <ul className="space-y-3 text-sm">
                            <BenefitItem>모든 일반회원 혜택 포함</BenefitItem>
                            <BenefitItem>정기총회 참여 및 의결권</BenefitItem>
                            <BenefitItem>임원 선출권 및 피선출권</BenefitItem>
                            <BenefitItem>정책 토론 및 제안권</BenefitItem>
                            <BenefitItem>정회원 전용 프로그램 참여</BenefitItem>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-100">
                <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">가입 안내</h3>
                <div className="space-y-5 text-sm">
                    <div>
                        <h4 className="font-extrabold text-gray-900 mb-1 text-base">가입 절차</h4>
                        <p className="text-gray-700 font-bold">온라인 신청 → 이메일 인증 → 가입 완료</p>
                    </div>
                    <div>
                        <h4 className="font-extrabold text-gray-900 mb-1 text-base">정회원 승급</h4>
                        <p className="text-gray-700 font-bold">일반회원 가입 후 6개월 경과 및 기존 정회원 2명 추천 필요</p>
                    </div>
                     <div>
                        <h4 className="font-extrabold text-gray-900 mb-1 text-base">문의사항</h4>
                        <p className="text-gray-700 font-bold">032-123-4567 또는 <a href="#" className="text-blue-600 font-black hover:underline decoration-2">홈페이지 문의하기</a></p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {modalType !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalType('none')}>
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {modalType === 'terms' ? '이용약관 전문' : '개인정보처리방침 전문'}
                    </h3>
                    <button onClick={() => setModalType('none')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {modalType === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY}
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 text-right shrink-0">
                    <button 
                        onClick={() => setModalType('none')}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
      )}

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)}>
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h3 className="text-2xl font-bold text-gray-900">도로명 주소 검색</h3>
                    <button onClick={() => setIsAddressModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-4 grow">
                    <div ref={addressSearchContainerRef} className="w-full h-full rounded-xl overflow-hidden border border-gray-200" />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
