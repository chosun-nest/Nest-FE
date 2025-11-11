// password 변경 주 컴포넌트
import { useState, useEffect } from "react";
import PasswordSummary from "./PasswordSummary";
import ChangePasswordModal from "./PasswordChangeModal";
import { getMemberProfile } from "../../../../api/profile/ProfileAPI"; // 비밀번호 길이 가져오는 API

export default function AccountPassword() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLength, setPasswordLength] = useState<number | null>(null);

  useEffect(() => {
    const fetchPasswordLength = async () => {
      try {
        const data = await getMemberProfile();
        setPasswordLength(data.memberPasswordLength);
      } catch (err) {
        console.error("비밀번호 길이 가져오기 실패", err);
      }
    };
    fetchPasswordLength();
  }, []);

  return (
    <div className="mb-8">
      {passwordLength !== null && (
        <PasswordSummary    // 비밀번호 summary 컴포넌트
          onEdit={() => setShowPasswordModal(true)}
          passwordLength={passwordLength}
        />
      )}

      {showPasswordModal && (   // 설정 버튼 누른 후, password 변경 컴포넌트
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
