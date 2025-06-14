// 프로필 이미지 업로드 및 미리보기
import React, { useState } from "react";
import ImageCropModal from "../edit-myprofile/ImageCropModal";

interface Props {
  image: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function EditProfileImage({
  image,
  isEditing,
  onChange,
  fileInputRef,
}: Props) {
  const [tempImageUrl, setTempImageUrl] = useState(""); // 업로드 원본 미리보기 (Data URL)
  const [previewUrl, setPreviewUrl] = useState<string>(""); // 잘린 이미지 미리보기
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setTempImageUrl(reader.result as string);
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: File) => {
    // 잘린 이미지 파일을 미리보기 URL로 변환
    const croppedPreview = URL.createObjectURL(croppedFile);
    setPreviewUrl(croppedPreview);

    // 실제 input에도 반영 (서버 전송용)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(croppedFile);
    const input = fileInputRef.current;
    if (input) {
      input.files = dataTransfer.files;
      onChange({ target: input } as React.ChangeEvent<HTMLInputElement>);
    }

    setShowCropModal(false);
  };

  const profileImageToShow = isEditing
    ? previewUrl || image || "/assets/images/user.png"
    : image || "/assets/images/user.png";

  return (
    <div className="flex items-start gap-4 mb-4">
      <label className="text-sm font-semibold w-28">이미지</label>

      <div
        className={`relative w-24 h-24 overflow-hidden rounded-full border ${
          isEditing ? "cursor-pointer group" : "cursor-default"
        }`}
        onClick={() => {
          if (isEditing) fileInputRef.current?.click();
        }}
      >
        <img
          src={profileImageToShow}
          alt="프로필"
          className={`object-cover w-full h-full transition ${
            isEditing ? "group-hover:opacity-80" : ""
          }`}
        />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>

      {showCropModal && (
        <ImageCropModal
          imageUrl={tempImageUrl}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
