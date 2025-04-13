import { useNavigate } from "react-router-dom";
import GuestCard from "./profile-card-guest";

interface ProfileCardProps {
  profile: {
    name: string;
    major: string;
    bio: string;
    image?: string;
    interests?: string[];
    sns?: string[];
  } | null;
  onEdit: () => void;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();

  // ✅ 로그인 안 되어 있을 경우 GuestCard로 전환 + navigate 처리
  if (!profile || !profile.name) {
    return (
      <GuestCard onEdit={() => navigate("/profile-edit")} />
    );
  }

  return (
    <div className="w-80 p-4 border rounded-xl shadow-md bg-white">
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-7">
        <img
          src={profile.image || "/assets/images/user.png"}
          alt="Profile"
          className="w-30 h-30 rounded-full border"
        />
      </div>

      {/* 이름 및 전공 정보 */}
      <div className="flex items-center justify-left mt-2 gap-2">
        <h2 className="text-lg font-bold">{profile.name}</h2>
        <p className="text-gray-500">{profile.major}</p>
      </div>

      {/* 한 줄 소개 */}
      <p className="text-sm text-left mt-2">{profile.bio}</p>

      {/* 관심사 해시태그 */}
      <div className="flex flex-wrap justify-left gap-2 mt-5">
        {profile.interests?.map((tag, i) => (
          <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* SNS 아이콘 */}
      <div className="flex justify-center items-center gap-10 mt-10">
        {profile.sns?.[0] && (
          <a href={profile.sns[0]} target="_blank" rel="noreferrer">
            <img
              src="/assets/images/github-logo.png"
              alt="GitHub"
              className="w-12 h-12 hover:opacity-80"
            />
          </a>
        )}
        {profile.sns?.[1] && (
          <a href={profile.sns[1]} target="_blank" rel="noreferrer">
            <img
              src="/assets/images/LinkedIn-logo.png"
              alt="LinkedIn"
              className="w-13 h-12 hover:opacity-80"
            />
          </a>
        )}
      </div>

      {/* 수정 버튼 */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => navigate("/profile-edit")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          수정
        </button>
      </div>
    </div>
  );
}
