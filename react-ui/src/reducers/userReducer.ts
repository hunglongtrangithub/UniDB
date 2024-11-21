import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  userName: string | null;
  userRole: string | null;
}

const initialState: UserState = {
  userId: null,
  userName: null,
  userRole: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        userId: string;
        userName: string;
        userRole: string;
      }>,
    ) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.userRole = action.payload.userRole;
    },
    clearUser: (state) => {
      state.userId = null;
      state.userName = null;
      state.userRole = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
