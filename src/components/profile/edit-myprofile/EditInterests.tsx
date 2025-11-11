// 관심분야 - 읽기 전용 표시 + 수정 모드에서 버튼

interface Props {
  isEditing: boolean;
  interests: string[];
  onOpenModal: () => void;
}

export default function EditInterests({ isEditing, interests, onOpenModal }: Props) {
  return (
    <div className="flex items-start mb-4">
      <label className="mt-2 text-sm font-semibold w-28">관심분야</label>
      <div className="flex-1">
        {/* 수정 모드일 때만 태그 선택 버튼 표시 */}
        {isEditing && (
          <button
            onClick={onOpenModal}
            className="px-3 py-2 mb-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            🔎 태그 선택
          </button>
        )}

        {/* 선택된 관심분야 태그 표시 (읽기 전용) */}
        <div className="flex flex-wrap gap-2 mt-2">
          {interests.length > 0 ? (
            interests.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 text-[13px] font-medium bg-gray-100 text-gray-800 border border-gray-300 rounded-md"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">선택된 관심분야가 없습니다</span>
          )}
        </div>
      </div>
    </div>
  );
}