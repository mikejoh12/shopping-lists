import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UiState = {
    isSnackBarOpen:  boolean;
    snackBarMsg: string;
};

const slice = createSlice({
  name: "ui",
  initialState: { isSnackBarOpen: false, snackBarMsg: "" } as UiState,
  reducers: {
    displaySnackBar: (state, action: PayloadAction<string>) => {
      state.snackBarMsg = action.payload;
      state.isSnackBarOpen = true;
    },
    hideSnackBar: (state, action: PayloadAction<void>) => {
      state.isSnackBarOpen = false;
      state.snackBarMsg = "";
    },
  },
});

export const { displaySnackBar, hideSnackBar } = slice.actions;

export default slice.reducer;