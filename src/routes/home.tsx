import { Link } from "react-router-dom";
import * as S from "../assets/styles/home.styles";
//import ProfileComponent from "../components/profile/card/ProfileCard";
import ProfileCardWrapper from "../components/profile/card/ProfileCardWrapper"; // 프로필 카드 대신에 wrapper로 profile 컴포넌트 정보 불러옴.
import useResponsive from "../hooks/responsive";
import GuestCard from "../components/profile/card/ProfileCardGuest";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import MyPin from "../components/profile/history/mypins";
import HomeNotice from "../components/layout/home/home.notice";
import HomeInterest from "../components/layout/home/home.interest";
import HomeProject from "../components/layout/home/home.project";

export default function Home() {
  const isMobile = useResponsive();
  const { navbarHeight } = useNavbarHeight();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <S.GridContainer $navbarHeight={navbarHeight} $isMobile={isMobile}>
      <S.GridItem $row="1" $col="1" $isMobile={isMobile}>
        {!isLoggedIn ? (
          <GuestCard />
        ) : (
          <S.ProfileContainer>
            <ProfileCardWrapper />
          </S.ProfileContainer>
        )}
      </S.GridItem>
      {isLoggedIn && (
        <S.GridItem $row="2" $col="1" $isMobile={isMobile}>
          <S.ItemTitle>내 핀</S.ItemTitle>
          <MyPin title="" editable />
        </S.GridItem>
      )}
      <S.GridItem $row="1" $rowSpan="2" $col="2" $isMobile={isMobile}>
        <S.ItemTitle>
          관심분야 게시판<Link to="/interests-board">+</Link>
        </S.ItemTitle>
        <HomeInterest />
      </S.GridItem>
      <S.GridItem $row="1" $rowSpan="2" $col="3" $isMobile={isMobile}>
        <S.ItemTitle>
          공지사항 게시판<Link to="/notice-board">+</Link>
        </S.ItemTitle>
        <HomeNotice />
      </S.GridItem>
      <S.GridItem $row="1" $rowSpan="2" $col="4" $isMobile={isMobile}>
        <S.ItemTitle>
          프로젝트 모집 게시판<Link to="/project-board">+</Link>
        </S.ItemTitle>
        <HomeProject />
      </S.GridItem>
    </S.GridContainer>
  );
}
