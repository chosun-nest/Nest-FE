import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Ai from "./ai";
import { useEffect, useRef, useState } from "react";
import { NavbarHeightContext } from "../../context/NavbarHeightContext";
import Footer from "./footer";

export default function Layout() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <NavbarHeightContext.Provider value={{ navbarHeight, setNavbarHeight }}>
      <Navbar ref={navbarRef} />
      <Ai />
      <Outlet />
      <Footer />
    </NavbarHeightContext.Provider>
  );
}
