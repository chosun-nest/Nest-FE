import React, { useState, useEffect, useRef } from "react";
import {
  getMemberProfile,
  getTech,
  getDepartments,
  uploadProfileImage,
  updateMemberProfile,
} from "../../api/profile/ProfileAPI";
import axios from "axios";

import {
  Item,
  DepartmentResponse,
  TechStackResponse,
  ProfileFormData,
} from "../../types/profile";

// 하위 컴포넌트 import
import EditProfileImage from "./edit-myprofile/EditProfileImage";
import EditProfileField from "./edit-myprofile/EditProfileField";
import EditDepartment from "./edit-myprofile/EditDepartment";
import EditIntroduce from "./edit-myprofile/EditIntroduce";
import EditTechStacks from "./edit-myprofile/EditTechStacks";
import EditSNS from "./edit-myprofile/EditSNS";
import EditProfileButtons from "./edit-myprofile/EditProfileButtons";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/slices/authSlice";
import { ModalContent } from "../../types/modal";
import Modal from "../common/modal";

export default function MyProfile() {
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
  });

  const [departmentsList, setDepartmentsList] = useState<Item[]>([]);
  const [techList, setTechList] = useState<Item[]>([]);

  const [departmentInput, setDepartmentInput] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Item[]>([]);
  const [newTech, setNewTech] = useState("");
  const [filteredTechs, setFilteredTechs] = useState<Item[]>([]);

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
    const data = await getMemberProfile();
    setProfile({
      image: data.memberImageUrl || "/assets/images/user.png",
      uploadedImagePath: data.memberImageUrl || "",
      name: data.memberName,
      email: data.memberEmail,
      major: data.memberDepartmentResponseDtoList?.[0]?.departmentName || "",
      introduce: data.memberIntroduce || "",
      techStacks: data.memberTechStackResponseDtoList.map(
        (t: { techStackId: number; techStackName: string }) => t.techStackName
      ),
      sns: [
        data.memberSnsUrl1,
        data.memberSnsUrl2,
        data.memberSnsUrl3,
        data.memberSnsUrl4,
      ].filter(Boolean),
    });
    setDepartmentInput(
      data.memberDepartmentResponseDtoList?.[0]?.departmentName || ""
    );
  };

  const getItems = async () => {
    const [deps, techs] = await Promise.all([
      getDepartments(),
      getTech(),
    ]);

    setDepartmentsList(deps.map((d: DepartmentResponse) => ({
      id: d.departmentId,
      name: d.departmentName,
    })));

    setTechList(techs.map((t: TechStackResponse) => ({
      id: t.techStackId,
      name: t.techStackName,
    })));
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
    setProfile((prev) => ({ ...prev, major: item.name }));
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
      setProfile((prev) => ({
        ...prev,
        techStacks: [...prev.techStacks, item.name],
      }));
    }
    setNewTech("");
    setFilteredTechs([]);
  };

  const handleDeleteTech = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      techStacks: prev.techStacks.filter((_, i) => i !== index),
    }));
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
      const sanitizedUrl = uploadedImageUrl.replace(/(https?:\/\/[^/]+)+/, "$1");
      setProfile((prev) => ({
        ...prev,
        image: sanitizedUrl,
        uploadedImagePath: sanitizedUrl,
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

      const imageToUse = profile.uploadedImagePath || profile.image || "/assets/images/user.png";
      const [sns1 = "", sns2 = "", sns3 = ""] = profile.sns;

      await updateMemberProfile({
        memberIntroduce: profile.introduce,
        memberImageUrl: imageToUse,
        memberSnsUrl1: sns1,
        memberSnsUrl2: sns2,
        memberSnsUrl3: sns3,
        memberDepartmentUpdateRequestIdList: departmentId ? [departmentId] : [],
        memberTechStackUpdateRequestIdList: techStackIdList,
      });

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
    <div className="max-w-2xl p-10 mx-auto bg-white shadow rounded-xl">
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
      <h2 className="mb-4 text-xl font-bold text-blue-900">내 프로필 변경</h2>

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
        onChange={(newSNS) => setProfile((prev) => ({ ...prev, sns: newSNS }))}
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
