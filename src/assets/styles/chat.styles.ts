import styled, { css } from "styled-components";

export const Container = styled.div<{ navbarHeight: number }>`
  padding-top: ${({ navbarHeight }) => `${navbarHeight}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-inline: 4px;
  height: calc(100vh - ${({ navbarHeight }) => navbarHeight}px);
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  border-radius: 8px;
  border: 1px solid #002f6c;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 4px;
  flex-direction: row;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
`;

export const MessagesContainer = styled.div<{ isMobile?: boolean }>`
  flex: 1;
  overflow-y: hidden;
  background-color: #fff;

  ${({ isMobile }) =>
    isMobile
      ? css`
          padding: 10px 0;
        `
      : css`
          flex: 3;
          padding: 20px;
          border-right: 1px solid #eee;
        `}
`;

export const InputContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  background-color: #f1f1f1;

  ${({ isMobile }) =>
    isMobile
      ? css`
          padding: 10px 0;
          border-top: 1px solid #ccc;
        `
      : css`
          flex: 1;
          flex-direction: column;
          padding: 20px;
          justify-content: flex-end;
          border-top: none;
        `}
`;
export const Underbar = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  border: 1px solid #002f6c;
  width: 85%;

  max-width: 800px;
  min-width: 350px;
  height: 60px;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-bottom: 10px;
  background-size: 200% 100%;
  background-position: right center;
`;

export const UnderbarItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Monomaniac One", sans-serif;
  height: 100%;
  cursor: pointer;

  &:hover {
    background-color: #002f6c38;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #002f6c;
  }
`;
