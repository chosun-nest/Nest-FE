// 댓글 목록을 받아서 작성자들의 프로필 이미지들을 가져와 Record<authorId, imageUrl> 형태로 반환

import { useEffect, useState } from "react";
import { getMemberProfileById } from "../api/profile/ProfileAPI";
import type { MemberProfile } from "../types/api/profile";

export function useCommentAuthorProfiles(commentList: { author: { id: number } }[]) {
  const [profileMap, setProfileMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const uniqueIds = Array.from(new Set(commentList.map(c => c.author.id)));

    const fetchProfiles = async () => {
      const newMap: Record<number, string> = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const profile: MemberProfile = await getMemberProfileById(id);
            newMap[id] = profile.memberImageUrl;
          } catch {
            newMap[id] = "/assets/images/user.png"; // fallback
          }
        })
      );
      setProfileMap(newMap);
    };

    fetchProfiles();
  }, [commentList]);

  return profileMap;
}

