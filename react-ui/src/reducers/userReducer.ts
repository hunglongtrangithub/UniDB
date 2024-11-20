import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName: string | null;
  userRole: string | null;
}

const initialState: UserState = {
  userName: null,
  userRole: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userName: string; userRole: string }>) => {
      state.userName = action.payload.userName;
      state.userRole = action.payload.userRole;
    },
    clearUser: (state) => {
      state.userName = null;
      state.userRole = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

