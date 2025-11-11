// 이름/이메일 등 readonly 필드
interface Props {
  name: string;
  email: string;
}

export default function EditProfileField({ name, email }: Props) {
  const isChosunEmail = email.endsWith("@chosun.ac.kr") || email.endsWith("@chosun.kr");

  return (
    <>
      {/* 이름 */}
      <div className="flex flex-col mb-4 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold mb-1 sm:mb-0 sm:w-28 min-w-[5rem]">이름</label>
        <input
          value={name}
          disabled
          className="w-full p-2 bg-gray-100 rounded sm:flex-1"
        />
      </div>

      {/* 이메일 */}
      <div className="flex flex-col mb-4 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold mb-1 sm:mb-0 sm:w-28 min-w-[5rem]">이메일</label>
        <div className="flex items-center w-full gap-2 overflow-hidden sm:flex-1">
          <input
            value={email}
            disabled
            className="w-full p-2 truncate bg-gray-100 rounded"
          />
          {isChosunEmail && (
            <img
              src="/assets/images/verified-badge.png"
              alt="Verified"
              title="조선대 인증 이메일"
              className="flex-shrink-0 w-6 h-6"
            />
          )}
        </div>
      </div>
    </>
  );
}
