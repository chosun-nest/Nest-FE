// src/components/project/detail/PostDetailInfo.tsx

interface PostDetailInfoProps {
  author: {
    id: number;
    name: string;
    profileImageUrl?: string;
  };
  isAuthor: boolean;
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  onAuthorClick: () => void;
}

export default function PostDetailInfo({
  author,
  //isAuthor,
  createdAt,
  updatedAt,
  viewCount,
  onAuthorClick,
}: PostDetailInfoProps) {
  // 수정 여부 확인 (createdAt과 updatedAt이 다른 경우)
  const isEdited = updatedAt && createdAt !== updatedAt;

  return (
    <div className="flex flex-col gap-2 text-sm text-gray-600">
      {/* 프로필 이미지 + 이름 */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={onAuthorClick}>
        <img
          src={author.profileImageUrl || "/assets/images/user.png"}
          alt="프로필"
          className="object-cover w-8 h-8 rounded-full"
        />
        <span className="font-semibold text-[16px] text-gray-900">
          {author.name}
        </span>
      </div>

      {/* 생성일 + 조회수 */}
      <div className="mt-1 text-[15px] text-gray-600 flex gap-2">
        <span>{createdAt}</span>
        {isEdited && (
          <span className="text-gray-500">(수정됨: {updatedAt})</span>
        )}
        <span>· 조회수 {viewCount}</span>
      </div>
    </div>
  );
}
