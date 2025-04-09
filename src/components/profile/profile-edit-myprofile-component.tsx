import React, { useState, useRef } from "react";

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "도레미",
    email: "domremi404@gmail.com",
    major: "컴퓨터학부 20학번",
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">내 프로필</h2>

      {/* 이미지 */}
      <div className="flex items-center gap-4 mb-4">
        <img src={profile.image} alt="프로필" className="w-24 h-24 rounded-full border" />
        {isEditing && (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              className="text-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              변경
            </button>
            <button
              className="text-gray-500"
              onClick={() => handleChange("image", "/assets/images/user.png")}
            >
              초기화
            </button>
            <p className="text-xs text-blue-600">1MB 이하 png/jpg</p>
          </div>
        )}
      </div>

      {/* 이름 / 이메일 (고정) */}
      <div className="mb-2">
        <label className="text-sm font-semibold">이름</label>
        <input
          type="text"
          value={profile.name}
          disabled
          className="block w-full bg-gray-100 p-2 rounded mt-1"
        />
      </div>
      <div className="mb-2">
        <label className="text-sm font-semibold">이메일</label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="block w-full bg-gray-100 p-2 rounded mt-1"
        />
      </div>

      {/* 학과 */}
      <div className="mb-2">
        <label className="text-sm font-semibold">학과</label>
        <input
          type="text"
          value={profile.major}
          onChange={(e) => handleChange("major", e.target.value)}
          disabled={!isEditing}
          className="block w-full p-2 rounded mt-1 border"
        />
      </div>

      {/* 자기소개 */}
      <div className="mb-2">
        <label className="text-sm font-semibold">자기소개</label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          disabled={!isEditing}
          className="block w-full p-2 rounded mt-1 border min-h-[80px]"
        />
      </div>

      {/* 관심사 */}
      <div className="mb-2">
        <label className="text-sm font-semibold">관심사</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {profile.interests.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              #{tag}
              {isEditing && (
                <button onClick={() => handleDeleteInterest(i)} className="text-red-500">×</button>
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

      {/* SNS 링크 */}
      <div className="mb-4">
        <label className="text-sm font-semibold">SNS 링크</label>
        {isEditing ? (
          profile.sns.map((link, i) => (
            <input
              key={i}
              type="text"
              value={link}
              onChange={(e) => {
                const newSns = [...profile.sns];
                newSns[i] = e.target.value;
                setProfile({ ...profile, sns: newSns });
              }}
              className="block w-full mt-1 p-2 rounded border"
            />
          ))
        ) : (
          <div className="flex gap-2 mt-2">
            {profile.sns.map((link, i) => (
              <a key={i} href={link} className="text-blue-600 underline" target="_blank">
                🔗
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="text-right">
        {isEditing ? (
          <>
            <button onClick={handleCancel} className="px-4 py-2 mr-2 rounded border">
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