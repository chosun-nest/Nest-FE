// 4. 댓글 입력/수정/답글 작성 폼
import { useState, useEffect, useRef } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  isLoggedIn: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>; // 외부에서 전달된 ref 허용
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "댓글을 입력하세요",
  isLoggedIn,
  textareaRef,
}: CommentFormProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null); // fallback ref
  const ref = textareaRef ?? internalRef; // 외부 ref 우선 사용

  const [content, setContent] = useState(initialValue);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"; // reset height
      ref.current.style.height = `${ref.current.scrollHeight}px`; // set new height
    }
  }, [content]);

  if (!isLoggedIn) {
    return (
      <div className="p-3 text-sm text-gray-500 bg-gray-100 border rounded">
        댓글을 작성하려면 로그인 해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        ref={ref}
        className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring focus:border-[#1E3A8A] transition-all duration-150"
        rows={1}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            className="px-4 py-1 text-sm border rounded hover:bg-gray-50"
            onClick={onCancel}
          >
            취소
          </button>
        )}
        <button
          className="px-4 py-1 text-sm text-white rounded bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>
    </div>
  );
}
