import { useState, useEffect } from "react";

/**
 * 브라우저 width가 화면 해상도의 1/3 이하일 경우 모바일로 간주
 * @returns {boolean} true: 모바일, false: 데스크탑
 */
export default function useResponsive(): boolean {
  const getIsMobile = () => window.innerWidth / window.screen.width <= 1 / 2;

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
