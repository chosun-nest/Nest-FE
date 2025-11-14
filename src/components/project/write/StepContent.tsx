// 스텝별 오른쪽 본문 영역
import { useState } from "react";
import type { ProjectFormData, ProjectRole } from "../../../routes/project-write";
import BoardTagFilterButton from "../../board/tag/BoardTagFilterButton";
import SelectedTagList from "../../board/tag/SelectedTagList";
import TagFilterModal from "../../board/tag/TagFilterModal";

interface StepContentProps {
  currentStep: number;
  formData: ProjectFormData;
  updateForm: (newData: Partial<ProjectFormData>) => void;
  errors?: Record<string, string>;
}

// 사용 가능한 역할 목록
const AVAILABLE_ROLES: { value: ProjectRole; label: string }[] = [
  { value: "FRONTEND", label: "프론트엔드" },
  { value: "BACKEND", label: "백엔드" },
  { value: "PM", label: "PM" },
  { value: "DESIGN", label: "디자인" },
  { value: "AI", label: "AI" },
  { value: "ETC", label: "기타" },
];

export function StepContent({ currentStep, formData, updateForm, errors = {} }: StepContentProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 에러 표시 컴포넌트
  const ErrorMessage = ({ field }: { field: string }) => {
    if (!errors || !errors[field]) return null;
    return <p className="mt-1 text-sm text-red-600">{errors[field]}</p>;
  };

  // 역할 추가
  const addRole = () => {
    const newRole = { role: "FRONTEND" as ProjectRole, count: 1 };
    updateForm({ roles: [...formData.roles, newRole] });
  };

  // 역할 제거
  const removeRole = (index: number) => {
    const newRoles = formData.roles.filter((_, i) => i !== index);
    updateForm({ roles: newRoles });
  };

  // 역할 업데이트
  const updateRole = (index: number, field: "role" | "count", value: ProjectRole | number) => {
    const newRoles = [...formData.roles];
    if (field === "role") {
      newRoles[index].role = value as ProjectRole;
    } else {
      newRoles[index].count = value as number;
    }
    updateForm({ roles: newRoles });
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

      {/* API 미지원으로 STEP 2 (날짜/미팅 방식) 주석처리 */}
      {/* {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              지원자 모집 마감일 <span className="text-[#002F6C]">*</span>
            </label>
            <input
              type="date"
              className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
              value={formData.deadline}
              onChange={(e) => updateForm({ deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              미팅 방식 <span className="text-[#002F6C]">*</span>
            </label>
            <div className="flex gap-3">
              {(["온라인", "오프라인", "혼합"] as const).map((type) => (
                <button key={type} type="button" onClick={() => updateForm({ meetingType: type })}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors
                    ${formData.meetingType === type ? "bg-[#002F6C] text-white" : "bg-white text-gray-700 border-gray-300"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )} */}

      {/* STEP 2 (기존 STEP 3) : 다중 역할 입력 및 내 역할 선택 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-gray-700">
                모집 역할 및 인원 <span className="text-[#002F6C]">*</span>
              </label>
              <button
                type="button"
                onClick={addRole}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                + 역할 추가
              </button>
            </div>

            <ErrorMessage field="roles" />

            {/* 역할 리스트 */}
            <div className="space-y-4">
              {formData.roles.map((roleItem, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      {/* 역할 선택 */}
                      <div>
                        <label className="block mb-2 text-xs font-medium text-gray-600">
                          역할
                        </label>
                        <select
                          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                            ${errors?.[`role_${index}`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                          value={roleItem.role}
                          onChange={(e) => updateRole(index, "role", e.target.value as ProjectRole)}
                        >
                          {AVAILABLE_ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage field={`role_${index}`} />
                      </div>

                      {/* 인원 수 */}
                      <div>
                        <label className="block mb-2 text-xs font-medium text-gray-600">
                          모집 인원
                        </label>
                        <input
                          type="number"
                          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                            ${errors?.[`count_${index}`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                          value={roleItem.count}
                          onChange={(e) => updateRole(index, "count", Math.max(1, Number(e.target.value)))}
                          min={1}
                          max={20}
                        />
                        <ErrorMessage field={`count_${index}`} />
                      </div>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => removeRole(index)}
                      className="mt-7 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                      disabled={formData.roles.length === 1}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 총 모집 인원 표시 */}
            {formData.roles.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>총 모집 인원:</strong>{" "}
                  {formData.roles.reduce((sum, r) => sum + r.count, 0)}명
                </p>
              </div>
            )}
          </div>

          {/* 내 역할 선택 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              내가 맡은 역할 <span className="text-[#002F6C]">*</span>
            </label>
            <select
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors?.myRole ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              value={formData.myRole}
              onChange={(e) => updateForm({ myRole: e.target.value as ProjectRole })}
            >
              {AVAILABLE_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
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
