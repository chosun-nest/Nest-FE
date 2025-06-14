import { useEffect, useState } from "react";
import { getTopPosts } from "../../../utils/getTopPosts";
import InterestPostCardList from "../../interests/board/InterestPostCardList";
import { PostSummary } from "../../../types/api/interest-board";
import { useNavigate } from "react-router-dom";

export default function HomeInterest() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopPosts({ size: 5 }).then(setPosts);
  }, []);

  const handleCardClick = (postId: number) => {
    navigate(`/interests-detail/${postId}`);
  };

  return (
    <div>
      <InterestPostCardList posts={posts} onCardClick={handleCardClick} />
    </div>
  );
}
