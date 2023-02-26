import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  name: string | null;
  selectedListId: string | null;
};

const slice = createSlice({
  name: "user",
  initialState: { name: null, selectedListId: null } as UserState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string|null>) => {
      state.name = action.payload;
    },
    setSelectedListId: (state, action: PayloadAction<string|null>) => {
      state.selectedListId = action.payload;
    },
  },
});

export const { setCredentials, setSelectedListId } = slice.actions;

export default slice.reducer;
