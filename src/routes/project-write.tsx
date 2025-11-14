// 프로젝트 등록 페이지(프로젝트 글쓰기 페이지)
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepSidebar from "../components/project/write/StepSidebar";
import { StepContent } from "../components/project/write/StepContent";
import StepFooter from "../components/project/write/StepFooter";
import ProjectWriteComplete from "./project-write-complete";
import Navbar from "../components/layout/navbar";
import BoardTypeSelector from "../components/board/write/BoardTypeSelector";
import { createProjectPost, updateProject } from "../api/project/ProjectAPI";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import type { ProjectDetail } from "../types/api/project-board";

// 역할 타입 정의
export type ProjectRole = "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";

export type ProjectFormData = {
  title: string;
  description: string;
  // 아래 필드들은 API 미지원으로 주석처리 (추후 지원 시 활성화)
  // deadline: string;
  // startDate: string;
  // endDate: string;
  // meetingType: "온라인" | "오프라인" | "혼합";
  roles: { role: ProjectRole; count: number }[];
  myRole: ProjectRole;
  tags: string[];
};

const initialFormData: ProjectFormData = {
  title: "",
  description: `[개발 프로젝트 모집 예시]
- 프로젝트 주제:
- 프로젝트 목표:
- 예상 프로젝트 일정(횟수):`,
  // API 미지원 필드는 주석처리
  // deadline: "",
  // startDate: "",
  // endDate: "",
  // meetingType: "온라인",
  roles: [],
  myRole: "FRONTEND",
  tags: [],
};

// 로컬스토리지 키
const AUTOSAVE_KEY = "project-write-autosave";
const AUTOSAVE_INTERVAL = 30000; // 30초마다 자동저장

