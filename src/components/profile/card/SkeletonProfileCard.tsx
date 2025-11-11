// 프로필 카드 UX 최적화, 깜빡임 제거

export default function SkeletonProfileCard() {
  return (
    <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white animate-pulse">
      {/* 이미지 */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
      </div>

      {/* 이름 + 전공 */}
      <div className="w-3/4 h-4 mx-auto mb-2 bg-gray-300 rounded" />
      <div className="w-1/2 h-3 mx-auto mb-4 bg-gray-200 rounded" />

      {/* 소개 */}
      <div className="w-full h-3 mb-2 bg-gray-200 rounded" />
      <div className="w-4/5 h-3 mb-4 bg-gray-200 rounded" />

      {/* 팔로워/팔로잉 */}
      <div className="flex justify-around mb-4">
        <div className="w-16 h-3 bg-gray-200 rounded" />
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>

      {/* 기술 스택 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <div className="w-12 h-4 bg-gray-200 rounded" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-14" />
      </div>

      {/* SNS 아이콘 */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      </div>

      {/* 버튼 */}
      <div className="w-32 h-8 mx-auto bg-gray-300 rounded" />
    </div>
  );
}
