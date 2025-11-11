import { useEffect, useState } from "react";
import HistoryContainer from "./history-container";
import { getOthersAllHistory } from "../../../api/history/history";
export interface HistoryProps {
  historyId: number;
  memberId: number;
  content: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  important: boolean;
}

interface HistoryPropsFromParent {
  onEdit: (history: HistoryProps) => void;
  onGroupedHistoryChange?: (grouped: Record<number, HistoryProps[]>) => void;
  memberId: number;
}

export default function OthersHistory({
  onEdit,
  onGroupedHistoryChange,
  memberId,
}: HistoryPropsFromParent) {
  const [histories, setHistories] = useState<HistoryProps[]>([]);

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

  const fetchHistory = async () => {
    try {
      const data = await getOthersAllHistory(memberId);

      const sorted = data.sort(
        (a: HistoryProps, b: HistoryProps) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setHistories(sorted);

      const grouped = groupByYear(sorted);
      onGroupedHistoryChange?.(grouped); // 부모에게 전달
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <div className="space-y-4">
        {histories.map((history) => (
          <HistoryContainer
            key={history.historyId}
            {...history}
            onDelete={() => {}}
            onEdit={onEdit}
          />
        ))}
      </div>
    </>
  );
}
