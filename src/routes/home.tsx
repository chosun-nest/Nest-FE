import { Link } from "react-router-dom";
import * as S from "../assets/styles/home.styles";
import ProfileComponent from "../components/profile/profile-card";
import useResponsive from "../hooks/responsive";

export default function Home() {
  const isMobile = useResponsive();

  return (
    <S.GridContainer $isMobile={isMobile}>
      <S.GridItem $row="1" $isMobile={isMobile} $col="1">
        <ProfileComponent />
      </S.GridItem>
      <S.GridItem $row="1" $isMobile={isMobile} $col="2">
        <S.ItemTitle>
          {" "}
          학사 공지<Link to="/notice-board">+</Link>
        </S.ItemTitle>
      </S.GridItem>
      <S.GridItem $row="1" $isMobile={isMobile} $col="3">
        <S.ItemTitle>
          {" "}
          참여중인 채팅방<Link to="/chat-room">+</Link>
        </S.ItemTitle>
      </S.GridItem>
      <S.GridItem $row="2" $isMobile={isMobile} $col="2">
        <S.ItemTitle>
          {" "}
          프로젝트 모집 게시판<Link to="/project-board">+</Link>
        </S.ItemTitle>
      </S.GridItem>
      <S.GridItem $row="2" $isMobile={isMobile} $col="3">
        <S.ItemTitle>
          {" "}
          관심분야 게시판<Link to="/interests-board">+</Link>
        </S.ItemTitle>
      </S.GridItem>
    </S.GridContainer>
  );
}
