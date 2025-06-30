// 저장/취소/설정 버튼
interface Props {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
  onEdit: () => void;
}

export default function EditProfileButtons({ isEditing, onCancel, onSave, onEdit }: Props) {
  const handleSave = () => {
    onSave(); // 저장 실행
  };

  return (
    <div className="flex flex-col gap-2 mt-6 sm:flex-row sm:justify-end">
      {isEditing ? (
        <>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 border rounded sm:w-auto"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 text-white bg-blue-900 rounded sm:w-auto"
          >
            저장
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          className="w-full px-4 py-2 text-white bg-blue-900 rounded sm:w-auto"
        >
          설정
        </button>
      )}
    </div>
  );
}
