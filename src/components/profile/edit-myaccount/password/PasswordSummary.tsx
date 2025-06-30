// 비밀번호 변경 버튼 누르기 전, * 표시로 비밀번호 summary 나타내는 컴포넌트
interface Props {
  onEdit: () => void;
  passwordLength: number;
}

export default function PasswordSummary({ onEdit, passwordLength }: Props) {
  return (
    <div className="mb-8">
      {/* 비밀번호 표시 */}
      <div className="flex flex-col mb-2 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold mb-1 sm:mb-0 sm:w-36 min-w-[6rem]">
          비밀번호
        </label>
        <input
          type="password"
          value={"*".repeat(passwordLength)}
          disabled
          className="w-full p-2 text-lg tracking-widest bg-gray-100 rounded sm:flex-1"
        />
      </div>

      {/* 설정 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="w-full px-4 py-2 text-white bg-blue-900 rounded sm:w-auto"
        >
          설정
        </button>
      </div>
    </div>
  );
}
