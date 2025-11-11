import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../types/store";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔁 전체 세트 설정
    setTokens(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
    },
    // ✅ accessToken만 따로 설정 (App.tsx에서 사용)
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    // 🔄 전체 삭제
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
    },
  },
});

// 🔍 셀렉터들
export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;

export const selectRefreshToken = (state: RootState): string | null =>
  state.auth.refreshToken;

export const selectUserId = (state: RootState): string | null =>
  state.auth.userId;

export const selectIsLoggedIn = (state: RootState): boolean =>
  !!state.auth.accessToken;

// ✅ 액션 export
export const { setTokens, setAccessToken, clearTokens } = authSlice.actions;

export default authSlice.reducer;
