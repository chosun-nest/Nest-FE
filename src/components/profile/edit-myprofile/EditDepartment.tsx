{/* 학과 검색 + 선택 */}
export interface Item {
  id: number;
  name: string;
}

interface EditDepartmentProps {
  isEditing: boolean;
  departmentInput: string;
  onInputChange: (value: string) => void;
  filteredDepartments: Item[];
  onSelect: (item: Item) => void;
}

export default function EditDepartment({
  isEditing,
  departmentInput,
  onInputChange,
  filteredDepartments,
  onSelect,
}: EditDepartmentProps) {
  return (
    <div className="flex flex-col mb-4 sm:flex-row">
      <label className="text-sm font-semibold mb-1 sm:mb-0 sm:w-28 min-w-[5rem] mt-2 sm:mt-0">
        학과
      </label>

      <div className="w-full sm:flex-1">
        <input
          value={departmentInput}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!isEditing}
          className="block w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
        />

        {isEditing && filteredDepartments.length > 0 && (
          <ul className="relative z-10 mt-1 overflow-y-auto bg-white border rounded max-h-40">
            {filteredDepartments.map((item) => (
              <li
                key={item.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelect(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
