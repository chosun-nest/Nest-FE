import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

interface ProfileType {
  image: string;  //api/v1/members/me에 이미지 컬럼 추가 시 확인하기
  name: string;
  email: string;
  major: string;
  bio: string;
  interests: string[];
  techStacks: string[];
  sns: string[];
}

export default function ProfileCard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

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
      const token = localStorage.getItem("accesstoken");
      if (!token) return;

      try {
        const res = await API.get("/api/v1/members/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        
        setProfile({
          image: data.memberImage,  //api/v1/members/me에 이미지 컬럼 추가 시 확인하기
          name: data.memberName,
          email: data.memberEmail,
          major: data.memberDepartmentResponseDtoList[0]?.departmentName || "",
          bio: data.bio || "",
          interests: data.memberInterestResponseDtoList.map((i:any) => i.interestName),
          techStacks: data.memberTechStackResponseDtoList.map((t:any) => t.techStackName),
          sns: [
            data.memberSnsUrl1,
            data.memberSnsUrl2,
            data.memberSnsUrl3,
            data.memberSnsUrl4,
          ].filter(Boolean)
        });        
      } catch (err) {
        console.error("프로필 정보를 불러오지 못했습니다", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">🛜 불러오는 중...</p>
      </div>
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
      {/* Github */}
      {profile.sns?.[0] ? (
          <a href={profile.sns[0]} target="_blank" rel="noreferrer">
            <img
              src="/assets/images/github-logo.png"
              alt="GitHub"
              className="w-12 h-12 hover:opacity-80 cursor-pointer"
            />
          </a>
        ) : (
          <img
            src="/assets/images/github-logo.png"
            alt="Github"
            className="w-12 h-12 hover:opacity-80 cursor-pointer"
            onClick={() => alert("아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.")}
          />
        )}
        {/* LinkedIn */}
        {profile.sns?.[1] ? (
          <a href={profile.sns[1]} target="_blank" rel="noreferrer">
            <img
              src="/assets/images/LinkedIn-logo.png"
              alt="LinkedIn"
              className="w-12 h-12 hover:opacity-80 cursor-pointer"
            />
          </a>
        ) : (
          <img
          src="/assets/images/LinkedIn-logo.png"
          alt="LinkedIn"
          className="w-12 h-12 hover:opacity-80 cursor-pointer"
          onClick={() => alert("아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.")}
          />
        )}
      </div>
      
      {/* 기술 스택 */}
      {/* <div className="flex flex-wrap justify-left gap-2 mt-10">
        {profile.techStacks?.map((stack, i) => (
          <span key={i} className="bg-blue-100 text-blue-black font-mono rounded-xs px-4 py-1 ">
            {stack}
          </span>
        ))}
      </div> */}

      <div className="flex flex-wrap justify-left gap-2 mt-10">
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


      {/* 수정 버튼 */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => navigate("/profile-edit")}
          className="px-4 py-2 bg-blue-900 text-white rounded-md"
        >
          수정
        </button>
      </div>
    </div>
  );
}