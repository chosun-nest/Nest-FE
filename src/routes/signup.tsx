import { useState, useEffect } from "react";
import * as S from "../assets/styles/auth.styles";
import SignUpComponent from "../components/auth/signup-component";
import SignUpDetail from "../components/auth/signup-deatil";
import { sendcode, signup, verifycode } from "../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { getDepartments, getTech } from "../api/common/common";
import { Item } from "../types/signup";
import Modal from "../components/common/modal";
import type { ModalContent } from "../types/modal";
import { AxiosError } from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  // 디버그 모드 추가

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<"재학생" | "일반">("일반");

  const [email, setEmail] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [authCode, setAuthCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState<Item | null>(null);
  const [interest, setInterest] = useState<Item[]>([]);
  const [skills, setSkills] = useState<Item[]>([]);

  const [techList, setTechList] = useState<Item[]>([]);
  const [departmentsList, setDepartmentsList] = useState<Item[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const techResponse = await getTech();
      const departmentsResponse = await getDepartments();

      setTechList(
        techResponse.map(
          (item: { techStackId: number; techStackName: string }) => ({
            id: item.techStackId,
            name: item.techStackName,
          })
        )
      );
      setDepartmentsList(
        departmentsResponse.map(
          (item: { departmentId: number; departmentName: string }) => ({
            id: item.departmentId,
            name: item.departmentName,
          })
        )
      );
    } catch (e) {
      console.error("아이템 불러오기 실패:", e);
    }
  };

  const handleSendCode = async () => {
    if (!isEmailValid) {
      setModalContent({
        title: "이메일 형식 오류",
        message: "이메일 형식이 올바르지 않습니다.",
        type: "error",
      });
      setShowModal(true);
      return;
    }

    try {
      setIsLoading(true);
      await sendcode(email);
      setIsEmailVerified(false);
      setTimer(300);
      if (intervalId) clearInterval(intervalId);

      const newInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(newInterval);
            setIntervalId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIntervalId(newInterval);
      setModalContent({
        title: "코드 전송",
        message: "인증 코드가 전송되었습니다.",
        type: "info",
      });
      setShowModal(true);
    } catch (error) {
      console.error("인증코드 전송 실패:", error);
      setModalContent({
        title: "코드 전송 실패",
        message: "인증코드 전송에 실패했습니다. 다시 시도해주세요.",
        type: "error",
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verifycode(email, authCode);
      console.log("응답 데이터:", res);

      if (res === "Email verified successfully") {
        setModalContent({
          title: "인증 완료",
          message: "이메일 인증이 완료되었습니다.",
          type: "info",
        });
        setShowModal(true);
        setIsEmailVerified(true);

        // 이메일 도메인에 따라 자동 설정
        const domain = email.split("@")[1];
        if (domain === "chosun.ac.kr") {
          setSelected("재학생");
        } else {
          setSelected("일반");
        }
      } else {
        setModalContent({
          title: "인증 실패",
          message: "이메일 인증에 실패했습니다.",
          type: "error",
        });
        setShowModal(true);
        setIsEmailVerified(false);
      }
    } catch (e) {
      console.error("이메일 인증 실패:", e);
      setModalContent({
        title: "인증 오류",
        message: "이메일 인증 시도에 오류가 발생했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const handleSignup = async () => {
    try {
      const payload = {
        email,
        password,
        memberName: name,
        memberIsStudent: selected === "재학생",
        departmentIdList: department ? [department.id] : [],
        interestIdList: interest.length > 0 ? interest.map((i) => i.id) : [],
        techStackIdList: skills.length > 0 ? skills.map((i) => i.id) : [],
      };
      const res = await signup(payload);
      console.log("회원가입 응답:", res);

      setModalContent({
        title: "가입 완료",
        message: "회원가입이 완료되었습니다!",
        type: "info",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 409) {
        setModalContent({
          title: "중복된 이메일",
          message: "이미 가입된 이메일입니다.",
          type: "error",
        });
        setShowModal(true);
        return;
      }

      setModalContent({
        title: "회원가입 실패",
        message: "회원가입에 실패했습니다. 다시 시도해주세요.",
        type: "error",
      });
      setShowModal(true);
      console.error("회원가입 실패:", error);
    }
  };

  const [showModal, setShowModal] = useState(false); // 모달 표시 여부

  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  return (
    <S.Container>
      {isLoading && (
        <Modal
          title={"로딩중"}
          message={"잠시만 기다려 주세요."}
          onClose={() => {
            return;
          }}
        />
      )}
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}

      {step === 1 ? (
        <SignUpComponent
          selected={selected}
          onChangeSelected={setSelected}
          email={email}
          onChangeEmail={setEmail}
          authCode={authCode}
          onChangeAuthCode={setAuthCode}
          handleSendCode={handleSendCode}
          handleVerifyCode={handleVerifyCode}
          timer={timer}
          password={password}
          onChangePassword={setPassword}
          confirmPassword={confirmPassword}
          onChangeConfirmPassword={setConfirmPassword}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
          onNext={handleNextStep}
          getItems={getItems}
          isEmailVerified={isEmailVerified}
        />
      ) : (
        <SignUpDetail
          selected={selected}
          onPrev={handlePrevStep}
          name={name}
          onChangeName={setName}
          department={department}
          onChangeDepartment={setDepartment}
          interest={interest}
          onChangeInterest={setInterest}
          skills={skills}
          onChangeSkills={setSkills}
          onSubmit={handleSignup}
          techList={techList}
          departmentsList={departmentsList}
        />
      )}
    </S.Container>
  );
}
