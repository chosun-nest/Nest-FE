import { Link, useNavigate } from "react-router-dom";
import * as S from "../assets/styles/auth.styles";
import useResponsive from "../hooks/responsive";
import { useState } from "react";
import { login } from "../api/auth/auth";
import { AxiosError } from "axios";
import Modal from "../components/common/modal";

import { useDispatch } from "react-redux";
import { setTokens } from "../store/slices/authSlice";

export default function Login() {
  const isMobile = useResponsive();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err] = useState("");

  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // dispatch 초기화
  const dispatch = useDispatch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!isEmailValid) {
      setModalMessage("이메일 형식이 올바르지 않습니다.");
      setShowModal(true); // 모달 표시
      return;
    }
    try {
      const res = await login(email, password);
      dispatch(
        setTokens({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          userId: res.userId,
        })
      );
      navigate("/");
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.data && typeof err.response.data === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg = (err.response.data as any).message;
        setModalMessage(msg || "로그인에 실패했습니다.");
      } else {
        setModalMessage("아이디 혹은 비밀번호가 틀렸습니다.");
      }
      setShowModal(true); // 모달 표시
    }
  };

  return (
    <S.Container onKeyDown={handleKeyDown}>
      {/* 로고 위치를 동적으로 조절 */}
      {showModal && (
        <Modal
          title="로그인 실패"
          message={modalMessage}
          type="error"
          onClose={() => setShowModal(false)}
        />
      )}
      <S.Header $isMobile={isMobile}>
        <Link to="/">
          <S.LogoText>WantIT-Nest</S.LogoText>
        </Link>
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
          <S.AccountLink to="/password-reset">
            <S.FindButton>비밀번호 재설정 하기</S.FindButton>
          </S.AccountLink>
        </S.FindContainer>
        <S.AccountLink to="/signup">
          <S.SigninButton>회원 가입하기</S.SigninButton>
        </S.AccountLink>
      </S.LoginBox>
    </S.Container>
  );
}
