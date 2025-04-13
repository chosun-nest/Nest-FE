import { useRef, useEffect, useState } from "react";
import Navbar from "../components/layout/navbar";
import EditMyProfile from "../components/profile/edit-myprofile";
import EditMyAccount from "../components/profile/edit-myaccount";

export default function ProfileEdit() {
    const navbarRef = useRef<HTMLDivElement>(null);
    const [navHeight, setNavHeight] = useState(0);

    useEffect(() => {
        if (navbarRef.current) {
            setNavHeight(navbarRef.current.offsetHeight);
        }
    }, []);
return (
    <>
        <Navbar ref={navbarRef} />
        {/* 콘텐츠 전체 영역 */}
        <div className="px-8 bg-white min-h-screen" style={{ paddingTop: navHeight + 20 }}>
        {/* 내 프로필 변경 */}
        <div className="w-full px-4 mt-6">
            <EditMyProfile />            
        </div>
        {/* 계정 관리 */}
        <div className="w-full px-4 mt-6">
            <EditMyAccount />
        </div>

        </div>
    </>
    );
}
