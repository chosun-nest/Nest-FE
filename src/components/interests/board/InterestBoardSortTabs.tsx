// 최신순, 좋아요순 드롭다운 컴포넌트
interface Props {
  sortType: "latest" | "likes";
  onChange: (value: Props["sortType"]) => void;
}

export default function InterestBoardSortTabs({ sortType, onChange }: Props) {
  const tabs: { label: string; value: Props["sortType"] }[] = [
    { label: "최신순", value: "latest" },
    { label: "좋아요순", value: "likes" },
  ];

  return (
    <div className="flex gap-2 mt-4 sm:mt-0">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1 text-sm rounded border font-semibold ${
            sortType === tab.value
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}


