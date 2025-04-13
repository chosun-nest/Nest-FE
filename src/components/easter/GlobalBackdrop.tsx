// components/GlobalBackdrop.tsx
import styled from "styled-components";

interface Props {
  visible: boolean;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url("/assets/images/GPT_easter.png"); // 원하는 이미지 경로
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  pointer-events: none;
`;

export default function GlobalBackdrop({ visible }: Props) {
  if (!visible) return null;
  return <Backdrop />;
}
