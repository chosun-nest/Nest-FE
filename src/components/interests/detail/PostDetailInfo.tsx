interface PostDetailInfoProps {
  author: {
    id: number;
    name: string;
    profileImageUrl?: string;
  };
  isAuthor: boolean;
  createdAt: string;
  viewCount: number;
}

export default function PostDetailInfo({
  author,
  createdAt,
  viewCount,
}: PostDetailInfoProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-600">
      {/* 프로필 이미지 + 이름 */}
      <div className="flex items-center gap-2">
        <img
          src={author.profileImageUrl || "/assets/images/manager-bird.png"}
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
