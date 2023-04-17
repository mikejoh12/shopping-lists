import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type UiState = {
  isSnackBarOpen: boolean;
  snackBarMsg: string;
  isManageListDialogOpen: boolean;
  isShareListDialogOpen: boolean;
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
    isShareListDialogOpen: false,
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
      state.isManageListDialogOpen = action.payload;
    },
    setIsShareListDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isShareListDialogOpen = action.payload;
    },
  },
});

export const {
  displaySnackBar,
  hideSnackBar,
  setIsManageListDialogOpen,
  setIsShareListDialogOpen,
} = slice.actions;

export const selectIsShareListDialogOpen = (state: RootState) =>
  state.ui.isShareListDialogOpen;

export default slice.reducer;
