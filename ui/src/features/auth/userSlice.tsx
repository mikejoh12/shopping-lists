import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  selectedListId: string;
};

const slice = createSlice({
  name: "user",
  initialState: { selectedListId: "" } as UserState,
  reducers: {
    setSelectedListId: (state, action: PayloadAction<string>) => {
      state.selectedListId = action.payload;
    },
  },
});

export const { setSelectedListId } = slice.actions;

export default slice.reducer;
