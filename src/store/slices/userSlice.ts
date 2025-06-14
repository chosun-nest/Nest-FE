// memberId, memberName 등 보관

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../types/store";

interface UserState {
  memberId: number | null;
  memberName: string;
  memberRole: string;
}

const initialState: UserState = {
  memberId: null,
  memberName: "",
  memberRole: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.memberId = action.payload.memberId;
      state.memberName = action.payload.memberName;
      state.memberRole = action.payload.memberRole;
    },
    clearUser(state) {
      state.memberId = null;
      state.memberName = "";
      state.memberRole = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectCurrentUserId = (state: RootState) => state.user.memberId;
export const selectCurrentUserName = (state: RootState) => state.user.memberName;
export const selectCurrentUserRole = (state: RootState) => state.user.memberRole;

export default userSlice.reducer;
