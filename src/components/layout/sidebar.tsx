import { useEffect, useState } from "react";
import * as S from "../../assets/styles/sidebar.styles";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineProject } from "react-icons/ai";
import {
  MdOutlineAnnouncement,
  MdOutlineInterests,
  MdEventAvailable,
  MdChatBubbleOutline,
  MdPeople,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearTokens, selectAccessToken } from "../../store/slices/authSlice";
import { getMemberProfile } from "../../api/profile/ProfileAPI";
import type { MemberProfile } from "../../types/api/profile";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [visible, setVisible] = useState(false);
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(
    null
  );

  useEffect(() => {
    setVisible(true);
    document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

  const handleLogout = () => {
    dispatch(clearTokens());

    navigate("/login");
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <S.SidebarContainer onClick={handleClose}>
      <S.SidebarWrapper $visible={visible} onClick={(e) => e.stopPropagation()}>
        <S.UpperBar>
          <S.Title>
            {accessToken && memberProfile ? (
              <> {memberProfile.memberName}님, 환영합니다!</>
            ) : (
              <>로그인 해주세요</>
            )}
          </S.Title>

          <S.CloseButton onClick={handleClose}>×</S.CloseButton>
        </S.UpperBar>
        <S.LoginBox>
          {accessToken ? (
            <>
              <S.LoginLink to="/profile" onClick={handleClose}>
                내 프로필
              </S.LoginLink>
              {"|"}
              <S.LoginLink to="/login" onClick={handleLogout}>
                로그아웃
              </S.LoginLink>
            </>
          ) : (
            <>
              <S.LoginLink to="/login">로그인</S.LoginLink>
              {"|"}
              <S.LoginLink to="/signup">회원가입</S.LoginLink>
            </>
          )}
        </S.LoginBox>

        <S.MenuList>
          <Link to="/" onClick={handleClose}>
            <S.MenuItem>
              <AiOutlineHome /> 홈
            </S.MenuItem>
          </Link>
          <Link to="/notice-board" onClick={handleClose}>
            <S.MenuItem>
              <MdOutlineAnnouncement /> 공지사항 게시판
            </S.MenuItem>
          </Link>
          <Link to="/project-board" onClick={handleClose}>
            <S.MenuItem>
              <AiOutlineProject /> 프로젝트 게시판
            </S.MenuItem>
          </Link>
          <Link to="/interests-board" onClick={handleClose}>
            <S.MenuItem>
              <MdOutlineInterests /> 관심분야 게시판
            </S.MenuItem>
          </Link>
          <Link to="/lecture-board" onClick={handleClose}>
            <S.MenuItem>
              <MdPeople /> 매칭 서비스
            </S.MenuItem>
          </Link>
          <Link to="/chat" onClick={handleClose}>
            <S.MenuItem>
              <MdChatBubbleOutline /> 채팅방
            </S.MenuItem>
          </Link>
          <Link to="/events" onClick={handleClose}>
            <S.MenuItem>
              <MdEventAvailable /> 행사
            </S.MenuItem>
          </Link>
        </S.MenuList>
      </S.SidebarWrapper>
    </S.SidebarContainer>
  );
}
