import { forwardRef, useEffect, useRef, useState, ForwardedRef } from "react";
import { useBackdrop } from "../../context/Backdropcontext";
import * as S from "../../assets/styles/navbar.styles";
import useResponsive from "../../hooks/responsive";
import { useNavigate } from "react-router-dom";

function Navbar(_: unknown, ref: ForwardedRef<HTMLDivElement>) {
  const isMobile = useResponsive();
  const { setShowBackdrop } = useBackdrop();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 메뉴 닫기
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
    <S.NavbarContainer ref={ref}>
      <S.NavbarContent>
        {/* 네비게이션 메뉴 */}
        <S.NavMenu>
          {!isMobile ? (
            <div
              onClick={() => setShowBackdrop((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              ....
            </div>
          ) : (
            <svg
              data-slot="icon"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </S.NavMenu>

        {/* 로고 */}
        <S.Logo to="/">
          <img src="assets/images/logo.png" />
          CSU-NEST
        </S.Logo>

        {/* 우측 아이콘 및 버튼 */}
        <S.NavRight>
          <S.SearchIcon />

          {localStorage.getItem("accesstoken") ? (
            <S.ProfileWrapper ref={menuRef}>
              <S.ProfileIcon
                src="/assets/images/user.png"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />
              {isMenuOpen && (
                <S.ProfileMenu $visible={isMenuOpen}>
                  <S.ProfileMenuItem onClick={() => navigate("/profile")}>
                    내 프로필
                  </S.ProfileMenuItem>
                  <S.ProfileMenuItem
                    onClick={() => {
                      localStorage.removeItem("accesstoken");
                      localStorage.removeItem("refreshToken");
                      localStorage.removeItem("user");
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    로그아웃
                  </S.ProfileMenuItem>
                </S.ProfileMenu>
              )}
            </S.ProfileWrapper>
          ) : (
            <>
              <S.LoginLink to="/login">Login</S.LoginLink>
              <S.SignUpLink to="/signup">Sign Up</S.SignUpLink>
            </>
          )}
        </S.NavRight>
      </S.NavbarContent>

      {!isMobile && (
        <S.WebBar>
          <S.NavbarLink to="/">
            <S.WebBarItem>Nest-FE 소개</S.WebBarItem>
          </S.NavbarLink>
          <S.NavbarLink to="/notice-board">
            <S.WebBarItem>학사공지</S.WebBarItem>
          </S.NavbarLink>
          <S.NavbarLink to="/project-board">
            <S.WebBarItem>프로젝트 모집</S.WebBarItem>
          </S.NavbarLink>
          <S.NavbarLink to="/interests-board">
            <S.WebBarItem>관심분야 정보</S.WebBarItem>
          </S.NavbarLink>
          <S.NavbarLink to="/chat">
            <S.WebBarItem>채팅방</S.WebBarItem>
          </S.NavbarLink>
          <S.NavbarLink to="/events">
            <S.WebBarItem>행사</S.WebBarItem>
          </S.NavbarLink>
        </S.WebBar>
      )}
    </S.NavbarContainer>
  );
}

// ✅ forwardRef 적용하여 export default 유지
export default forwardRef<HTMLDivElement, unknown>(Navbar);
