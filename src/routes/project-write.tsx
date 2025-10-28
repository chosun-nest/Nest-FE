// 프로젝트 등록 페이지(프로젝트 글쓰기 페이지)
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepSidebar from "../components/project/write/StepSidebar";
import { StepContent } from "../components/project/write/StepContent";
import StepFooter from "../components/project/write/StepFooter";
import ProjectWriteComplete from "./project-write-complete";
import Navbar from "../components/layout/navbar";
import BoardTypeSelector from "../components/board/write/BoardTypeSelector";
import { createProjectPost } from "../api/project/ProjectAPI";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";


export type ProjectFormData = {
  title: string;
  category: string;
  description: string;
  deadline: string;
  startDate: string;
  endDate: string;
  meetingType: "온라인" | "오프라인" | "혼합";
  roles: { role: string; count: number }[];
  myRole: string;
  tags: string[];
};

const initialFormData: ProjectFormData = {
  title: "",
  category: "개발",
  description: `[개발 프로젝트 모집 예시]
- 프로젝트 주제: 
- 프로젝트 목표: 
- 예상 프로젝트 일정(횟수):`,
  deadline: "",
  startDate: "",
  endDate: "",
  meetingType: "온라인",
  roles: [{ role: "FRONTEND", count: 1 }],
  myRole: "LEADER",
  tags: [],
};

export default function ProjectWrite() {
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);

  const [navHeight, setNavHeight] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

    // 각 단계별 검증 로직 추가
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
        // if (formData.tags.length === 0) {
        //   newErrors.tags = "최소 1개 이상의 태그를 선택해주세요.";
        // }
        break;
      case 2:
        if (!formData.deadline) {
          newErrors.deadline = "모집 마감일을 선택해주세요.";
        }
        if (!formData.startDate) {
          newErrors.startDate = "프로젝트 시작일을 선택해주세요.";
        }
        if (!formData.endDate) {
          newErrors.endDate = "프로젝트 종료일을 선택해주세요.";
        }
        // 날짜 순서 검증
        if (formData.deadline && formData.startDate && formData.deadline >= formData.startDate) {
          newErrors.dateOrder = "모집 마감일은 프로젝트 시작일보다 이전이어야 합니다.";
        }
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
          newErrors.dateOrder = "프로젝트 시작일은 종료일보다 이전이어야 합니다.";
        }
        break;
      case 3:
        if (!formData.roles[0]?.role.trim()) {
          newErrors.role = "필요한 역할을 입력해주세요.";
        }
        if (!formData.roles[0]?.count || formData.roles[0].count < 1) {
          newErrors.count = "최소 1명 이상 모집해야 합니다.";
        }
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
    setStep((prev) => Math.min(prev + 1, 4));
    setErrors({});  // 에러로 인한 스텝 이동 방지 해제
    }
  };
  const goPrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({}); // 에러 초기화
  };
  // const goToBoard = () => setStep(4);

  // const updateForm = (newData: Partial<ProjectFormData>) => {
  //   setFormData((prev) => ({ ...prev, ...newData }));
  // };

  // API 연동
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      // API 페이로드 생성
      const payload = {
        projectTitle: formData.title,
        projectDescription: formData.description,
        isRecruiting: true,
        tags: formData.tags,
        partCounts: {
          [formData.roles[0].role]: formData.roles[0].count
        },
        creatorPart: formData.myRole,
        creatorRole: "LEADER",
        // 추가로 필요한 필드들 (API 스펙에 따라 조정하기)
        maximumNumberOfMembers: formData.roles[0].count,
        deadline: formData.deadline,
        startDate: formData.startDate,
        endDate: formData.endDate,
        meetingType: formData.meetingType,
      };

      await createProjectPost(payload); // 프로젝트 모집글 생성 API 호출
      setStep(4); // 완료 페이지로 이동
    } catch (error) {
      console.error("프로젝트 등록 실패:", error);
      setModalContent({
        title: "등록 실패",
        message: "프로젝트 등록에 실패했습니다. 다시 시도해주세요.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setModalContent({
      title: "작성 취소",
      message: "작성을 취소하시겠습니까? 작성된 내용이 모두 사라집니다.",
      type: "info",
      onClose: () => {
        setShowModal(false);
        navigate("/project-board");
      },
    });
    setShowModal(true);
  };

  const updateForm = (newData: Partial<ProjectFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    // 데이터 변경 시 해당 필드의 에러 제거
    if (errors) {
      const newErrors = { ...errors };
      Object.keys(newData).forEach(key => {
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
        </div>
      
        {/* 게시판 선택 드롭 다운 제목 */}
        <BoardTypeSelector boardType="projects" />

        {/* 안내 메시지 */}
        <div className="p-3 mb-6 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
          <strong>프로젝트 모집 예시를 참고해 작성해주세요.</strong>
          <br />
          꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요.
        </div>

        {/* 본문 */}
        <div className="flex flex-col md:flex-row gap-8">
          <StepSidebar currentStep={step} />
          <div className="flex-1">
            {step === 4 ? (
              <ProjectWriteComplete />
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
                totalSteps={3}
                onPrev={goPrev}
                onNext={goNext}
                onCancel={handleCancel}
                onComplete={handleSubmit}
                />
              </>
            )}
          </div>
        </div>
      </div>

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
