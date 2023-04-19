import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type UserState = {
  name: string | null;
  userId: string | null;
  selectedListId: string;
};

const slice = createSlice({
  name: "user",
  initialState: { name: null, userId: null, selectedListId: "" } as UserState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{username: string | null, userId: string | null}>) => {
      state.name = action.payload.username;
      state.userId = action.payload.userId;
    },
    setSelectedList: (state, action: PayloadAction<{ id: string }>) => {
      state.selectedListId = action.payload.id;
    },
  },
});

export const { setCredentials, setSelectedList } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.user;

export default slice.reducer;
