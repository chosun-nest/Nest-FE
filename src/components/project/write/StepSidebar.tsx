// 프로젝트 등록 스텝 리스트 (사이드바)
interface StepSidebarProps {
  currentStep: number;
}

const steps = [
  "프로젝트 상세",
  "일정 및 미팅 방식",
  "모집 인원 및 역할",
  "등록 완료"
];

export default function StepSidebar({ currentStep: currentStep }: StepSidebarProps) {
  return (
    <aside className="hidden md:block w-[200px] text-sm text-gray-600">
      <div className="sticky top-28">
        <ol className="space-y-4">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isDone = stepNumber < currentStep;

            return (
              <li key={label} className="flex items-start gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold border transition-all
                    ${isActive ? "bg-blue-700 text-white" : isDone ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-400 border-gray-300"}`}
                >
                  {stepNumber}
                </div>
                <span className={`text-sm ${isActive ? "text-blue-700 font-bold" : "text-gray-500"}`}>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
