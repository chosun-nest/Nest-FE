import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { getOthersAllHistory } from "../../../api/history/history";
import { HistoryProps } from "./history";

export interface PinProps {
  title: string;
  editable?: boolean;
  memberId: number;
}

export default function OthersPin({
  title,
  memberId,
  editable = false,
}: PinProps) {
  const [pinnedItems, setPinnedItems] = useState<HistoryProps[]>([]);

  const fetchPinnedHistories = async () => {
    try {
      const histories: HistoryProps[] = await getOthersAllHistory(memberId);
      const pinned = histories.filter((h) => h.important);
      setPinnedItems(pinned);
    } catch (error) {
      console.error("히스토리 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPinnedHistories();
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>

      {pinnedItems.length > 0 ? (
        <ul className="space-y-2">
          {pinnedItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col text-sm text-gray-700">
                <span className="text-xs text-gray-400 font-medium mb-1">
                  {item.startDate} ~ {item.endDate}
                </span>
                <span className="whitespace-pre-line">{item.content}</span>
              </div>

              {editable && (
                <button
                  onClick={() => {}}
                  className="ml-4 mt-1 transition-transform duration-200 hover:scale-110"
                >
                  {item.important ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-400 ml-1">
          중요 표시된 항목이 없습니다
        </div>
      )}
    </div>
  );
}
