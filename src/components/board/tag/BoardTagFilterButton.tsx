// 기술 필터 & 선택 태그 > 버튼만 랜더링 하게 변경. 태그 선택된 리스트는 SelectedTagList.tsx 사용하면 됨
interface Props {
  onOpenFilter?: () => void;
}

export default function BoardTagFilterButton({ onOpenFilter }: Props) {
  if (!onOpenFilter) return null;

  return (
    <button
      onClick={onOpenFilter}
      className="px-3 py-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 h-[38px] flex items-center justify-center gap-1.5 min-w-0"
    >
      <span className="shrink-0">🔎</span>
      <span className="truncate">태그 선택</span>
    </button>
  );
}