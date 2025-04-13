import { Link } from "react-router-dom";
import styled from "styled-components";

export const NavbarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80px;
  max-height: 120px;
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const NavbarContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;

  justify-content: space-between;
  padding: 1rem;
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: right;
  text-decoration-line: none;
  color: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  color: #002f6c;
  gap: 0.5rem;

  img {
    width: 42px;
    height: 42px;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 1.5rem;
  color: black;
  svg {
    height: 24px;
    width: 24px;
  }
`;

export const NavItem = styled.a`
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  transition: color 0.2s;

  &:hover {
    color: #002f6c;
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
`;

export const ProfileWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const ProfileIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
`;

export const ProfileMenu = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  position: absolute;
  width: 100px;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 0.5rem 0;
  z-index: 9999;
`;

export const ProfileMenuItem = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  color: #00256c;

  &:hover {
    background-color: #f2f4f8;
  }
`;

export const SearchIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;

  &:hover {
    color: #002f6c;
  }
`;

export const LoginLink = styled(Link)`
  display: inline-block;
  background: white;
  border: 1px solid #002f6c;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #002f6c;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #002f6c;
    color: white;
  }
`;

export const SignUpLink = styled(LoginLink)`
  background: #002f6c;
  color: white;
  border: none;

  &:hover {
    background: #001b40;
  }
`;

export const WebBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px; /* 아이템 간 간격 (적절히 조절 가능) */
  width: 100%;
  height: 40px;
  background-color: #f3f3f3;
`;

export const NavbarLink = styled(Link)`
  text-decoration: none;
  text-decoration-line: none;
  text-decoration: none;
`;

export const WebBarItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  cursor: pointer;

  &:hover {
    font-weight: 700;
  }

  &.active {
    font-weight: 700;
  }
`;