export default function ProjectWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);

  // 수정 모드 확인
  const editMode = location.state?.project as ProjectDetail | undefined;
  const isEditMode = !!editMode;

  const [navHeight, setNavHeight] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    // 수정 모드인 경우 기존 데이터 로드
    if (editMode) {
      const roles: { role: ProjectRole; count: number }[] = [];

      // parts 객체를 roles 배열로 변환
      Object.entries(editMode.parts || {}).forEach(([role, count]) => {
        roles.push({ role: role as ProjectRole, count });
      });

      return {
        title: editMode.projectTitle,
        description: editMode.projectDescription,
        roles,
        myRole: editMode.creatorPart as ProjectRole,
        tags: editMode.tags || [],
      };
    }

    // 로컬스토리지에서 자동저장된 데이터 복원
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFormData;
      }
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);

  // Navbar 높이 설정
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  // 자동저장 기능
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.description || formData.roles.length > 0) {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
        setLastSaved(new Date());
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData]);

  // 페이지 이탈 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.title || formData.description || formData.roles.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  // 각 단계별 검증 로직
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = "프로젝트 제목을 입력해주세요.";
        }
        if (!formData.description.trim()) {
          newErrors.description = "프로젝트 설명을 입력해주세요.";
        }
        break;

      // API 미지원으로 STEP 2 주석처리 (날짜 및 미팅 방식)
      // case 2:
      //   if (!formData.deadline) {
      //     newErrors.deadline = "모집 마감일을 선택해주세요.";
      //   }
      //   if (!formData.startDate) {
      //     newErrors.startDate = "프로젝트 시작일을 선택해주세요.";
      //   }
      //   if (!formData.endDate) {
      //     newErrors.endDate = "프로젝트 종료일을 선택해주세요.";
      //   }
      //   break;

      case 2: // 기존 STEP 3을 STEP 2로 변경
        if (formData.roles.length === 0) {
          newErrors.roles = "최소 1개 이상의 역할을 추가해주세요.";
        }

        // 각 역할별 검증
        formData.roles.forEach((roleItem, index) => {
          if (!roleItem.role) {
            newErrors[`role_${index}`] = `역할 ${index + 1}의 타입을 선택해주세요.`;
          }
          if (!roleItem.count || roleItem.count < 1) {
            newErrors[`count_${index}`] = `역할 ${index + 1}의 인원은 최소 1명 이상이어야 합니다.`;
          }
        });

        if (!formData.myRole) {
          newErrors.myRole = "본인의 역할을 선택해주세요.";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3)); // 총 2단계로 변경
      setErrors({});
    }
  };

  const goPrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  // 진행률 계산
  const getProgress = (): number => {
    let completed = 0;
    let total = 0;

    // Step 1 체크
    total += 2;
    if (formData.title.trim()) completed++;
    if (formData.description.trim()) completed++;

    // Step 2 체크
    total += 2;
    if (formData.roles.length > 0) completed++;
    if (formData.myRole) completed++;

    return Math.round((completed / total) * 100);
  };

  // API 연동
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    try {
      // ✅ API 페이로드 생성 (parts 사용)
      const parts: { [key: string]: number } = {};
      formData.roles.forEach((roleItem) => {
        parts[roleItem.role] = roleItem.count;
      });

      // 리더의 역할이 parts에 없으면 추가 (리더도 한 자리 차지)
      if (!parts[formData.myRole]) {
        parts[formData.myRole] = 1;
      } else {
        // 이미 있으면 카운트 증가 (리더 자리 포함)
        parts[formData.myRole] += 1;
      }

      // 최대 인원 계산 (리더 포함한 모든 역할의 인원 합계)
      const maximumNumberOfMembers = Object.values(parts).reduce(
        (sum, count) => sum + count,
        0
      );

      if (isEditMode && editMode) {
        // 수정 모드
        const updatePayload = {
          projectTitle: formData.title,
          projectDescription: formData.description,
          isRecruiting: editMode.isRecruiting, // 기존 상태 유지
          tags: formData.tags,
          parts,
          imageUrls: null,
          membersToRemove: [],
        };

        await updateProject(editMode.projectId, updatePayload);
        setModalContent({
          title: "수정 완료",
          message: "프로젝트가 성공적으로 수정되었습니다.",
          type: "info",
          onClose: () => {
            setShowModal(false);
            navigate(`/project/${editMode.projectId}`);
          },
        });
        setShowModal(true);
      } else {
        // 신규 등록 모드
        const payload = {
          projectTitle: formData.title,
          projectDescription: formData.description,
          isRecruiting: true,
          tags: formData.tags,
          parts,
          creatorPart: formData.myRole,
          creatorRole: "LEADER",
          maximumNumberOfMembers,
        };

        const response = await createProjectPost(payload);
        // 성공 시 로컬스토리지 자동저장 데이터 삭제
        localStorage.removeItem(AUTOSAVE_KEY);
        setCreatedProjectId(response.projectId);
        setStep(3); // 완료 페이지로 이동
      }
    } catch (error) {
      console.error(isEditMode ? "프로젝트 수정 실패:" : "프로젝트 등록 실패:", error);
      setModalContent({
        title: isEditMode ? "수정 실패" : "등록 실패",
        message: isEditMode
          ? "프로젝트 수정에 실패했습니다. 다시 시도해주세요."
          : "프로젝트 등록에 실패했습니다. 다시 시도해주세요.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setModalContent({
      title: "작성 취소",
      message: "작성을 취소하시겠습니까? 자동저장된 내용도 모두 삭제됩니다.",
      type: "info",
      onClose: () => {
        localStorage.removeItem(AUTOSAVE_KEY);
        setShowModal(false);
        navigate("/project-board");
      },
    });
    setShowModal(true);
  };

  // 임시저장 기능 (수동)
  const handleSaveDraft = () => {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
    setLastSaved(new Date());
    setModalContent({
      title: "임시저장 완료",
      message: "작성 중인 내용이 임시저장되었습니다.",
      type: "info",
      onClose: () => setShowModal(false),
    });
    setShowModal(true);
  };

  // 임시저장 불러오기 (현재 미사용)
  // const handleLoadDraft = () => {
  //   const saved = localStorage.getItem(AUTOSAVE_KEY);
  //   if (saved) {
  //     try {
  //       const loadedData = JSON.parse(saved);
  //       setFormData(loadedData);
  //       setModalContent({
  //         title: "불러오기 완료",
  //         message: "임시저장된 내용을 불러왔습니다.",
  //         type: "info",
  //         onClose: () => setShowModal(false),
  //       });
  //       setShowModal(true);
  //     } catch {
  //       setModalContent({
  //         title: "불러오기 실패",
  //         message: "임시저장된 내용을 불러올 수 없습니다.",
  //         type: "error",
  //         onClose: () => setShowModal(false),
  //       });
  //       setShowModal(true);
  //     }
  //   }
  // };

  const updateForm = (newData: Partial<ProjectFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    // 데이터 변경 시 해당 필드의 에러 제거
    if (errors) {
      const newErrors = { ...errors };
      Object.keys(newData).forEach((key) => {
        delete newErrors[key];
      });
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-5xl mx-auto px-4 pt-6 pb-10"
        style={{ paddingTop: navHeight + 24 }}
      >
        {/* 상단 바 */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/project-board")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ⬅ 프로젝트 게시판으로 이동
          </button>

          {/* 자동저장 상태 & 임시저장 버튼 */}
          {step < 3 && (
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-xs text-gray-400">
                  마지막 저장: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleSaveDraft}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                임시저장
              </button>
            </div>
          )}
        </div>

        {/* 게시판 선택 드롭 다운 제목 */}
        <BoardTypeSelector boardType="projects" />

        {/* 수정 모드 표시 */}
        {isEditMode && (
          <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
            <p className="text-sm font-medium text-amber-800">
              ✏️ 프로젝트 수정 모드입니다.
            </p>
          </div>
        )}

        {/* 진행률 표시 */}
        {step < 3 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isEditMode ? "수정" : "작성"} 진행률
              </span>
              <span className="text-sm font-bold text-blue-600">{getProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="p-3 mb-6 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
          <strong>프로젝트 모집 예시를 참고해 작성해주세요.</strong>
          <br />
          꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요.
        </div>

        {/* 본문 */}
        <div className="flex flex-col md:flex-row gap-8">
          <StepSidebar currentStep={step} totalSteps={2} progress={getProgress()} />
          <div className="flex-1">
            {step === 3 ? (
              <ProjectWriteComplete projectId={createdProjectId} />
            ) : (
              <>
                <StepContent
                  currentStep={step}
                  formData={formData}
                  updateForm={updateForm}
                  errors={errors}
                />
                <StepFooter
                  step={step}
                  totalSteps={2}
                  onPrev={goPrev}
                  onNext={goNext}
                  onCancel={handleCancel}
                  onComplete={handleSubmit}
                  onSaveDraft={isEditMode ? undefined : handleSaveDraft}
                  onPreview={() => setShowPreview(true)}
                  isEditMode={isEditMode}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 프리뷰 모달 */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">미리보기</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{formData.title}</h3>
                <div className="flex gap-2 mb-4">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">프로젝트 설명</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{formData.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">모집 역할</h4>
                <div className="space-y-2">
                  {formData.roles.map((roleItem, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-blue-600">{roleItem.role}</span>
                      <span className="text-gray-600">{roleItem.count}명</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-600">
                      작성자 역할: <span className="font-medium text-blue-600">{formData.myRole}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <Modal
          {...modalContent}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}
    </>
  );
}
