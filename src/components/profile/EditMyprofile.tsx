//내 프로필 변경 메인 컴포넌트
import React, { useState, useEffect, useRef } from "react";
import {
  getMemberProfile,
  getTech,
  getDepartments,
  uploadProfileImage,
  updateMemberProfile,
} from "../../api/profile/ProfileAPI";
import { getFavoriteTags } from "../../api/board-common/UserTagAPI";
import axios from "axios";

import {
  Item,
  DepartmentResponse,
  TechStackResponse,
  ProfileFormData,
} from "../../types/profile";
import { getAllTags, type Tag } from "../../api/board-common/TagListAPI";

// 하위 컴포넌트 import
import EditProfileImage from "./edit-myprofile/EditProfileImage";
import EditProfileField from "./edit-myprofile/EditProfileField";
import EditDepartment from "./edit-myprofile/EditDepartment";
import EditIntroduce from "./edit-myprofile/EditIntroduce";
import EditInterests from "./edit-myprofile/EditInterests";
import InterestSelectModal from "./edit-myprofile/InterestSelectModal";
import EditTechStacks from "./edit-myprofile/EditTechStacks";
import EditSNS from "./edit-myprofile/EditSNS";
import EditProfileButtons from "./edit-myprofile/EditProfileButtons";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/slices/authSlice";
import { ModalContent } from "../../types/modal";
import Modal from "../common/modal";

