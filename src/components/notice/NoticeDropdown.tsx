import { Listbox } from "@headlessui/react"; //설치 필요 패키지 (한 번만) - npm install @headlessui/react lucide-react
import { ChevronDown, Check } from "lucide-react"; // 아이콘 없으면 제거해도 됨

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

const categories = [
  "전체",
  "일반공지",
  "학사공지",
  "장학공지",
  "SW중심대학사업단",
  "IT융합대학",
  "컴퓨터공학전공",
  "정보통신공학전공",
  "인공지능공학전공",
  "모빌리티SW전공",
];

export default function NoticeDropdown({ selected, onChange }: Props) {
  return (
    <div className="mb-4 w-60">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          {/* 선택된 항목 표시 버튼 */}
          <Listbox.Button className="w-full py-2 pl-4 pr-10 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <span>{selected}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </span>
          </Listbox.Button>

          {/* 옵션 리스트 */}
          <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {categories.map((category) => (
              <Listbox.Option
                key={category}
                value={category}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                      {category}
                    </span>
                    {selected && (
                      <span className="absolute left-2 top-2.5 text-blue-600">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
