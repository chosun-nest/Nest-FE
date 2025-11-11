import { useEffect, useState } from "react";
import HistoryContainer from "./history-container";
import { getOthersAllHistory } from "../../../api/history/history";

export interface HistoryProps {
  historyId: number;
  memberId: number;
  content: string;
  startDate: string;
  endDate: string;
  important: boolean;
}

interface OthersHistoryTimelineProps {
  memberId: number;
}

export default function OthersHistoryTimeline({
  memberId,
}: OthersHistoryTimelineProps) {
  const [groupedData, setGroupedData] = useState<
    Record<number, HistoryProps[]>
  >({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // group by year
  const groupByYear = (
    histories: HistoryProps[]
  ): Record<number, HistoryProps[]> => {
    return histories.reduce(
      (acc, history) => {
        const year = new Date(history.startDate).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(history);
        return acc;
      },
      {} as Record<number, HistoryProps[]>
    );
  };

  // fetch and group
  const fetchAndGroupHistories = async () => {
    try {
      const data = await getOthersAllHistory(memberId);
      const sorted = data.sort(
        (
          a: { startDate: string | number | Date },
          b: { startDate: string | number | Date }
        ) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      const grouped = groupByYear(sorted);
      setGroupedData(grouped);

      // 최신 연도로 자동 선택
      const latestYear =
        Object.keys(grouped)
          .map(Number)
          .sort((a, b) => b - a)[0] || null;
      setSelectedYear(latestYear);
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  useEffect(() => {
    fetchAndGroupHistories();
  }, []);

  const years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full py-4 px-2">
      <div className="relative w-full py-10 px-6 mb-10 overflow-hidden">
        {/* 수평선 */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 z-0" />

        <div className="relative z-10 flex items-end gap-12">
          {/* 항상 좌측 고정: 전체 버튼 */}
          <div
            onClick={() => setSelectedYear(null)}
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
              selectedYear === null
                ? "scale-110"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <div
              className={`w-1.5 h-12 rounded-md transition-all duration-300 ${
                selectedYear === null ? "bg-yellow-400" : "bg-gray-400"
              }`}
            />
            <span
              className={`mt-2 text-sm ${
                selectedYear === null
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              전체
            </span>
          </div>

          {/* 연도 막대기들 */}
          <div className="flex items-end justify-center gap-12 flex-1 transition-all duration-500">
            {years.map((year) => {
              const isSelected = selectedYear === year;

              const direction =
                selectedYear === null
                  ? "center"
                  : year < selectedYear
                    ? "left"
                    : year > selectedYear
                      ? "right"
                      : "center";

              const baseTranslate =
                selectedYear === null
                  ? "translate-x-0"
                  : direction === "left"
                    ? "-translate-x-6"
                    : direction === "right"
                      ? "translate-x-6"
                      : "translate-x-0";

              return (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`group flex flex-col items-center cursor-pointer transition-transform duration-500 ${baseTranslate}`}
                >
                  <div
                    className={`w-1.5 h-12 rounded-md transition-all duration-300 ease-in-out group-hover:scale-y-125 ${
                      isSelected ? "bg-[#002f6c]" : "bg-gray-400"
                    }`}
                  />
                  <span
                    className={`mt-2 text-sm transition-all duration-300 ease-in-out ${
                      isSelected
                        ? "text-[#002f6c] font-semibold"
                        : "text-gray-500 group-hover:opacity-100"
                    }`}
                  >
                    {year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 히스토리 목록 */}
      <div className="space-y-4">
        {(selectedYear === null
          ? years.flatMap((y) => groupedData[y] || [])
          : groupedData[selectedYear] || []
        ).map((history) => (
          <HistoryContainer
            key={history.historyId}
            {...history}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
