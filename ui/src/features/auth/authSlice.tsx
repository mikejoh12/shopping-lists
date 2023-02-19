import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
};

interface User {
  name: string;
}

const slice = createSlice({
  name: "auth",
  initialState: { user: null, isLoggedIn: false } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: User; }>
    ) => {
      state.user = user;
      state.isLoggedIn = true
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