export default function EditMyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormData>({
    name: "",
    email: "",
    major: "",
    introduce: "",
    sns: ["", "", ""],
    image: "",
    uploadedImagePath: "",
    techStacks: [],
    interests: [],
  });

  const [departmentsList, setDepartmentsList] = useState<Item[]>([]);
  const [techList, setTechList] = useState<Item[]>([]);
  const [_tagList, setTagList] = useState<Tag[]>([]);

  const [departmentInput, setDepartmentInput] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Item[]>([]);
  const [newTech, setNewTech] = useState("");
  const [filteredTechs, setFilteredTechs] = useState<Item[]>([]);

  const [showInterestModal, setShowInterestModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useSelector(selectAccessToken);

  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
    getItems();
  }, []);

  const fetchData = async () => {
    const [profileData, favoriteTagsData] = await Promise.all([
      getMemberProfile(),
      getFavoriteTags().catch(() => ({ favoriteTags: [] })), // 에러 시 빈 배열
    ]);

    console.log("📥 프로필 데이터:", profileData);
    console.log("📥 즐겨찾기 태그 데이터:", favoriteTagsData);

    // 관심분야는 UserTagAPI에서 가져옴
    const interests = favoriteTagsData.favoriteTags?.map(
      (tag: { tagId: number; tagName: string }) => tag.tagName
    ) || [];
    console.log("📥 매핑된 관심분야 (UserTagAPI):", interests);

    setProfile({
      image: profileData.memberImageUrl || "/assets/images/user.png",
      uploadedImagePath: profileData.memberImageUrl || "",
      name: profileData.memberName,
      email: profileData.memberEmail,
      major: profileData.memberDepartmentResponseDtoList?.[0]?.departmentName || "",
      introduce: profileData.memberIntroduce || "",
      techStacks: profileData.memberTechStackResponseDtoList.map(
        (t: { techStackId: number; techStackName: string }) => t.techStackName
      ),
      interests: interests,
      sns: [
        profileData.memberSnsUrl1,
        profileData.memberSnsUrl2,
        profileData.memberSnsUrl3,
        profileData.memberSnsUrl4,
      ].filter(Boolean),
    });
    setDepartmentInput(
      profileData.memberDepartmentResponseDtoList?.[0]?.departmentName || ""
    );
  };

  const getItems = async () => {
    const [deps, techs, tags] = await Promise.all([
      getDepartments(),
      getTech(),
      getAllTags(),
    ]);

    setDepartmentsList(deps.map((d: DepartmentResponse) => ({
      id: d.departmentId,
      name: d.departmentName,
    })));

    setTechList(techs.map((t: TechStackResponse) => ({
      id: t.techStackId,
      name: t.techStackName,
    })));

    setTagList(tags.tags);
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev: ProfileFormData) => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentInput(value);
    if (!value.trim()) return setFilteredDepartments([]);
    const filtered = departmentsList.filter((dep) =>
      dep.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };

  const handleSelectDepartment = (item: Item) => {
    setDepartmentInput(item.name);
    setProfile((prev: ProfileFormData) => ({ ...prev, major: item.name }));
    setFilteredDepartments([]);
  };

  const handleTechInputChange = (value: string) => {
    setNewTech(value);
    if (!value.trim()) return setFilteredTechs([]);
    const filtered = techList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTechs(filtered);
  };

  const handleSelectTech = (item: Item) => {
    if (!profile.techStacks.includes(item.name)) {
      setProfile((prev: ProfileFormData) => ({
        ...prev,
        techStacks: [...prev.techStacks, item.name],
      }));
    }
    setNewTech("");
    setFilteredTechs([]);
  };

  const handleDeleteTech = (index: number) => {
    setProfile((prev: ProfileFormData) => ({
      ...prev,
      techStacks: prev.techStacks.filter((_, i) => i !== index),
    }));
  };

  const handleApplyInterests = (selectedInterests: string[]) => {
    setProfile((prev: ProfileFormData) => ({
      ...prev,
      interests: selectedInterests,
    }));
    setShowInterestModal(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setModalContent({
        title: "이미지 업로드 오류",
        message: "파일이 없습니다.",
        type: "error",
      });
      setShowModal(true);
      return;
    }

    try {
      const uploadedImageUrl = await uploadProfileImage(file);
      setProfile((prev: ProfileFormData) => ({
        ...prev,
        image: uploadedImageUrl,
        uploadedImagePath: uploadedImageUrl,
      }));
    } catch (err) {
      console.error("이미지 업로드 실패", err);
      if (axios.isAxiosError(err)) {
        console.log("서버 응답 메시지:", err.response?.data.message);
      }
      setModalContent({
        title: "업로드 실패",
        message: "이미지 업로드 중 오류가 발생했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const handleSave = async () => {
    if (!accessToken) return;

    try {
      const departmentId = departmentsList.find(
        (d) => d.name === profile.major
      )?.id;

      const techStackIdList = techList
        .filter((t) => profile.techStacks.includes(t.name))
        .map((t) => t.id);

      // 관심분야는 UserTagAPI에서 이미 저장되므로 여기서는 제외
      console.log("💾 저장할 관심분야 (UserTagAPI에서 처리됨):", profile.interests);

      const imageToUse = profile.uploadedImagePath || profile.image || "/assets/images/user.png";
      const [sns1 = "", sns2 = "", sns3 = ""] = profile.sns;

      const payload = {
        memberIntroduce: profile.introduce,
        memberImageUrl: imageToUse,
        memberSnsUrl1: sns1,
        memberSnsUrl2: sns2,
        memberSnsUrl3: sns3,
        memberDepartmentUpdateRequestIdList: departmentId ? [departmentId] : [],
        // memberInterestUpdateRequestIdList 제거 - UserTagAPI 사용
        memberTechStackUpdateRequestIdList: techStackIdList,
      };
      console.log("💾 전송할 데이터:", payload);

      await updateMemberProfile(payload);

      setModalContent({
        title: "프로필 수정 완료",
        message: "프로필 수정을 완료했습니다.",
        type: "info",
        onClose: () => {
          setShowModal(false);
          window.location.reload();
        },
      });
      setShowModal(true);
    } catch (e) {
      console.error(e);
      setModalContent({
        title: "프로필 수정 오류",
        message: "프로필 수정중 오류가 발생했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 py-6 mx-auto bg-white shadow rounded-xl md:px-10 md:py-10">
      <h2 className="mb-4 text-xl font-bold text-[#1e3a8a]">내 프로필 변경</h2>
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

        <EditProfileImage
          image={profile.image}
          isEditing={isEditing}
          onChange={handleImageChange}
          fileInputRef={fileInputRef}
        />

        <EditProfileField name={profile.name} email={profile.email} />

        <EditDepartment
          isEditing={isEditing}
          departmentInput={departmentInput}
          onInputChange={handleDepartmentChange}
          filteredDepartments={filteredDepartments}
          onSelect={handleSelectDepartment}
        />

        <EditIntroduce
          value={profile.introduce}
          isEditing={isEditing}
          onChange={(val) => handleChange("introduce", val)}
        />

        <EditInterests
          isEditing={isEditing}
          interests={profile.interests}
          onOpenModal={() => setShowInterestModal(true)}
        />

        {/* 관심분야 선택 모달 */}
        {showInterestModal && (
          <InterestSelectModal
            onClose={() => setShowInterestModal(false)}
            onApply={handleApplyInterests}
            currentInterests={profile.interests}
          />
        )}

        <EditTechStacks
          techStacks={profile.techStacks}
          isEditing={isEditing}
          newTech={newTech}
          filtered={filteredTechs}
          onInputChange={handleTechInputChange}
          onSelect={handleSelectTech}
          onDelete={handleDeleteTech}
        />

        <EditSNS
          sns={profile.sns}
          isEditing={isEditing}
          onChange={(newSNS) => setProfile((prev: ProfileFormData) => ({ ...prev, sns: newSNS }))}
        />

        <EditProfileButtons
          isEditing={isEditing}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
          onEdit={() => setIsEditing(true)}
        />
    </div>
  );
}
