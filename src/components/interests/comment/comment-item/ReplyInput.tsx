// 대댓글 입력창 
import { useEffect, useRef } from "react";
import CommentForm from "../CommentForm";

interface ReplyInputProps {
  mentionName: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export default function ReplyInput({ mentionName, onSubmit, onCancel }: ReplyInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initial = `@${mentionName} `;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  return (
    <div className="mt-2 pl-14">
      <CommentForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoggedIn={true}
        placeholder={`@${mentionName} 에게 답글 달기`}
        initialValue={initial}
        textareaRef={textareaRef}
      />
    </div>
  );
}
