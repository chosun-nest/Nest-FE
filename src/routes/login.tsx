import { useNavigate } from "react-router-dom";
import * as S from "../assets/styles/auth.styles";
import useResponsive from "../hooks/responsive";
import { useState } from "react";
import { login } from "../api/auth/auth";
import { AxiosError } from "axios"; // 꼭 위에 import 해줘야 해!

export default function Login() {
  const isMobile = useResponsive();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      const { accessToken, refreshToken, memberId, email: userEmail } = res;
      localStorage.setItem("accesstoken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ memberId, email: userEmail })
      );
      navigate("/");
    } catch (error) {
      const err = error as AxiosError;
      setErr("에러 발생");
      if (err.response) {
        console.error("❌ 서버 응답 상태:", err.response.status);
        console.error("❌ 서버 메시지:", err.response.data); // 여기에 상세 메시지가 있을 수도 있음
      } else {
        console.error("❌ 네트워크 에러 또는 기타:", err.message);
      }
    }
  };

  return (
    <S.Container>
      {/* 로고 위치를 동적으로 조절 */}
      <S.Header $isMobile={isMobile}>
        <S.LogoText>WantIT-Nest</S.LogoText>
      </S.Header>
      {/*로그인 박스*/}
      <S.LoginBox>
        {/* 이메일 및 비밀번호 입력 */}
        <S.InputTitle>이메일</S.InputTitle>
        <S.Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <S.InputTitle>비밀번호</S.InputTitle>
        <S.Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* 에러 메시지 출력 */}
        {err && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "0.5rem" }}>
            {err}
          </p>
        )}
        <S.LoginButton onClick={handleLogin}>로그인</S.LoginButton>
        <S.FindContainer>
          <S.AccountLink to="/find-id">
            <S.FindButton>아이디 찾기</S.FindButton>
          </S.AccountLink>
          <S.AccountLink to="/password-reset">
            <S.FindButton>비밀번호 찾기</S.FindButton>
          </S.AccountLink>
        </S.FindContainer>
        <S.AccountLink to="/signup">
          <S.SigninButton>회원 가입하기</S.SigninButton>
        </S.AccountLink>
      </S.LoginBox>
    </S.Container>
  );
}
