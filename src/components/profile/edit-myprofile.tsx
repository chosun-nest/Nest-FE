import React, { useState, useRef } from "react";

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "도레미",
    email: "domremi404@gmail.com",
    major: "컴퓨터학과 20학번",
    bio: "AI/Data 개발자가 되고 싶은 도레미 입니다.",
    interests: ["AI", "Data", "Web"],
    sns: ["https://github.com/", "https://linkedin.com/"],
    image: "/assets/images/user.png",
  });

  const [newInterest, setNewInterest] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newInterest.trim()) {
      e.preventDefault();
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleDeleteInterest = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: 서버 연동 예정
    setIsEditing(false);
  };

  const handleCancel = () => {
    // TODO: 원래 정보로 복원 (현재는 그대로 둠)
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-900 mb-4">내 프로필 변경</h2>

      {/* 이미지 */}
      <div className="flex items-start gap-4 mb-4">
        <label htmlFor="user-image" className="w-28 text-sm font-semibold">
          이미지
        </label>
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={profile.image}
            alt="프로필"
            className="w-24 h-24 rounded-lg object-cover group-hover:opacity-80 transition"
          />

          {/* 이미지 클릭하면 로컬에서 이미지 불러올 수 있음 */}
          {isEditing && (
            <>
              <input
                id="user-image"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* 이름 / 이메일 (고정된 항목) */}
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이름</label>
        <input
          type="text"
          value={profile.name}
          disabled
          className="flex-1 bg-gray-100 p-2 rounded"
        />
      </div>

      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이메일</label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="flex-1 bg-gray-100 p-2 rounded"
        />
      </div>

      {/* 학과 */}
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">학과</label>
        <input
          type="text"
          value={profile.major}
          onChange={(e) => handleChange("major", e.target.value)}
          disabled={!isEditing}
          className="flex-1 p-2 border rounded"
        />
      </div>

      {/* 자기소개 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">자기소개</label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          disabled={!isEditing}
          className="flex-1 p-2 rounded border min-h-[80px]"
        />
      </div>

      {/* 관심사 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">관심사</label>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.interests.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                {isEditing && (
                  <button
                    onClick={() => handleDeleteInterest(i)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="관심사 입력 후 Enter"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleAddInterest}
              className="mt-2 w-full p-2 border rounded"
            />
          )}
        </div>
      </div>

      {/* SNS 링크 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">SNS 링크</label>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm font-semibold">Github</span>
                <input
                  type="text"
                  value={profile.sns[0]}
                  onChange={(e) => {
                    const newSns = [...profile.sns];
                    newSns[0] = e.target.value;
                    setProfile({ ...profile, sns: newSns });
                  }}
                  className="flex-1 p-2 border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm font-semibold">LinkedIn</span>
                <input
                  type="text"
                  value={profile.sns[1]}
                  onChange={(e) => {
                    const newSns = [...profile.sns];
                    newSns[1] = e.target.value;
                    setProfile({ ...profile, sns: newSns });
                  }}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-2">
              <a href={profile.sns[0]} target="_blank" rel="noreferrer">
                <img
                  src="/assets/images/github-logo.png"
                  alt="GitHub"
                  className="w-8 h-8 hover:opacity-80"
                />
              </a>
              <a href={profile.sns[1]} target="_blank" rel="noreferrer">
                <img
                  src="/assets/images/LinkedIn-logo.png"
                  alt="LinkedIn"
                  className="w-9 h-8 hover:opacity-80"
                />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="text-right">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              저장
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            설정
          </button>
        )}
      </div>
    </div>
  );
}
