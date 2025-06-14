import useResponsive from "../../../hooks/responsive";
interface InterestPostCardListProps {
  posts: {
    postId: number;
    title: string;
    previewContent: string;
    tags: string[];
    author: {         // 작성자 정보
      id: number;
      name: string;
    };
    createdAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }[];
  onCardClick: (postId: number) => void; // 카드 클릭 핸들러 추가
}

export default function InterestPostCardList({
  posts,
  onCardClick,
}: InterestPostCardListProps) {
  const isMobile = useResponsive();     // 모바일 대응 없애기

  return (
    <div className="space-y-4">
      {posts
        .filter((post) => !!post.postId && !!post.author)
        .map((post) => (
          <div
            key={post.postId}
            onClick={() => onCardClick(post.postId)} // navigate > props 호출
            className="p-4 border rounded-lg cursor-pointer hover:shadow"
          >
            <div
              className={`flex items-center gap-2 mb-2 ${isMobile ? "flex-wrap" : ""}`}
            >
              <h2
                className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}
              >
                {post.title}
              </h2>
            </div>

            <p className="mb-2 text-sm text-gray-700">
              {post.previewContent.length > 100
                ? `${post.previewContent.slice(0, 100)}...`
                : post.previewContent}
            </p>

            {post.tags && (
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {post.author ? (
                  <span>
                    {post.author.name} • {post.createdAt}
                  </span>
                ) : (
                  <span>
                    작성자 없음 • {post.createdAt}
                  </span>
                )}
              </span>
              <div className="flex gap-3">
                <span>조회수 {post.viewCount}</span>
                <span>좋아요 {post.likeCount}</span>
                <span>댓글수 {post.commentCount}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}