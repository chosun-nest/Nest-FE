import { Link } from "react-router-dom";
import * as S from "../assets/styles/home.styles";
import ProfileComponent from "../components/profile/card/ProfileCard";
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
      <S.GridItem $row="1" $isMobile={isMobile} $col="1">
        {!isLoggedIn ? (
          <GuestCard />
        ) : (
          <S.ProfileContainer>
            <ProfileComponent />
          </S.ProfileContainer>
        )}
      </S.GridItem>
      {isLoggedIn ? (
        <S.GridItem $row="2" $col="1" $colSpan="2" $isMobile={isMobile}>
          <S.ItemTitle>내 핀</S.ItemTitle>
          <MyPin title="" editable />
        </S.GridItem>
      ) : null}
      <S.GridItem $row="1" $isMobile={isMobile} $col="2">
        <S.ItemTitle>
          관심분야 게시판<Link to="/interests-board">+</Link>
        </S.ItemTitle>
        <HomeInterest />
      </S.GridItem>
      <S.GridItem $row="1" $isMobile={isMobile} $col="3">
        <S.ItemTitle>
          학사 공지<Link to="/notice-board">+</Link>
        </S.ItemTitle>
        <HomeNotice />
      </S.GridItem>
      <S.GridItem $row="2" $isMobile={isMobile} $col="3">
        <S.ItemTitle>
          프로젝트 모집 게시판<Link to="/project-board">+</Link>
        </S.ItemTitle>
        <HomeProject />
      </S.GridItem>
    </S.GridContainer>
  );
}
