import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import {
  getUsersAllHistory,
  updateHistory,
} from "../../../api/history/history";
import { HistoryProps } from "./history";

export interface MyPinProps {
  title: string;
  editable?: boolean;
}

export default function MyPin({ title, editable = false }: MyPinProps) {
  const [pinnedItems, setPinnedItems] = useState<HistoryProps[]>([]);

  const fetchPinnedHistories = async () => {
    try {
      const histories: HistoryProps[] = await getUsersAllHistory();
      const pinned = histories.filter((h) => h.important);
      setPinnedItems(pinned);
    } catch (error) {
      console.error("히스토리 불러오기 실패:", error);
    }
  };

  const toggleImportant = async (item: HistoryProps) => {
    try {
      await updateHistory(item.historyId, {
        content: item.content,
        startDate: item.startDate,
        endDate: item.endDate,
        important: !item.important,
      });
      fetchPinnedHistories();
    } catch (error) {
      console.error("중요 여부 업데이트 실패:", error);
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
                  onClick={() => toggleImportant(item)}
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
