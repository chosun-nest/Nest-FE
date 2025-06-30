import { forwardRef, useEffect, useRef, useState, ForwardedRef } from "react";
import { useBackdrop } from "../../context/Backdropcontext";
import * as S from "../../assets/styles/navbar.styles";
import useResponsive from "../../hooks/responsive";
import { useNavigate } from "react-router-dom";
import { useNavbarHeight } from "../../context/NavbarHeightContext";
import { getMemberProfile } from "../../api/profile/ProfileAPI";
import Sidebar from "./sidebar";
import { useDispatch, useSelector } from "react-redux";
import { clearTokens, selectAccessToken } from "../../store/slices/authSlice";
import { MemberProfile } from "../../types/api/profile";

function Navbar(_: unknown, ref: ForwardedRef<HTMLDivElement>) {
  const isMobile = useResponsive();
  const { setShowBackdrop } = useBackdrop();
  const { setNavbarHeight } = useNavbarHeight();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(
    null
  );

  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  const handleLogout = () => {
    dispatch(clearTokens());

    setIsMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMemberProfile();
        setMemberProfile(profile);
      } catch (error) {
        console.error("프로필 불러오기 실패:", error);
      }
    };

    // accessToken이 있을 때 (로그인 상태일 때) 프로필 정보를 가져옴
    if (accessToken) {
      fetchProfile();
    } else {
      // 로그아웃 상태이면 프로필 정보 초기화
      setMemberProfile(null);
    }
    // accessToken 값이 변경될 때마다 이 useEffect가 다시 실행됨
  }, [accessToken]); // accessToken을 의존성 배열에 추가

  useEffect(() => {
    if (!ref || !("current" in ref) || !ref.current) return;
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setNavbarHeight(ref.current.offsetHeight);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, setNavbarHeight]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
      <S.NavbarContainer ref={ref}>
        <S.NavbarContent>
          <S.NavLeft>
            <S.Logo to="/">
              <img src="/assets/images/logo.png" alt="Logo" />
              WantIT-NEST
              {/*이스터에그*/}
              <div
                onClick={() => setShowBackdrop((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                ㅤ
              </div>
            </S.Logo>
          </S.NavLeft>
          <S.NavCenter>
            {!isMobile ? (
              <>
                <S.NavbarLink to="/interests-board">
                  <S.WebBarItem>관심분야 게시판</S.WebBarItem>
                </S.NavbarLink>
                <S.NavbarLink to="/notice-board">
                  <S.WebBarItem>공지사항 게시판</S.WebBarItem>
                </S.NavbarLink>
                <S.NavbarLink to="/project-board">
                  <S.WebBarItem>프로젝트 모집 게시판</S.WebBarItem>
                </S.NavbarLink>
                <S.NavbarLink to="/chat">
                  <S.WebBarItem>채팅방</S.WebBarItem>
                </S.NavbarLink>
                <S.NavbarLink to="/events">
                  <S.WebBarItem>행사</S.WebBarItem>
                </S.NavbarLink>
              </>
            ) : null}
          </S.NavCenter>
          <S.NavRight>
            {/*토큰이 있으면 = 로그인 되어 있으면면*/}
            {accessToken && !isMobile ? (
              <S.ProfileWrapper ref={menuRef}>
                <S.ProfileIcon
                  src={
                    memberProfile?.memberImageUrl || "/assets/images/user.png"
                  }
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  alt="Profile"
                />
                {memberProfile != null ? (
                  <div className="text-[12px]">
                    {memberProfile.memberName} 님 <br />
                    환영합니다!
                  </div>
                ) : null}
                <S.ProfileMenu $visible={isMenuOpen}>
                  <S.ProfileMenuItem onClick={() => navigate("/profile")}>
                    내 프로필
                  </S.ProfileMenuItem>
                  <S.ProfileMenuItem onClick={handleLogout}>
                    로그아웃
                  </S.ProfileMenuItem>
                </S.ProfileMenu>
              </S.ProfileWrapper>
            ) : (
              <>
                {isMobile ? null : (
                  <>
                    <S.LoginLink to="/login">Login</S.LoginLink>
                    <S.SignUpLink to="/signup">Sign Up</S.SignUpLink>
                  </>
                )}
              </>
            )}
          </S.NavRight>
          <S.NavMenu>
            {!isMobile ? null : (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                onClick={() => setIsSidebarOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </S.NavMenu>
        </S.NavbarContent>
      </S.NavbarContainer>
    </>
  );
}

export default forwardRef<HTMLDivElement, unknown>(Navbar);
