import React, { useState } from "react";
//import { verifyPassword, updatePassword } from "../../api";  //api에서 정보 가져오기

export default function AccountPassword() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const getMaskedPassword = (pw: string) => "*".repeat(pw.length);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordEditing, setPasswordEditing] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);
  const [isCurrentPwVerified, setIsCurrentPwVerified] = useState(false);

  const hasTwoCharTypes = /(?=.*[a-zA-Z])(?=.*[\d\W]).*/.test(passwords.new);
  const isLengthValid = /^.{8,32}$/.test(passwords.new) && !/\s/.test(passwords.new);
  const hasNoRepeatedChars = !/(.)\1\1/.test(passwords.new);
  const isPasswordValid =
    hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && passwords.new === passwords.confirm;

  return (
    <div className="mb-8">
      {/* 현재 비밀번호 */}
      <div className="flex items-center mb-4">
        <label className="w-36 text-sm font-semibold">현재 비밀번호</label>
        <input
          type={isPasswordVisible ? "text" : "password"}
          value={isPasswordSaved ? "**********" : passwords.current}
          onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
          disabled={isPasswordSaved}
          className="flex-1 bg-gray-100 p-2 rounded"
        />
      </div>
      {isCurrentPwVerified && (
        <p className="text-sm text-blue-600 ml-36 mb-2">✔️ 현재 비밀번호가 일치합니다</p>
      )}
      {!isPasswordSaved && !isCurrentPwVerified && (
        <p className="text-xs text-gray-500 ml-36 mb-2">
          확인을 위해 현재 비밀번호를 다시 입력해 주세요.
        </p>
      )}

      {/* 새 비밀번호 입력 */}
      {isPasswordEditing && (
        <>
          <div className="flex items-center mb-4">
            <label className="w-36 text-sm font-semibold">새 비밀번호</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
              className="flex-1 p-2 border rounded"
            />
          </div>
          <ul className="text-xs ml-36 mb-4 space-y-1">
            <li className={hasTwoCharTypes ? "text-blue-600" : "text-red-500"}>✓ 영문/숫자/특수문자 중 2가지 이상 포함</li>
            <li className={isLengthValid ? "text-blue-600" : "text-red-500"}>✓ 8자 이상 32자 이하 입력 (공백 제외)</li>
            <li className={hasNoRepeatedChars ? "text-blue-600" : "text-red-500"}>✓ 연속 3자 이상 동일한 문자/숫자 제외</li>
          </ul>

          <div className="flex items-center mb-4">
            <label className="w-36 text-sm font-semibold">새 비밀번호 확인</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
              className="flex-1 p-2 border rounded"
            />
          </div>
          <p className="text-xs text-gray-500 ml-36 mb-4">
            확인을 위해 새 비밀번호를 다시 입력해주세요.
          </p>
        </>
      )}

      {/* 버튼 영역 */}
      <div className="text-right mt-4">
        {isPasswordEditing ? (
          <>
            <button
              onClick={() => {
                setPasswordEditing(false);
                setPasswords({ current: "", new: "", confirm: "" });
                setIsCurrentPwVerified(false);
              }}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            {/* <button
              onClick={async () => {
                try {
                  await verifyPassword(passwords.current);
                  setIsCurrentPwVerified(true);
                  await updatePassword({
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                  });
                  alert("비밀번호가 성공적으로 변경되었습니다.");
                  setPasswordEditing(false);
                  setIsPasswordSaved(true);
                } catch (err: any) {
                  console.error("비밀번호 변경 실패:", err);
                  alert(
                    err.response?.status === 401
                      ? "현재 비밀번호가 일치하지 않습니다."
                      : "비밀번호 변경 중 오류가 발생했습니다."
                  );
                  setIsCurrentPwVerified(false);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={!isPasswordValid}
            >
              저장          // 현재 비밀번호가 일치하면 저장 버튼이 뜸.
            </button> */}
          </>
        ) : (
          <button
            onClick={() => {
              setPasswordEditing(true);
              setIsPasswordSaved(false);
              setIsCurrentPwVerified(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            설정
          </button>
        )}
      </div>
    </div>
  );
}
