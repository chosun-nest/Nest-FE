// 한 줄 소개란
interface Props {
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
}

export default function EditIntroduce({ value, isEditing, onChange }: Props) {
  return (
    <div className="flex flex-col mb-4 sm:flex-row">
      <label className="text-sm font-semibold mb-1 sm:mb-0 sm:w-28 min-w-[5rem] mt-2 sm:mt-0">
        자기소개
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        className="w-full sm:flex-1 p-2 rounded border min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
      />
    </div>
  );
}

