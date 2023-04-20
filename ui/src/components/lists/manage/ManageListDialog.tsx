import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import {
  useCheckoutListMutation,
  useDeleteListMutation,
} from "../../../store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setSelectedList } from "../../../features/userSlice";
import {
  displaySnackBar,
  MsgSeverity,
  setIsManageListDialogOpen,
  setIsShareListDialogOpen,
} from "../../../features/uiSlice";
import { useAuth } from "../../../hooks/useAuth";
import {
  removeCheckedItems,
  removeNewVisitorList,
} from "../../../features/listsSlice";
import { useNavigate } from "react-router-dom";

interface ManageListDialogProps {
  showListOwnerButtons: boolean;
}

export default function ManageListDialog({
  showListOwnerButtons,
}: ManageListDialogProps) {
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigate = useNavigate();

  const isManageListDialogOpen = useSelector(
    (state: RootState) => state.ui.isManageListDialogOpen
  );

  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const [deleteList] = useDeleteListMutation();
  const [checkoutList] = useCheckoutListMutation();

  const handleClose = () => {
    dispatch(setIsManageListDialogOpen(false));
  };

  async function handleDeletePurchasedItems() {
    try {
      if (auth.user.name) {
        await checkoutList(selectedListId).unwrap();
      } else {
        dispatch(removeCheckedItems({ listId: selectedListId }));
      }
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "Error deleting checked off items",
          severity: MsgSeverity.Error,
        })
      );
    }
    handleClose();
  }

  async function handleDeleteList() {
    dispatch(setSelectedList({ id: "" }));
    try {
      if (auth.user.name) {
        await deleteList(selectedListId).unwrap();
      } else {
        dispatch(removeNewVisitorList({ id: selectedListId }));
      }
      dispatch(
        displaySnackBar({
          msg: "List deleted",
          severity: MsgSeverity.Success,
        })
      );
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "Error deleting list",
          severity: MsgSeverity.Error,
        })
      );
    } finally {
      handleClose();
      navigate("/");
    }
  }

  async function handleShareList() {
    dispatch(setIsManageListDialogOpen(false));
    dispatch(setIsShareListDialogOpen(true));
  }

  return (
    <div>
      <Box sx={{ textAlign: "center", p: 1 }}>
        <Dialog open={isManageListDialogOpen} onClose={handleClose}>
          <DialogTitle>Manage List</DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions sx={{ margin: "auto" }}>
            <Button variant="contained" onClick={handleDeletePurchasedItems}>
              Check Out
            </Button>
            {showListOwnerButtons && auth.user && (
              <Button variant="contained" onClick={handleShareList}>
                Share List
              </Button>
            )}
            {showListOwnerButtons && (
              <Button variant="contained" onClick={handleDeleteList}>
                Delete List
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
