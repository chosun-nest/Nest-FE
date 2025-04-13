import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/layout/navbar";
import GuestCard from "../components/profile/profile-card-guest";
import ProfileCard from "../components/profile/profile-card";

export default function Profile() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navbar 높이 계산
  useEffect(() => {
    const handleResize = () => {
      if (navbarRef.current) {
        setNavHeight(navbarRef.current.offsetHeight);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 사용자 정보 API 호출
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accesstoken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/v1/members/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("프로필 정보를 불러오지 못했습니다", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />

      <div
        className="px-10 min-h-screen bg-white flex"
        style={{ paddingTop: `${navHeight}px` }}
      >
        <div className="w-1/4">
          {loading ? (
            <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
              <p className="text-gray-500 text-sm">🛜 불러오는 중...</p>
            </div>
          ) : profile && profile.name ? (
            <ProfileCard profile={profile} onEdit={() => navigate("/profile-edit")} />
          ) : (
            <GuestCard onEdit={() => navigate("/onEdit")} />  /* 게스트 카드 사용 가능 */
        )}
        </div>

        <div className="flex-1 pl-8">{/* 나중에 히스토리, 채팅방 등 들어갈 자리 */}</div>
      </div>
    </>
  );
}
