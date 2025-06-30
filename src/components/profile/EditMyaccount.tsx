import AccountPassword from "./edit-myaccount/password/password";
//import AccountEmailVerification from "./edit-myaccount-components/EmailVerification"; //기능 삭제함
import Withdraw from "./edit-myaccount/withdraw/withdraw";

export default function EditMyAccount() {
  return (
    <div className="w-full max-w-2xl px-4 py-6 mx-auto bg-white shadow rounded-xl md:px-10 md:py-10">
      <h2 className="mb-4 text-xl font-bold text-[#1e3a8a]">계정 관리</h2>

      {/* 비밀번호 변경하기 */}
      <AccountPassword />
      
      {/* 탈퇴하기 */}
      <div className="pt-8 mt-12 border-t">
        <Withdraw />
      </div>
      
    </div>
  );
}