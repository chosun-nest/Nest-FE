// 분리된 컴포넌트에서 profile 데이터를 가져와서 ProfileCard에 넘기는 방식
import { useEffect, useState } from "react";
import { getMemberProfile } from "../../../api/profile/ProfileAPI";
import { getFavoriteTags } from "../../../api/board-common/UserTagAPI";
import ProfileCard from "./ProfileCard";
import type { ProfileType } from "../../../types/profile";
import { convertToProfileType } from "../../../utils/profileType";

export default function ProfileCardWrapper() {
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    Promise.all([
      getMemberProfile(),
      getFavoriteTags().catch(() => ({ favoriteTags: [] })),
    ]).then(([profileData, favoriteTagsData]) => {
      const interests = favoriteTagsData.favoriteTags?.map(
        (tag: { tagId: number; tagName: string }) => tag.tagName
      ) || [];
      const converted = convertToProfileType(profileData, interests);
      setProfile(converted);
    });
  }, []);

  if (!profile) return null; // or loading skeleton

  return <ProfileCard profile={profile} isOwnProfile={true} />;
}
