import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  isSnackBarOpen: boolean;
  snackBarMsg: string;
  isManageListDialogOpen: boolean;
  snackBarSeverity: MsgSeverity;
};

export enum MsgSeverity {
  Success = "success",
  Error = "error",
}

const slice = createSlice({
  name: "ui",
  initialState: {
    isSnackBarOpen: false,
    snackBarMsg: "",
    isManageListDialogOpen: false,
  } as UiState,
  reducers: {
    displaySnackBar: (
      state,
      action: PayloadAction<{ msg: string; severity: MsgSeverity }>
    ) => {
      state.snackBarMsg = action.payload.msg;
      state.snackBarSeverity = action.payload.severity;
      state.isSnackBarOpen = true;
    },
    hideSnackBar: (state, action: PayloadAction<void>) => {
      state.isSnackBarOpen = false;
      state.snackBarMsg = "";
      state.snackBarSeverity = MsgSeverity.Success;
    },
    setIsManageListDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isManageListDialogOpen = action.payload
    }
  },
});

export const { displaySnackBar, hideSnackBar, setIsManageListDialogOpen } = slice.actions;

export default slice.reducer;
