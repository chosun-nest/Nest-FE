// 태그 선택된 리스트
interface Props {
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
}

export default function SelectedTagList({ selectedTags, onRemoveTag }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedTags.map((tag) => (
        <span
          key={tag}
          onClick={() => onRemoveTag(tag)}
          className="inline-flex items-center px-2 py-1 text-[13px] font-medium bg-gray-100 text-gray-800 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
        >
          {tag}
          <span className="ml-1">×</span>
        </span>
      ))}
    </div>
  );
}

