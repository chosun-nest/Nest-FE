// src/context/BackdropContext.tsx
import { createContext, useContext } from "react";

export const BackdropContext = createContext<{
  showBackdrop: boolean;
  // ✅ 수정된 타입: React.Dispatch<React.SetStateAction<boolean>>
  setShowBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showBackdrop: false,
  setShowBackdrop: () => {},
});

export const useBackdrop = () => useContext(BackdropContext);
