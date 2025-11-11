// 댓글 로딩 시 스켈레톤 UI
// 고정된 키 배열 > UI 흔들림 없앰
import { v4 as uuidv4 } from "uuid";  // npm install uuid

export default function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map(() => {
        const key = uuidv4();
        return (
          <div key={key} className="p-3 border rounded animate-pulse">
            <div className="w-1/3 h-4 mb-2 bg-gray-300 rounded" />
            <div className="w-full h-3 mb-1 bg-gray-200 rounded" />
            <div className="w-5/6 h-3 bg-gray-200 rounded" />
          </div>
        );
      })}
    </div>
  );
}

