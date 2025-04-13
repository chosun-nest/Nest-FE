import React, { useState, useEffect } from "react";
import { sendcode, verifycode } from "../../api/auth/auth";

export default function AccountStudentEmail() {
  const [isStudentMailEditing, setStudentMailEditing] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentAuthCode, setStudentAuthCode] = useState("");
  const [studentTimer, setStudentTimer] = useState(0);
  const [studentIntervalId, setStudentIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isStudentEmailVerified, setIsStudentEmailVerified] = useState(false);

  const formatTime = (time: number) => `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (studentTimer === 0 && studentIntervalId) {
      clearInterval(studentIntervalId);
      setStudentIntervalId(null);
    }
  }, [studentTimer, studentIntervalId]);

  const handleSendStudentCode = () => {
    if (!studentEmail.includes("@chosun.ac.kr")) {
      alert("조선대 이메일만 인증할 수 있어요.");
      return;
    }
    try {
      setIsStudentEmailVerified(false);
      sendcode(studentEmail);
      setStudentTimer(300);
      if (studentIntervalId) clearInterval(studentIntervalId);
      const newInterval = setInterval(() => {
        setStudentTimer((prev) => {
          if (prev <= 1) {
            clearInterval(newInterval);
            setStudentIntervalId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setStudentIntervalId(newInterval);
    } catch (e) {
      console.error("인증코드 전송 실패", e);
    }
  };

  const handleVerifyStudentCode = async () => {
    try {
      const res = await verifycode(studentEmail, studentAuthCode);
      if (res === "Email verified successfully") {
        alert("인증 성공!");
        setIsStudentEmailVerified(true);
      } else {
        alert("인증 실패");
      }
    } catch (e) {
      console.error("인증 오류", e);
      alert("인증 요청 중 오류 발생");
    }
  };

  const handleSaveStudentEmail = async () => {
    try {
      if (!isStudentEmailVerified) {
        alert("이메일 인증이 완료되지 않았습니다.");
        return;
      }
      alert("이메일이 저장되었습니다!");
      setStudentMailEditing(false);
    } catch (e) {
      alert("이메일 저장 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center mb-4">
        <label className="w-36 text-sm font-semibold">재학생 이메일 인증</label>
        {!isStudentMailEditing && (
          <input
            type="text"
            value={studentEmail}
            disabled
            className="flex-1 bg-gray-100 p-2 rounded"
          />
        )}
      </div>

      {isStudentMailEditing && (
        <>
          <div className="flex items-center mb-4">
            <label className="w-36 text-sm font-semibold">학교 이메일</label>
            <input
              className="flex-1 border p-2 rounded"
              placeholder="example@chosun.ac.kr"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              disabled={isStudentEmailVerified}
            />
          </div>

          <div className="flex items-center mb-4 relative">
            <label className="w-36 text-sm font-semibold">인증번호</label>
            <input
              className="flex-1 border p-2 rounded pr-16"
              placeholder="인증번호 입력"
              value={studentAuthCode}
              onChange={(e) => setStudentAuthCode(e.target.value)}
            />
            {studentTimer > 0 && (
              <span className="absolute right-3 text-sm text-gray-500">
                {formatTime(studentTimer)}
              </span>
            )}
          </div>

          {!isStudentEmailVerified && studentTimer > 0 && (
            <div className="text-right mb-2">
              <button
                onClick={handleVerifyStudentCode}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: "#002F6C" }}
              >
                인증번호 확인하기
              </button>
            </div>
          )}

          {isStudentEmailVerified && (
            <>
              <p className="text-green-600 text-sm ml-36 mb-2">✅ 인증 완료되었습니다</p>
              <div className="text-right mb-2">
                <button
                  onClick={handleSaveStudentEmail}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  저장
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* 설정/취소/보내기 버튼 */}
      <div className="text-right mt-4">
        {isStudentMailEditing ? (
          <>
            <button
              onClick={() => {
                setStudentMailEditing(false);
                setStudentEmail("");
                setStudentAuthCode("");
                setIsStudentEmailVerified(false);
                setStudentTimer(0);
              }}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            <button
              onClick={handleSendStudentCode}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {studentTimer > 0 ? "다시 보내기" : "인증코드 보내기"}
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setStudentMailEditing(true);
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
