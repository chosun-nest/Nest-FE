// 프로젝트 등록 스텝 리스트 (사이드바)
interface StepSidebarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

const steps = [
  "프로젝트 상세",
  // API 미지원으로 날짜/미팅 방식 스텝 제거
  // "일정 및 미팅 방식",
  "모집 인원 및 역할",
  "등록 완료"
];

export default function StepSidebar({ currentStep, totalSteps, progress }: StepSidebarProps) {
  return (
    <aside className="hidden md:block w-[200px] text-sm text-gray-600">
      <div className="sticky top-28">
        {/* 진행률 표시 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">전체 진행률</div>
          <div className="text-2xl font-bold text-blue-600">{progress}%</div>
        </div>

        <ol className="space-y-4">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isDone = stepNumber < currentStep;

            return (
              <li key={label} className="flex items-start gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold border transition-all
                    ${isActive ? "bg-blue-700 text-white border-blue-700" : isDone ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-400 border-gray-300"}`}
                >
                  {isDone ? "✓" : stepNumber}
                </div>
                <span className={`text-sm ${isActive ? "text-blue-700 font-bold" : isDone ? "text-blue-600" : "text-gray-500"}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
