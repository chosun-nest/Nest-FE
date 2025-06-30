// profilecard 컴포넌트 안의 팔로워/팔로잉 UI + 모달 분리
import { useState } from "react";
import FollowListModal from "./FollowListModal";

interface FollowStatsProps {
  memberId: number;
  memberName: string;
  followerCount: number;
  followingCount: number;
  isMyself: boolean;
  onRefreshFollowerCount: () => void;
  onRefreshFollowingCount: () => void;
}

export default function FollowStats({
  memberId,
  memberName,
  followerCount,
  followingCount,
  isMyself,
  onRefreshFollowerCount,
  onRefreshFollowingCount,
}: FollowStatsProps) {
  const [openTab, setOpenTab] = useState<"follower" | "following" | null>(null);

  return (
    <>
      <div className="flex gap-6 mt-3 text-sm font-medium text-gray-700">
        <button onClick={() => setOpenTab("follower")}>
          팔로워 <span className="ml-1 text-blue-800">{followerCount}</span>
        </button>
        <button onClick={() => setOpenTab("following")}>
          팔로잉 <span className="ml-1 text-blue-800">{followingCount}</span>
        </button>
      </div>

      {openTab && (
        <FollowListModal
          type={openTab}
          memberId={memberId}
          memberName={memberName}
          isMyself={isMyself}
          onClose={() => setOpenTab(null)}
          onRefreshFollowerCount={onRefreshFollowerCount}
          onRefreshFollowingCount={onRefreshFollowingCount}
        />
      )}
    </>
  );
}
