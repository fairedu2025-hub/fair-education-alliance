

import React, { useState, useMemo, useRef } from 'react';
import type { BoardPost, Page } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { BoldIcon } from '../components/icons/BoldIcon';
import { ItalicIcon } from '../components/icons/ItalicIcon';
import { ListIcon } from '../components/icons/ListIcon';
import { PhotoIcon } from '../components/icons/PhotoIcon';
import { XMarkIcon } from '../components/icons/XMarkIcon';

interface NewBoardPostPageProps {
  onNavigate: (page: Page) => void;
  onCreateBoardPost: (post: Omit<BoardPost, 'id' | 'author' | 'date' | 'views' | 'comments' | 'isNotice' | 'description'>) => void;
}

const categories: { id: BoardPost['tagType']; label: string }[] = [
    { id: 'suggestion', label: '건의사항' },
    { id: 'free', label: '자유게시판' },
    { id: 'qna', label: '질문&답변' },
    { id: 'review', label: '행사후기' },
];

const placeholders: { [key in BoardPost['tagType']]: string } = {
    suggestion: '연합의 발전을 위한 소중한 의견을 남겨주세요. 구체적인 제안은 언제나 환영입니다.',
    free: '자유롭게 글을 작성해주세요. 다른 회원들과 다양한 이야기를 나눌 수 있습니다.',
    qna: '연합 활동이나 기타 궁금한 점을 질문해주세요. 아는 분들의 답변을 기다립니다.',
    review: '참여했던 행사에 대한 후기를 공유해주세요! 사진을 첨부하면 더 좋습니다.',
    notice: '', // Admin only
};


const NewBoardPostPage: React.FC<NewBoardPostPageProps> = ({ onNavigate, onCreateBoardPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagType, setTagType] = useState<BoardPost['tagType']>('suggestion');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const validate = () => {
        const newErrors: { title?: string; content?: string } = {};
        if (!title.trim()) newErrors.title = '제목을 입력해주세요.';
        if (!content.trim()) newErrors.content = '내용을 입력해주세요.';
        else if (content.trim().length < 10) newErrors.content = '내용을 10자 이상 입력해주세요.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (errors.title && e.target.value.trim()) {
            setErrors(prev => ({ ...prev, title: undefined }));
        }
    }
    
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (errors.content && e.target.value.trim().length >= 10) {
            setErrors(prev => ({ ...prev, content: undefined }));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        const tagMap: { [key in BoardPost['tagType']]: string } = {
            'free': '자유게시판',
            'qna': '질문&답변',
            'suggestion': '건의사항',
            'review': '행사후기',
            'notice': '공지사항',
        };

        onCreateBoardPost({
            title,
            content,
            tag: tagMap[tagType],
            tagType,
            images: uploadedImages,
        });
    };
    
    const handleFormat = (formatType: 'bold' | 'italic' | 'list') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        let newText;
        let cursorPositionOffset;

        switch (formatType) {
            case 'bold':
                newText = `**${selectedText}**`;
                cursorPositionOffset = 2;
                break;
            case 'italic':
                newText = `*${selectedText}*`;
                cursorPositionOffset = 1;
                break;
            case 'list':
                const lines = selectedText.split('\n');
                newText = lines.map(line => `- ${line}`).join('\n');
                cursorPositionOffset = 2;
                break;
        }

        const newContent = content.substring(0, start) + newText + content.substring(end);
        setContent(newContent);
        
        textarea.focus();
        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + newText.length;
            } else {
                 textarea.selectionStart = textarea.selectionEnd = start + cursorPositionOffset;
            }
        }, 0);
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
                            setUploadedImages(prev => [...prev, readEvent.target.result as string]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
            e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const triggerImageUpload = () => {
        imageInputRef.current?.click();
    };

    const isFormValid = useMemo(() => {
        return title.trim() !== '' && content.trim().length >= 10;
    }, [title, content]);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        onNavigate('board');
    };
    
    return (
        <div className="bg-gray-50 dark:bg-gray-950/80 py-12">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-10">
                        <PencilIcon className="w-12 h-12 mx-auto text-blue-500" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">게시글 작성</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">회원들과 자유롭게 의견을 나눠보세요.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="title" className="block text-[25px] leading-tight font-bold text-gray-700 dark:text-gray-300 mb-2">제목 *</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                className={`block w-full rounded-md shadow-sm p-3 bg-gray-50 dark:bg-gray-700 ${errors.title ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                          <label className="block text-[25px] leading-tight font-bold text-gray-700 dark:text-gray-300 mb-2">카테고리 *</label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setTagType(cat.id)}
                                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                      tagType === cat.id
                                      ? 'bg-blue-600 text-white shadow' 
                                      : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {cat.label}
                                </button>
                            ))}
                          </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">사진 첨부 (최대 5장)</label>
                            <div className="flex flex-wrap gap-4">
                                {uploadedImages.map((imageSrc, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group">
                                        <img src={imageSrc} alt={`첨부 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" onClick={() => handleRemoveImage(index)} className="p-1.5 bg-white/70 rounded-full text-red-500 hover:bg-white">
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
                            <input
                                ref={imageInputRef}
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="content" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">내용 *</label>
                            <div className={`rounded-md border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}>
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1 bg-gray-50 dark:bg-gray-700/30">
                                    <button type="button" onClick={() => handleFormat('bold')} title="굵게" className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"><BoldIcon className="w-5 h-5" /></button>
                                    <button type="button" onClick={() => handleFormat('italic')} title="기울임" className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"><ItalicIcon className="w-5 h-5" /></button>
                                    <button type="button" onClick={() => handleFormat('list')} title="목록" className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"><ListIcon className="w-5 h-5" /></button>
                                </div>
                                <textarea
                                    id="content"
                                    ref={contentRef}
                                    rows={20}
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder={placeholders[tagType]}
                                    required
                                    className="block w-full border-0 bg-white dark:bg-gray-700/50 shadow-sm focus:ring-0 sm:text-sm p-3 resize-y"
                                ></textarea>
                            </div>
                             <div className="flex justify-between mt-1 text-sm">
                                {errors.content ? (
                                    <p className="text-red-500">{errors.content}</p>
                                ) : (
                                    <p className="text-gray-500">Markdown의 일부 기본 서식을 지원합니다.</p>
                                )}
                                <p className={`text-gray-500 ${content.length > 5000 ? 'text-red-500 font-semibold' : ''}`}>{content.length.toLocaleString()} / 5,000</p>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end gap-4">
                            <button type="button" onClick={handleGoBack} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                취소
                            </button>
                            <button type="submit" disabled={!isFormValid} className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600">
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

export default NewBoardPostPage;
