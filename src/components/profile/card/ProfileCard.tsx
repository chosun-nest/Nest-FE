// 프로필 카드 컴포넌트
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GithubLogo, LinkedinLogo, InstagramLogo } from "phosphor-react"; // npm install phosphor-react
import { getMemberProfile } from "../../../api/profile/ProfileAPI";
import { ModalContent } from "../../../types/modal";
import Modal from "../../common/modal";

interface ProfileType {
  image: string;
  name: string;
  email: string;
  major: string;
  introduce: string;
  //interests: string[];
  techStacks: string[];
  sns: string[];
}

export default function ProfileCard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const goToProfilePage = () => {
    navigate("/profile");
  };
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);

  const techColorMap: Record<string, string> = {
    Java: "bg-[#f89820] text-white",
    Python: "bg-[#3776AB] text-white",
    C: "bg-[#555555] text-white",
    "C++": "bg-[#00599C] text-white",
    "C#": "bg-[#239120] text-white",
    Go: "bg-[#00ADD8] text-white",
    Rust: "bg-[#DEA584] text-black",
    Kotlin: "bg-[#A97BFF] text-white",
    Swift: "bg-[#FA7343] text-white",
    JavaScript: "bg-[#F7DF1E] text-black",
    TypeScript: "bg-[#3178C6] text-white",
    Dart: "bg-[#00B4AB] text-white",
    Ruby: "bg-[#CC342D] text-white",
    PHP: "bg-[#8892BF] text-white",
    Spring: "bg-[#6DB33F] text-white",
    "Spring Boot": "bg-[#6DB33F] text-white",
    Django: "bg-[#092E20] text-white",
    Flask: "bg-[#000000] text-white",
    Express: "bg-[#303030] text-white",
    NestJS: "bg-[#E0234E] text-white",
    "Ruby on Rails": "bg-[#CC0000] text-white",
    "ASP.NET": "bg-[#512BD4] text-white",
    "Next.js": "bg-[#000000] text-white",
    "Nuxt.js": "bg-[#00DC82] text-white",
    React: "bg-[#61DAFB] text-white",
    "Vue.js": "bg-[#42B883] text-white",
    Angular: "bg-[#DD0031] text-white",
    Svelte: "bg-[#FF3E00] text-white",
    HTML: "bg-[#E44D26] text-white",
    CSS: "bg-[#264DE4] text-white",
    "Tailwind CSS": "bg-[#38BDF8] text-white",
    Bootstrap: "bg-[#7952B3] text-white",
    jQuery: "bg-[#0769AD] text-white",
    MySQL: "bg-[#4479A1] text-white",
    PostgreSQL: "bg-[#336791] text-white",
    MongoDB: "bg-[#47A248] text-white",
    Redis: "bg-[#DC382D] text-white",
    MariaDB: "bg-[#003545] text-white",
    SQLite: "bg-[#003B57] text-white",
    OracleDB: "bg-[#F80000] text-white",
    DynamoDB: "bg-[#4053D6] text-white",
    Elasticsearch: "bg-[#005571] text-white",
    Docker: "bg-[#2496ED] text-white",
    Kubernetes: "bg-[#326CE5] text-white",
    Nginx: "bg-[#009639] text-white",
    Apache: "bg-[#D22128] text-white",
    Terraform: "bg-[#623CE4] text-white",
    Ansible: "bg-[#EE0000] text-white",
    Git: "bg-[#F05032] text-white",
    "GitHub Actions": "bg-[#2088FF] text-white",
    Jenkins: "bg-[#D24939] text-white",
    AWS: "bg-[#FF9900] text-black",
    GCP: "bg-[#4285F4] text-white",
    Azure: "bg-[#0078D4] text-white",
    Firebase: "bg-[#FFCA28] text-black",
    Vercel: "bg-[#000000] text-white",
    Netlify: "bg-[#00C7B7] text-white",
    Android: "bg-[#3DDC84] text-black",
    iOS: "bg-[#000000] text-white",
    Flutter: "bg-[#02569B] text-white",
    "React Native": "bg-[#61DAFB] text-black",
    Electron: "bg-[#47848F] text-white",
    TensorFlow: "bg-[#FF6F00] text-white",
    PyTorch: "bg-[#EE4C2C] text-white",
    Pandas: "bg-[#150458] text-white",
    NumPy: "bg-[#013243] text-white",
    "scikit-learn": "bg-[#F7931E] text-black",
    "Apache Spark": "bg-[#E25A1C] text-white",
    Kafka: "bg-[#231F20] text-white",
    RabbitMQ: "bg-[#FF6600] text-white",
    gRPC: "bg-[#0A85D1] text-white",
    WebSocket: "bg-[#35495E] text-white",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMemberProfile();
        setProfile({
          image: data.memberImageUrl,
          name: data.memberName,
          email: data.memberEmail,
          major: data.memberDepartmentResponseDtoList[0]?.departmentName || "",
          introduce: data.memberIntroduce || "",
          // interests: data.memberInterestResponseDtoList.map(
          //   (i: { interestId: number; interestName: string }) => i.interestName
          // ),
          techStacks: data.memberTechStackResponseDtoList.map(
            (t: { techStackId: number; techStackName: string }) =>
              t.techStackName
          ),
          sns: [
            data.memberSnsUrl1,
            data.memberSnsUrl2,
            data.memberSnsUrl3,
            data.memberSnsUrl4,
          ].filter(Boolean),
        });
      } catch (err) {
        console.error("프로필 정보를 불러오지 못했습니다", err);
        setModalContent({
          title: "조회 실패",
          message: "프로필 정보를 불러오지 못했습니다",
          type: "error",
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">🛜 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-white border shadow-md w-80 rounded-xl">
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-7">
          <img
            src={profile.image || "/assets/images/user.png"}
            alt="Profile"
            className="w-20 h-20 border rounded-full cursor-pointer sm:h-24 sm:w-24 md:h-28 md:w-28"
            onClick={goToProfilePage} // 사진 누르면 profile 페이지로 navigate
          />
        </div>

        {/* 이름 및 전공 정보, 재학생 인증 배찌 */}
        <div className="flex items-center gap-2 mt-2 justify-left">
          <h2
            className="text-lg font-bold cursor-pointer hover:underline"
            onClick={goToProfilePage} // 이름 누르면 profile 페이지로 navigate
          >
            {profile.name}
          </h2>
          <div className="flex items-center gap-1">
            <p className="text-gray-500">{profile.major}</p>
            {(profile.email.endsWith("@chosun.ac.kr") ||
              profile.email.endsWith("@chosun.kr")) && (
              <img
                src="/assets/images/verified-badge.png" // 원하는 뱃지 이미지 경로
                alt="인증"
                title="조선대 인증 이메일"
                className="w-4 h-4"
              />
            )}
          </div>
        </div>

        {/* 한 줄 소개 */}
        <p className="mt-2 text-sm text-left">{profile.introduce}</p>

        {/* 관심사 태그
        <div className="flex flex-wrap gap-2 mt-6 justify-left">
          {profile.interests?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-gray-200 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-2 mt-5 justify-left">
          {profile.techStacks?.map((stack, i) => {
            const colorClass = techColorMap[stack] || "bg-blue-200 text-white";
            return (
              <span
                key={i}
                className={`px-4 py-2 rounded-xs text-xs font-mono ${colorClass}`}
              >
                {stack}
              </span>
            );
          })}
        </div>

        {/* SNS 아이콘 */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {profile.sns?.[0] ? (
            <a href={profile.sns[0]} target="_blank" rel="noreferrer">
              <GithubLogo
                size={48}
                color="#002f6c"
                alt="GitHub"
                className="w-12 h-12 cursor-pointer hover:opacity-80"
              />
            </a>
          ) : (
            <GithubLogo
              size={48}
              color="#002f6c"
              alt="GitHub"
              className="w-12 h-12 cursor-pointer hover:opacity-80"
              // 기존 alert 대신 모달 오픈
              onClick={() => {
                setModalContent({
                  title: "알림",
                  message:
                    "아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.",
                  type: "info",
                });
                setShowModal(true);
              }}
            />
          )}
          {profile.sns?.[1] ? (
            <a href={profile.sns[1]} target="_blank" rel="noreferrer">
              <LinkedinLogo
                size={48}
                color="#002f6c"
                alt="LinkedIn"
                className="w-12 h-12 cursor-pointer hover:opacity-80"
              />
            </a>
          ) : (
            <LinkedinLogo
              size={48}
              color="#002f6c"
              alt="LinkedIn"
              className="w-12 h-12 cursor-pointer hover:opacity-80"
              // 기존 alert 대신 모달 오픈
              onClick={() => {
                setModalContent({
                  title: "알림",
                  message:
                    "아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.",
                  type: "info",
                });
                setShowModal(true);
              }}
            />
          )}
          {profile.sns?.[2] ? (
            <a href={profile.sns[2]} target="_blank" rel="noreferrer">
              <InstagramLogo
                size={48}
                color="#002f6c"
                alt="Instagram"
                className="w-12 h-12 cursor-pointer hover:opacity-80"
              />
            </a>
          ) : (
            <InstagramLogo
              size={48}
              color="#002f6c"
              alt="Instagram"
              className="w-12 h-12 cursor-pointer hover:opacity-80"
              // 기존 alert 대신 모달 오픈
              onClick={() => {
                setModalContent({
                  title: "알림",
                  message:
                    "아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.",
                  type: "info",
                });
                setShowModal(true);
              }}
            />
          )}
        </div>

        {/* 수정 버튼 */}
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => navigate("/profile-edit")}
            className="px-20 py-2 text-white bg-blue-900 rounded-md whitespace-nowrap" // whitespace-nowrap 줄바꿈(글자 깨짐 방지)
          >
            프로필 수정
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => setShowModal(false)} // 모달 닫기 핸들러
        />
      )}
    </>
  );
}
