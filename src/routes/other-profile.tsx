// 다른 사용자 프로필 페이지 조회용
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import { selectCurrentUserId } from "../store/slices/userSlice";
import { getMemberProfileById } from "../api/profile/ProfileAPI";

import type { ProfileType } from "../types/profile";
import { convertToProfileType } from "../utils/profileType";

import Modal from "../components/common/modal";
import SkeletonProfileCard from "../components/profile/card/SkeletonProfileCard";
import ProfileCard from "../components/profile/card/ProfileCard";
import { ModalContent } from "../types/modal";
import {
  GridContainer,
  GridItem,
  ItemTitle,
} from "../assets/styles/profile.styles";
import { CaretDown, CaretUp } from "phosphor-react";
import useResponsive from "../hooks/responsive";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import OthersPin from "../components/profile/history/others-pins";
import OthersHistoryTimeline from "../components/profile/history/others-historytimeline";

export default function OtherProfile() {
  const { navbarHeight } = useNavbarHeight();
  const isMobile = useResponsive();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectCurrentUserId);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const numericId = id ? parseInt(id, 10) : null;
  //const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  // history 열림/닫힘 상태
  const [historyOpen, setHistoryOpen] = useState(true);

  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn) {
      setModalContent({
        title: "로그인 필요",
        message: "로그인이 필요한 페이지입니다.",
        type: "error",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
      return;
    }

    if (!id || isNaN(Number(id))) {
      setModalContent({
        title: "잘못된 요청",
        message: "사용자 ID가 유효하지 않습니다.",
        type: "error",
        onClose: () => navigate("/"),
      });
      setShowModal(true);
      return;
    }

    //const isMine = Number(id) === currentUserId;    // 이미 이미 App.tsx에서 분기됨

    const fetchProfile = async () => {
      try {
        const data = await getMemberProfileById(Number(id)); // 잘못된 id 방지

        const converted = convertToProfileType(data);
        setProfile(converted);
      } catch {
        setModalContent({
          title: "조회 실패",
          message: "사용자 정보를 불러올 수 없습니다.",
          type: "error",
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isLoggedIn, currentUserId, navigate]);

  return (
    <>
      {/* 모달 표시 */}
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}

      <GridContainer $isMobile={isMobile} $navbarHeight={navbarHeight}>
        <GridItem $isMobile={isMobile} $row="1" $col="1">
          {loading || !profile ? (
            <SkeletonProfileCard />   // 프로필 카드 UX 최적화, 깜빡임 제거
            ) : (
              <ProfileCard
                profile={profile}
                isOwnProfile={Number(id) === currentUserId} // ProfileCard로 isOwnProfile만 넘기면 내부에서 자동 처리됨
              />
            )
          }
        </GridItem>

        {/* 1행: My Pins */}
        <GridItem
          $isMobile={isMobile}
          $row="1"
          $col="2"
          $colSpan="2"
          $noMinHeight={true}
        >
          <ItemTitle onClick={() => setHistoryOpen((o) => !o)}>
            <span>My Pins</span>
            {historyOpen ? (
              <CaretUp size={20} weight="bold" />
            ) : (
              <CaretDown size={20} weight="bold" />
            )}
          </ItemTitle>

          {historyOpen && numericId !== null && (
            <div style={{ padding: 16 }}>
              <OthersPin title={""} editable memberId={numericId} />
            </div>
          )}
        </GridItem>

        {/* 2행: 활동 로그 */}
        <GridItem $isMobile={isMobile} $row="2" $col="2" $colSpan="2">
          <ItemTitle>History</ItemTitle>
          {numericId !== null ? (
            <OthersHistoryTimeline memberId={numericId} />
          ) : null}
        </GridItem>
      </GridContainer>
    </>
  );
}
