import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { useDeleteListMutation } from "../../store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSelectedList } from "../../features/userSlice";
import { displaySnackBar, MsgSeverity } from "../../features/uiSlice";
import { useAuth } from "../../hooks/useAuth";
import { removeNewVisitorList } from "../../features/listsSlice";

export default function ManageListDialog() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const auth = useAuth();

  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const [deleteList] = useDeleteListMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleDeleteList() {
    dispatch(setSelectedList({ id: "" }));
    try {
      if (auth.user) {
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
    }
  }

  return (
    <div>
      <Box sx={{ textAlign: "center", p: 1}}>
        <Button variant="outlined" onClick={handleClickOpen} color="secondary">
          Manage List
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Manage List</DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions sx={{margin: "auto"}}>
            <Button variant="contained" onClick={handleDeleteList}>Delete List</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
