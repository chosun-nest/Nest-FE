// 모달 UX 최적화 : 팔로우 목록 불러오는 중일 때 스켈레톤 UI
export default function SkeletonFollowUserItem() {
  return (
    <div className="flex items-center justify-between px-4 py-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-gray-200 rounded" />
          <div className="w-40 h-3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="w-20 h-8 bg-gray-200 rounded-md" />
    </div>
  );
}
