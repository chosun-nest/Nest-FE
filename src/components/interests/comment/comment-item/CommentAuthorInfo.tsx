// 댓글 사용자의 이미지, 작성자명, 작성일
// 이미지, 작성자명 클릭 시 해당 사용자의 프로필 페이지로 이동
import { useNavigate } from "react-router-dom";
import { navigateToProfile } from "../../../../utils/navigateToProfile";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../../store/slices/userSlice";

interface CommentAuthorInfoProps {
  authorId: number;
  authorName: string;
  authorImageUrl?: string;
  createdAt: string;
  onClick?: () => void;
}

export default function CommentAuthorInfo({
  authorId,
  authorName,
  authorImageUrl,
  createdAt,
  onClick,
}: CommentAuthorInfoProps) {
  const navigate = useNavigate();
  const currentUserId = useSelector(selectCurrentUserId);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigateToProfile({
        navigate,
        currentUserId: currentUserId!,
        targetUserId: authorId,
      });
    }
  };

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={handleClick}>
      <img
        src={authorImageUrl || "/default-profile.png"}
        alt="작성자"
        className="object-cover w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{authorName}</span>
        <span className="text-xs text-gray-500">{createdAt.slice(0, 16).replace("T", " ")}</span>
      </div>
    </div>
  );

}
