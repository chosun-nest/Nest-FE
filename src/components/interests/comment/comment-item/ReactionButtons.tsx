// 댓글 좋아요, 싫어요 버튼
import { ThumbsUp, ThumbsDown } from "phosphor-react";

interface Props {
  likeCount: number;
  dislikeCount: number;
  onReact: (type: "LIKE" | "DISLIKE") => void;
}

export default function ReactionButtons({ likeCount, dislikeCount, onReact }: Props) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <button onClick={() => onReact("LIKE")} className="flex items-center gap-1">
        <ThumbsUp size={16} /> {likeCount}
      </button>
      <button onClick={() => onReact("DISLIKE")} className="flex items-center gap-1">
        <ThumbsDown size={16} /> {dislikeCount}
      </button>
    </div>
  );
}