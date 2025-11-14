// 프로젝트 등록 하단 버튼들(조건: 이전, 다음, 취소, 등록)
import { useState } from "react";

interface StepFooterProps {
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onCancel: () => void;
  onComplete: () => Promise<void> | void;
  onSaveDraft?: () => void;
  onPreview?: () => void;
  isEditMode?: boolean;
}

export default function StepFooter({
  step: currentStep,
  totalSteps,
  onPrev,
  onNext,
  onCancel,
  onComplete: onSubmit,
  onSaveDraft: _onSaveDraft,
  onPreview,
  isEditMode = false,
}: StepFooterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  // 제출 핸들러 (로딩 상태 관리)
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {/* 추가 액션 버튼들 (미리보기) */}
      {onPreview && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={onPreview}
            className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            📄 미리보기
          </button>
        </div>
      )}

      {/* 메인 네비게이션 버튼들 */}
      <div className="flex justify-between items-center">
        {/* 이전 버튼 */}
        <div>
          {!isFirst && (
            <button
              onClick={onPrev}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← 이전
            </button>
          )}
        </div>

        {/* 취소 & 다음 or 등록 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            취소
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-md bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEditMode ? "수정 중..." : "등록 중..."}
                </>
              ) : (
                isEditMode ? "수정하기" : "등록하기"
              )}
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-md bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음 단계 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}