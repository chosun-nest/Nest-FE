import { fetchPosts, searchPosts } from "../api/interests/InterestsAPI";
import type { PostSummary, SearchPost } from "../types/api/interest-board";

interface Params {
  sortType?: "latest" | "likes";
  selectedTags?: string[];
  keyword?: string;
  size?: number; // default: 5
}

export const getTopPosts = async ({
  sortType = "latest",
  selectedTags = [],
  keyword = "",
  size = 5,
}: Params): Promise<PostSummary[]> => {
  try {
    const params = {
      page: 0,
      size,
      sort: sortType === "likes" ? "likeCount,desc" : "createdAt,desc",
      tags: selectedTags,
    };

    let rawPosts: (PostSummary | SearchPost)[] = [];

    if (keyword.trim() === "") {
      const data = await fetchPosts(params);
      rawPosts = data.posts;
    } else {
      const data = await searchPosts({
        ...params,
        keyword,
        searchType: "ALL",
      });
      rawPosts = data.posts;
    }

    return rawPosts
      .map((post, idx) => {
        const converted: PostSummary = {
          postId: "postId" in post ? post.postId : post.id,
          title: post.title,
          previewContent: "",
          tags: post.tags ?? [],
          createdAt: post.createdAt,
          viewCount: post.viewCount ?? 0,
          likeCount: post.likeCount ?? 0,
          dislikeCount: post.dislikeCount ?? 0,
          commentCount: post.commentCount ?? 0,
          author: {
            id: post.author.id,
            name: post.author.name,
          },
        };

        if (!converted.postId) {
          console.warn(`❗ ${idx}번째 게시글에 postId 없음`, post);
        }

        return converted;
      })
      .filter((post) => !!post.postId)
      .slice(0, size);
  } catch (error) {
    console.error("❌ 관심 게시글 불러오기 실패", error);
    return [];
  }
};
