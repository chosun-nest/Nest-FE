// 스텝별 오른쪽 본문 영역
import { useState, useMemo } from "react";
import type { ProjectFormData } from "../../../routes/project-write";
import BoardTagFilterButton from "../../board/tag/BoardTagFilterButton";
import SelectedTagList from "../../board/tag/SelectedTagList";
import TagFilterModal from "../../board/tag/TagFilterModal";

interface StepContentProps {
  currentStep: number;
  formData: ProjectFormData;
  updateForm: (newData: Partial<ProjectFormData>) => void;
  errors?: Record<string, string>; // 선택적 파라미터로 유지
}

export function StepContent({ currentStep, formData, updateForm, errors = {} }: StepContentProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // 에러 표시 컴포넌트 (errors가 없을 때도 안전하게 처리)
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors || !errors[field]) return null;
    return (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    );
  };

  return (
    <div className="flex-1 w-full">
      {/* STEP1 : 프로젝트 제목, 분야, 상세 설명 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              프로젝트 제목 <span className="text-[#002F6C]">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors?.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="예: 누구나 참여할 수 있는 오픈소스 기여 프로젝트"
              value={formData.title}
              onChange={(e) => updateForm({ title: e.target.value })}
            />
            <ErrorMessage field="title" />
          </div>

          <div>    
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              프로젝트 분야 <span className="text-[#002F6C]">*</span>
            </label>
            
            {/* 태그 리스트 및 필터 */}
            <div className="mt-2 mb-4">
              <BoardTagFilterButton onOpenFilter={() => setShowFilterModal(true)} />
            </div>

            <SelectedTagList
              selectedTags={formData.tags}
              onRemoveTag={(tag) =>
                updateForm({ tags: formData.tags.filter((t) => t !== tag) })
              }
            />
            <ErrorMessage field="tags" />
            
            {showFilterModal && (
              <TagFilterModal
                onClose={() => setShowFilterModal(false)}
                onApply={(tags) => {
                  updateForm({ tags });
                  setShowFilterModal(false);
                }}
              />
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              프로젝트 상세 내용 <span className="text-[#002F6C]">*</span>
            </label>
            <textarea
              rows={10}
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical
                ${errors?.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder={`예시)
- 프로젝트 주제: 
- 프로젝트 목표: 
- 예상 프로젝트 일정(횟수):`}
              value={formData.description}
              onChange={(e) => updateForm({ description: e.target.value })}
            />
            <ErrorMessage field="description" />
          </div>
        </div>
      )}

      {/* STEP2 : 날짜와 미팅 방식 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              지원자 모집 마감일 <span className="text-[#002F6C]">*</span>
            </label>
            <input 
              type="date" 
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors?.deadline ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={formData.deadline}
              min={today}
              onChange={(e) => updateForm({ deadline: e.target.value })}
            />
            <ErrorMessage field="deadline" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                프로젝트 시작일 <span className="text-[#002F6C]">*</span>
              </label>
              <input 
                type="date" 
                className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                  ${errors?.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                value={formData.startDate}
                min={formData.deadline || today}
                onChange={(e) => updateForm({ startDate: e.target.value })}
              />
              <ErrorMessage field="startDate" />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                프로젝트 종료일 <span className="text-[#002F6C]">*</span>
              </label>
              <input 
                type="date" 
                className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                  ${errors?.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                value={formData.endDate}
                min={formData.startDate || today}
                onChange={(e) => updateForm({ endDate: e.target.value })}
              />
              <ErrorMessage field="endDate" />
            </div>
          </div>

          {/* 날짜 순서 에러 표시 */}
          <ErrorMessage field="dateOrder" />

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              미팅 방식 <span className="text-[#002F6C]">*</span>
            </label>
            <div className="flex gap-3">
              {(["온라인", "오프라인", "혼합"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateForm({ meetingType: type })}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors
                    ${formData.meetingType === type
                      ? "bg-[#002F6C] text-white border-[#002F6C]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP3 : 역할 입력 및 내 역할 선택 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              필요한 역할 입력 <span className="text-[#002F6C]">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors?.role ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={formData.roles[0]?.role || ""}
              onChange={(e) =>
                updateForm({ 
                  roles: [{ 
                    role: e.target.value.toUpperCase(), 
                    count: formData.roles[0]?.count || 1 
                  }] 
                })
              }
              placeholder="예: PM, FRONTEND, BACKEND, AI, DESIGN, ETC"
            />
            <ErrorMessage field="role" />
            <p className="mt-1 text-xs text-gray-500">
              역할명은 자동으로 대문자로 변환됩니다.
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              총 모집 인원 <span className="text-[#002F6C]">*</span>
            </label>
            <input
              type="number"
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors?.count ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={formData.roles[0]?.count || 1}
              onChange={(e) =>
                updateForm({ 
                  roles: [{ 
                    role: formData.roles[0]?.role || "", 
                    count: Math.max(1, Number(e.target.value))
                  }]
                })
              }
              min={1}
              max={20}
            />
            <ErrorMessage field="count" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              내가 맡은 역할 <span className="text-[#002F6C]">*</span>
            </label>
            <select 
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors?.myRole ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={formData.myRole}
              onChange={(e) => updateForm({ myRole: e.target.value })}
            >
              <option value="">역할을 선택해주세요</option>
              <option value="PM">PM</option>
              <option value="FRONTEND">FRONTEND</option>
              <option value="BACKEND">BACKEND</option>
              <option value="AI">AI</option>
              <option value="DESIGN">DESIGN</option>
              <option value="ETC">ETC</option>
            </select>
            <ErrorMessage field="myRole" />
          </div>
        </div>
      )}

      {/* 전체 에러 메시지 표시 (errors가 있을 때만) */}
      {errors && Object.keys(errors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-semibold text-red-800 mb-2">입력 확인이 필요합니다:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
{/* {currentStep === 4 && (
  <div className="space-y-4 text-center py-20">
    <h2 className="text-2xl font-bold text-[#002F6C]">🎉 프로젝트 등록이 완료되었습니다!</h2>
    <p className="text-gray-600">등록한 프로젝트는 프로젝트 게시판에서 확인하실 수 있습니다.</p>
    <button className="mt-6 px-6 py-3 bg-[#002F6C] text-white rounded hover:bg-[#001f4d]">
      프로젝트 게시판으로 이동
    </button> */}
