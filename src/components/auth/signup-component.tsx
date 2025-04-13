import { useEffect } from "react";
import * as S from "../../assets/styles/auth.styles";
import { SignUpComponentProps } from "../../types/signup";

export default function SignUpComponent({
  selected,
  onChangeSelected,
  email,
  onChangeEmail,
  authCode,
  onChangeAuthCode,
  handleSendCode,
  handleVerifyCode,
  timer,
  password,
  onChangePassword,
  confirmPassword,
  onChangeConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  onNext,
  getItems,
  isEmailVerified,
}: SignUpComponentProps) {
  const hasTwoCharTypes =
    /(?=(?:.*[a-zA-Z])(?:.*[0-9!@#$%^&*()\-_=+{};:,<.>])|(?:.*[0-9])(?:.*[a-zA-Z!@#$%^&*()\-_=+{};:,<.>])|(?:.*[!@#$%^&*()\-_=+{};:,<.>])(?:.*[a-zA-Z0-9])).{2,}/.test(
      password
    );
  const isLengthValid = /^.{8,32}$/.test(password) && !/\s/.test(password);
  const hasNoRepeatedChars = !/(.)\1\1/.test(password);
  const isConfirmMatch = confirmPassword !== "" && password === confirmPassword;
  const formatTime = (time: number) =>
    `${String(Math.floor(time / 60))}:${String(time % 60).padStart(2, "0")}`;
  // 비밀번호 유효성 검사
  const isPasswordValid =
    hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && isConfirmMatch;

  useEffect(() => {
    if (timer === 0) {
      onChangeAuthCode("");
    }
  }, [timer, onChangeAuthCode]);

  // 혹시나 뚫을까봐 막아둔 코드
  const handleNextClick = () => {
    if (!isPasswordValid) {
      alert("비밀번호 조건을 모두 만족해야 합니다.");
      return;
    }

    onNext();
  };

  return (
    <S.LoginBox>
      <S.HeaderBox>
        <S.HeaderLogo src="/assets/images/logo.png" />
        <S.Title>Welcome to WantIT-NEST</S.Title>
        <S.SigninTitle>회원가입</S.SigninTitle>
      </S.HeaderBox>
      <S.DivisionContainer>
        <S.SigninText>구분</S.SigninText>
        <S.RadioGroup>
          <S.RadioLabel>
            <S.RadioInput
              type="radio"
              name="userType"
              value="재학생"
              checked={selected === "재학생"}
              onChange={() => onChangeSelected("재학생")}
            />
            재학생
          </S.RadioLabel>
          <S.RadioLabel>
            <S.RadioInput
              type="radio"
              name="userType"
              value="일반"
              checked={selected === "일반"}
              onChange={() => onChangeSelected("일반")}
            />
            일반
          </S.RadioLabel>
        </S.RadioGroup>
      </S.DivisionContainer>
      <S.SigninText>이메일 인증</S.SigninText>
      <S.EmailRow></S.EmailRow>
      <S.EmailRow>
        <S.Input
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="example@chosun.ac.kr"
          disabled={isEmailVerified}
        />

        {!isEmailVerified && timer <= 0 && (
          <S.AuthCodeButton onClick={handleSendCode}>
            인증코드 보내기
          </S.AuthCodeButton>
        )}
      </S.EmailRow>

      {!isEmailVerified && timer > 0 && (
        <>
          <S.TimerInputWrapper>
            <S.Input
              type="text"
              placeholder="인증번호 입력"
              value={authCode}
              onChange={(e) => onChangeAuthCode(e.target.value)}
            />
            <S.TimerText>{formatTime(timer)}</S.TimerText>
          </S.TimerInputWrapper>

          {/* 인증번호 확인하기 버튼 */}
          <S.CheckCodeButton onClick={handleVerifyCode}>
            인증번호 확인하기
          </S.CheckCodeButton>
        </>
      )}

      {isEmailVerified && (
        <div
          style={{ marginTop: "10px", color: "#4CAF50", fontWeight: "bold" }}
        >
          ✅ 이메일 인증 완료
        </div>
      )}

      <S.SigninText>비밀번호</S.SigninText>
      <S.PasswordInputWrapper
        onMouseEnter={() => setIsPasswordVisible(true)}
        onMouseLeave={() => setIsPasswordVisible(false)}
      >
        <S.Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="*********"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
        <S.EyeIcon>👁️</S.EyeIcon>
      </S.PasswordInputWrapper>
      <S.SubTextBox>
        <S.SubText $isValid={hasTwoCharTypes}>
          ✓ 영문/숫자/특수문자 중, 2가지 이상 포함
        </S.SubText>
        <S.SubText $isValid={isLengthValid}>
          ✓ 8자 이상 32자 이하 입력 (공백 제외)
        </S.SubText>
        <S.SubText $isValid={hasNoRepeatedChars}>
          ✓ 연속 3자 이상 동일한 문자/숫자 제외
        </S.SubText>
      </S.SubTextBox>
      <S.SigninText>비밀번호 확인</S.SigninText>
      <S.Input
        type="password"
        placeholder="*********"
        value={confirmPassword}
        onChange={(e) => onChangeConfirmPassword(e.target.value)}
      />
      {!isConfirmMatch && (
        <S.SubText $isValid={false}>비밀번호가 일치하지 않습니다.</S.SubText>
      )}
      <S.ButtonRow>
        <S.LoginButton
          disabled={!(isPasswordValid && isEmailVerified)}
          onClick={() => {
            handleNextClick();
            getItems();
          }}
        >
          다음
        </S.LoginButton>
      </S.ButtonRow>
      <div className="flex justify-center mb-[50px]">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>이미 계정이 있나요?</span>
          <a href="/login" className="text-blue-500 hover:underline">
            로그인 하기
          </a>
        </div>
      </div>
    </S.LoginBox>
  );
}
