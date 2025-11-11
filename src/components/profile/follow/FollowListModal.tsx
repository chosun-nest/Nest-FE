// 2단계 팔로워/팔로잉 확인 

import { useEffect, useState } from "react";
import { checkOthersFollowers, checkOthersFollowings, checkMyFollowers, checkMyFollowings, } from "../../../api/following/follow";
import type { FollowUser } from "../../../types/follow/follow";
import FollowUserItem from "./FollowUserItem";
import SkeletonFollowUserItem from "./SkeletonFollowUserItem";
import { X } from "phosphor-react";

interface FollowListModalProps {
  type: "follower" | "following";
  memberId: number;
  memberName: string;
  onClose: () => void;
  onRefreshFollowerCount?: () => void;
  onRefreshFollowingCount?: () => void;
  isMyself?: boolean;
}

export default function FollowListModal({
  type,
  memberId,
  memberName,
  onClose,
  onRefreshFollowerCount,
  onRefreshFollowingCount,
  isMyself,
}: FollowListModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  const title = type === "follower" ? "팔로워" : "팔로잉";

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const data =
          type === "follower"
            ? isMyself
              ? await checkMyFollowers()
              : await checkOthersFollowers(String(memberId))
            : isMyself
              ? await checkMyFollowings()
              : await checkOthersFollowings(String(memberId));
        setUsers(data.users);
      } catch (e) {
        console.error("팔로우 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [type, memberId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md max-h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{memberName}님의 {title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonFollowUserItem key={i} />)
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">아직 {title}가 없습니다.</div>
          ) : (
            users.map((user) => (
              <FollowUserItem
                key={user.memberId}
                user={user}
                onFollowChange={() => {
                  if (type === "follower") onRefreshFollowerCount?.();
                  if (type === "following") onRefreshFollowingCount?.();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
