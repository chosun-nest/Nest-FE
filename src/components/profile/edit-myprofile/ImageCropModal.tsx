// 이미지 자르기 모달
import { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImage } from "../../../types/image-crop-util";
import type { Area } from "react-easy-crop";

interface ImageCropModalProps {
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (file: File) => void;
}

export default function ImageCropModal({
  imageUrl,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCropComplete = (croppedArea: Area, croppedPixels: Area) => {
    // croppedArea 삭제하면 이미지 확대가 되므로 삭제 금지
    setCroppedAreaPixels(croppedPixels);
  };

  const handleConfirm = async () => {
    try {
      if (!croppedAreaPixels) return;
      const file = await getCroppedImage(imageUrl, croppedAreaPixels);
      onCropComplete(file);
      onClose();
    } catch (e) {
      console.error("이미지 자르기 실패", e);
      setError("이미지를 처리하는 데 문제가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-4 w-[90vw] max-w-sm">
        {/* Cropper 컨테이너 */}
        <div className="relative w-full overflow-hidden bg-gray-200 aspect-square">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            showGrid={true}
            cropShape="round"
          />
        </div>

        {/* 버튼 영역은 Cropper 아래로 분리 */}
        <div className="z-10 flex justify-end gap-2 mt-4">
          <button
            className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-3 py-1 text-sm text-white rounded bg-[#1E3A8A] hover:bg-[#1E3A8A]"
            onClick={handleConfirm}
          >
            완료
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-center text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
