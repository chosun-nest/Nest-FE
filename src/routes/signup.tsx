import { useState } from "react";
import * as S from "../assets/styles/login.styles";
import SignUpComponent from "../components/auth/signup-component";
import SignUpDetail from "../components/auth/signup-deatil";
import { sendcode, signup, verifycode } from "../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { getInterests, getTech } from "../api/common/common";

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<"재학생" | "일반">("재학생");

  const [email, setEmail] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [authCode, setAuthCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // 컴포넌트 values를 여기에 모아줌
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(""); // 재학생 전용
  const [interest, setInterest] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [techList, setTechList] = useState<string[]>([]);
  const [interestsList, setInterestsList] = useState<string[]>([]);

  const getItems = async () => {
    try {
      const techResponse = await getTech(); // ✅ await 추가
      const interestsResponse = await getInterests(); // ✅ await 추가

      const techNames = techResponse.map(
        (item: { techStackName: unknown }) => item.techStackName
      );
      const interestNames = interestsResponse.map(
        (item: { interestName: unknown }) => item.interestName
      );

      setTechList(techNames);
      setInterestsList(interestNames);
    } catch (e) {
      console.log("아이템 불러오기 실패", e);
    }
  };

  const handleVerifyCode = () => {
    try {
      const res = verifycode(email, authCode);
      console.log(res);
    } catch (e) {
      alert("오류 발생!");
      console.log(e);
    }
  };

  const handleSendCode = () => {
    if (!isEmailValid) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    try {
      // 중복 검사
      const data = sendcode(email);
      console.log(data);
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
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignup = async () => {
    try {
      const payload = {
        email,
        password,
        userType: selected,
        name,
        interest,
        skills,
        ...(selected === "재학생" && { department }),
      };

      console.log(payload);
      const res = await signup(payload);
      // ✅ 응답에서 정보 추출
      const { accessToken, refreshToken, memberId, email: userEmail } = res;

      // ✅ 로컬 스토리지에 저장
      localStorage.setItem("accesstoken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ memberId, email: userEmail })
      );
      alert("회원가입이 완료되었습니다!");
      console.log("가입한 사용자 ID:", res.userId);
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  return (
    <S.Container>
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
          interestsList={interestsList}
        />
      )}
    </S.Container>
  );
}
