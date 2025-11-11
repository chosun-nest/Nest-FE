import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: WHITE;
`;

export const Header = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  margin-top: 5%;
  padding: 1rem;
  display: flex;
  align-items: center;

  /* 반응형: 화면이 세로가 가로보다 크거나 같다면 가운데 정렬 */
  justify-content: ${(props) => (props.$isMobile ? "center" : "flex-start")};
`;

export const LogoText = styled.h1`
  font-size: 50px;
  font-weight: 400;
  font-family: "Monomaniac One", sans-serif;
  color: #002f6c; /* 네이비 색상 */
`;

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  max-width: 445px;
  max-height: 52px;
  border-radius: 8px;
  //  background: #f6f7ff;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  //margin-top: 1rem; /* 로고와 간격 */
`;

export const InputTitle = styled.div`
  display: flex;
  align-items: flex-start;
  font-weight: bold;
  font-size: 15px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  font-family: "Monomaniac One", sans-serif;
  color: #00256c;
`;

export const Divider = styled.div`
  font-size: 0.875rem;
  color: #999;
  margin: 1rem 0;
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  max-height: 50px;
  padding: 0.75rem;
  padding-right: 40px; /* 아이콘 공간 확보: EyeIcon의 width + right 간격 */
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 0.75rem; /* PasswordInputWrapper에서는 이 margin을 제거할 예정이므로, 이곳에는 그대로 두거나, 필요에 따라 조정 */
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 100%;
  min-height: 50px;
  padding: 0.75rem;
  border-radius: 6px;
  background: #00256c;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background 0.2s;

  &:hover {
    background: #0046c9;
  }

  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

export const FindContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;

export const FindButton = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #333333ca;
  &:hover {
    border: 1px soild #000000;
    color: #000000;
  }
`;

export const SigninButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: auto;
  width: 100%;
  min-height: 40px;
  max-width: 110px;
  border: 1px solid #00256c;
  &:hover {
    cursor: pointer;
  }
`;

export const AccountLink = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 0.875rem;
  color: #666;
  text-decoration: none;
  text-decoration-line: none;
  text-decoration: none;
  color: inherit;
`;

/* ✅ 보유 기술 입력란 스타일 */
export const SkillContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const SkillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem; /* 버튼과 입력 칸 간격 조정 */
  margin-bottom: 0.5rem;
`;

/* ✅ 버튼 크기 조정 */
export const AddButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #218838;
  }
`;

export const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background: #c82333;
  }
`;
// 회원가입 사이트 전용
export const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const HeaderLogo = styled.img`
  width: 63px;
  height: 63px;
`;

export const SigninTitle = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

export const DivisionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5rem;
  margin-bottom: 1rem;
`;
export const RadioGroup = styled.div`
  display: flex;
  gap: 5rem;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
`;

export const RadioInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #0066ff;
  border-radius: 50%;
  position: relative;
  display: inline-block;

  &:checked::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background-color: #0066ff;
    border-radius: 50%;
  }
`;
export const SigninBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 445px;
  max-height: 52px;
  border-radius: 8px;
  //  background: #f6f7ff;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  //margin-top: 1rem; /* 로고와 간격 */
`;
export const SigninText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  font-size: 20px;
  font-weight: bold;
  font-family: "Monomaniac One", sans-serif;
`;

export const AuthCodeButton = styled.button`
  margin-left: auto;
  width: 100%;
  height: 100%;
  max-width: 110px;
  min-height: 42px;
  border: 1px solid #00256c;
  border-radius: 6px;
  font-size: 13px;
  color: 00256C;
  &:hover {
    cursor: pointer;
  }
`;

export const SubTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
export const SubText = styled.p<{ $isValid?: boolean }>`
  font-size: 14px;
  margin-bottom: 4px;
  margin-left: 4px;
  color: ${(props) =>
    props.$isValid === undefined
      ? "#b7b9bd"
      : props.$isValid
        ? "#0066ff"
        : "#ff4d4f"};

  a {
    color: #00256c;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const EmailRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const TimerInputWrapper = styled.div`
  position: relative;
  margin-top: 1rem;
  width: 100%;
`;

export const TimerText = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #999;
`;

export const PasswordInputWrapper = styled.div`
  position: relative; /* 중요: 자식 요소의 absolute 위치를 위한 기준점 */
  width: 100%;
  margin-bottom: 0.75rem; /* input에 있던 margin-bottom을 이곳으로 이동 */
  display: flex; /* 내부 요소들을 flex로 정렬 (선택 사항) */
  align-items: center; /* 세로 중앙 정렬 (선택 사항) */

  /* PasswordInputWrapper 내부의 Input에는 margin-bottom 제거 */
  ${Input} {
    margin-bottom: 0;
  }
`;
export const EyeIcon = styled.span`
  position: absolute; /* PasswordInputWrapper를 기준으로 절대 위치 지정 */
  top: 50%; /* 컨테이너의 세로 중앙 */
  right: 15px; /* input 오른쪽에서 15px 떨어뜨림 (padding-right 40px와 조화) */
  transform: translateY(-50%); /* 정확한 세로 중앙 정렬 */
  cursor: pointer;
  color: #999;
  user-select: none;
  display: flex; /* SVG를 중앙에 정렬하기 위함 */
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;
export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 445px;
`;
export const CheckCodeButton = styled.button`
  width: 150px;
  min-height: 40px;
  border: 1px solid #00256c;
  background-color: white;
  color: #00256c;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background-color: #00256c;
    color: white;
  }
`;
export const CodeVerifyRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  margin-top: 0.75rem;
`;

// login.styles.ts 내부에 아래 추가

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const TagItem = styled.span`
  background: #eee;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

export const TagRemoveButton = styled.button`
  margin-left: 6px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #f00;
  }
`;
export const Dropdown = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 999;
  margin-top: 4px;
  padding: 0;
  list-style: none;
`;

export const DropdownItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
