import { useEffect, useState } from "react";
import HistoryContainer from "./history-container";
import EditHistoryModal from "./edithistory";
import {
  postAHistory,
  updateHistory,
  deleteHistory,
  getUsersAllHistory,
} from "../../../api/history/history";
import CheckModal from "../../common/checkmodal";

export interface HistoryProps {
  historyId: number;
  memberId: number;
  content: string;
  startDate: string;
  endDate: string;
  important: boolean;
}

export default function HistoryTimeline() {
  const [groupedData, setGroupedData] = useState<
    Record<number, HistoryProps[]>
  >({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<HistoryProps> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
      const data = await getUsersAllHistory();
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
  }, [refreshKey]);

  const handleSuccess = () => {
    setIsAdding(false);
    setIsEditing(false);
    setEditData(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (history: HistoryProps) => {
    setEditData(history);
    setIsEditing(true);
  };

  const handleUpdate = async (data: Partial<HistoryProps>) => {
    if (!data.historyId) return;
    await updateHistory(data.historyId, {
      content: data.content || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      important: data.important || false,
    });
    handleSuccess();
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (pendingDeleteId !== null) {
      await deleteHistory(pendingDeleteId);
      setRefreshKey((prev) => prev + 1);
      setPendingDeleteId(null);
      setShowDeleteModal(false);
    }
  };
  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setShowDeleteModal(false);
  };

  const years = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full py-4 px-2">
      {showDeleteModal && (
        <CheckModal
          title="히스토리 삭제"
          message="정말로 이 히스토리를 삭제하겠습니까?"
          type="info"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 새 히스토리 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#002f6c] text-white px-4 py-2 rounded text-sm hover:bg-blue-900"
        >
          새 히스토리
        </button>
      </div>

      {/* 작성 모달 */}
      <EditHistoryModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onSuccess={handleSuccess}
        onSubmit={postAHistory}
      />

      {/* 수정 모달 */}
      <EditHistoryModal
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditData(null);
        }}
        onSuccess={handleSuccess}
        onSubmit={handleUpdate}
        initialData={editData || {}}
      />
    </div>
  );
}
