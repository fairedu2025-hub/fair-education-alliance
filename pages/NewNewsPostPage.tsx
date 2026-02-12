import React, { useMemo, useRef, useState } from 'react';
import type { NewsArticle, Page } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { PhotoIcon } from '../components/icons/PhotoIcon';
import { XMarkIcon } from '../components/icons/XMarkIcon';

interface NewNewsPostPageProps {
  onNavigate: (page: Page, id?: number) => void;
  onCreateNewsPost: (post: Omit<NewsArticle, 'id' | 'date' | 'views'>) => void;
}

const TAG_OPTIONS: { label: string; text: string; style: NewsArticle['tags'][number]['style'] }[] = [
  { label: '공지사항', text: '공지사항', style: 'red' },
  { label: '행사소식', text: '행사소식', style: 'orange' },
  { label: '언론보도', text: '언론보도', style: 'green' },
  { label: '교육프로그램', text: '교육프로그램', style: 'blue' },
];

const NewNewsPostPage: React.FC<NewNewsPostPageProps> = ({ onNavigate, onCreateNewsPost }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState(TAG_OPTIONS[0]);
  const [isImportant, setIsImportant] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const nextErrors: { title?: string; content?: string } = {};
    if (!title.trim()) nextErrors.title = '제목을 입력해주세요.';
    if (!content.trim()) nextErrors.content = '내용을 입력해주세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = useMemo(() => title.trim() !== '' && content.trim() !== '', [title, content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const normalizedDescription =
      description.trim() || content.trim().substring(0, 100) + (content.trim().length > 100 ? '...' : '');

    onCreateNewsPost({
      tags: [tag],
      title: title.trim(),
      description: normalizedDescription,
      content: content.trim(),
      isImportant,
      images: uploadedImages,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      const currentImageCount = uploadedImages.length;
      const remainingSlots = 5 - currentImageCount;
      const filesToProcessCount = Math.min(files.length, remainingSlots);

      for (let i = 0; i < filesToProcessCount; i++) {
        const file = files[i];
        if (file) {
          const reader = new FileReader();
          reader.onload = (readEvent) => {
            if (readEvent.target?.result) {
              setUploadedImages((prev) => [...prev, readEvent.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      }

      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950/80 py-12">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-10">
            <PencilIcon className="w-12 h-12 mx-auto text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">소식/공지 글 작성</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">홈페이지에 게시할 소식을 작성하세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="news-title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                제목 *
              </label>
              <input
                id="news-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`block w-full rounded-md shadow-sm p-3 bg-gray-50 dark:bg-gray-700 ${
                  errors.title ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="news-description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                요약
              </label>
              <input
                id="news-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md shadow-sm p-3 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">카테고리 *</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((option) => (
                  <button
                    key={option.text}
                    type="button"
                    onClick={() => setTag(option)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                      tag.text === option.text
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="news-important"
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="news-important" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                중요 공지로 등록
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">사진 첨부 (최대 5장)</label>
              <div className="flex flex-wrap gap-4">
                {uploadedImages.map((imageSrc, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group">
                    <img src={imageSrc} alt={`첨부 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-white/70 rounded-full text-red-500 hover:bg-white"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {uploadedImages.length < 5 && (
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <PhotoIcon className="w-8 h-8" />
                    <span className="text-xs mt-1">사진 추가</span>
                  </button>
                )}
              </div>
              <input ref={imageInputRef} type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
            </div>

            <div>
              <label htmlFor="news-content" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                내용 *
              </label>
              <textarea
                id="news-content"
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`block w-full rounded-md shadow-sm p-3 bg-white dark:bg-gray-700/50 ${
                  errors.content ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                }`}
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="pt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => onNavigate('news')}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
              >
                <PlusIcon className="w-5 h-5" />
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewNewsPostPage;
