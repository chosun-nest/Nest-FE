interface PostDetailInfoProps {
  author: {
    id: number;
    name: string;
    profileImageUrl?: string;
  };
  isAuthor: boolean;
  createdAt: string;
  viewCount: number;
  onAuthorClick: () => void;    // 프로필 클릭 시, 다른 사용자 프로필로 이동하기 위함
}

export default function PostDetailInfo({
  author,
  //isAuthor,
  viewCount,
  createdAt,
  onAuthorClick,
}: PostDetailInfoProps) {
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

      {/* 날짜 및 조회수 */}
      <div className="mt-1 text-[15px] text-gray-600 flex gap-2">
        <span>{createdAt}</span>
        <span>· 조회수 {viewCount}</span>
      </div>
    </div>
  );
}
