// 비밀번호 변경 모달
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  checkPassword,
  updateMemberPassword,
} from "../../../../api/profile/ProfileAPI";
import LoadingDots from "../../../ui/LoadingDots";
import CheckIcon from "../../../ui/CheckIcon";
import Modal from "../../../common/modal"; // common Modal 컴포넌트
import { ModalContent } from "../../../../types/modal";

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean | null>(
    null
  );

  // 모달 관련 상태 추가
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 유효성 검사
  const hasTwoCharTypes =
    /(?=(?:.*[a-zA-Z])(?:.*[0-9!@#$%^&*()\-_=+{};:,<.>])|(?:.*[0-9])(?:.*[a-zA-Z!@#$%^&*()\-_=+{};:,<.>])|(?:.*[!@#$%^&*()\-_=+{};:,<.>])(?:.*[a-zA-Z0-9])).{2,}/.test(
      newPassword
    );
  const isLengthValid =
    /^.{8,32}$/.test(newPassword) && !/\s/.test(newPassword);
  const hasNoRepeatedChars = !/(.)\1\1/.test(newPassword);
  const isConfirmMatch =
    confirmPassword !== "" && newPassword === confirmPassword;
  const isPasswordValid =
    hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && isConfirmMatch;

  // 디바운스를 위한 타이머 id 저장
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // currentPassword 바뀔 때마다 자동 검증 (디바운스 적용)
  useEffect(() => {
    if (!currentPassword) {
      setIsPasswordVerified(null);
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      verifyPassword();
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentPassword]);

  const verifyPassword = async () => {
    setIsChecking(true);
    try {
      const response = await checkPassword({ password: currentPassword });

      // 200이면 맞음 (비밀번호 일치)
      // 403이면 틀림 (비밀번호 불일치)
      if (response.status === 200) {
        setIsPasswordVerified(true);
      } else {
        setIsPasswordVerified(false);
      }
    } catch {
      setIsPasswordVerified(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateMemberPassword({
        currentPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
      });
      setModalContent({
        title: "비밀번호 변경 완료",
        message: "비밀번호가 성공적으로 변경되었습니다.",
        type: "info",
      });
      setShowModal(true);
    } catch {
      setModalContent({
        title: "변경 실패",
        message: "비밀번호 변경에 실패했습니다. 다시 시도해주세요.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const isNextEnabled = isPasswordVerified === true;
  const isSaveEnabled = isPasswordVerified === true && isPasswordValid;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  비밀번호 변경
                </h3>

                <div className="relative">
                  <label className="block mb-1 text-sm font-semibold">
                    현재 비밀번호
                  </label>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 pr-10 mb-3 border rounded focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
                    placeholder="현재 비밀번호 입력"
                  />
                  <div className="absolute inset-y-0 flex items-center right-3">
                    {isChecking ? (
                      <LoadingDots />
                    ) : isPasswordVerified === true ? (
                      <CheckIcon />
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  className="mb-2 text-xs text-gray-500"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? "🔒 숨기기" : "👁️ 보기"}
                </button>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border rounded"
                  >
                    닫기
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isNextEnabled}
                    className={`px-4 py-2 rounded text-white ${
                      isNextEnabled
                        ? "bg-blue-900 hover:bg-blue-950"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    다음
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  새 비밀번호 설정
                </h3>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 pr-10 mb-3 border rounded focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
                    placeholder="새 비밀번호 입력"
                  />
                  <button
                    type="button"
                    className="absolute text-sm text-gray-400 right-3 top-2"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? "🔒" : "👁️"}
                  </button>
                </div>

                <div className="mb-3 text-sm">
                  <p
                    className={
                      hasTwoCharTypes ? "text-green-600" : "text-gray-500"
                    }
                  >
                    ✓ 영문/숫자/특수문자 2종 이상
                  </p>
                  <p
                    className={
                      isLengthValid ? "text-green-600" : "text-gray-500"
                    }
                  >
                    ✓ 8자 이상 32자 이하
                  </p>
                  <p
                    className={
                      hasNoRepeatedChars ? "text-green-600" : "text-gray-500"
                    }
                  >
                    ✓ 연속 3자 이상 반복 금지
                  </p>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 pr-10 mb-3 border rounded focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
                    placeholder="새 비밀번호 재입력"
                  />
                  <button
                    type="button"
                    className="absolute text-sm text-gray-400 right-3 top-2"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? "🔒" : "👁️"}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`text-sm ${isConfirmMatch ? "text-green-600" : "text-red-500"}`}
                  >
                    {isConfirmMatch
                      ? "비밀번호가 일치합니다"
                      : "비밀번호가 일치하지 않습니다"}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border rounded"
                  >
                    뒤로
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!isSaveEnabled}
                    className={`px-4 py-2 rounded text-white ${
                      isSaveEnabled
                        ? "bg-blue-900 hover:bg-blue-950"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    변경하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 결과 알림용 모달 */}
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={onClose} // 모달 닫으면 ChangePasswordModal 전체를 닫도록
        />
      )}
    </>
  );
}
