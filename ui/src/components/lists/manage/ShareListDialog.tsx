import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  MsgSeverity,
  displaySnackBar,
  selectIsShareListDialogOpen,
  setIsShareListDialogOpen,
} from "../../../features/uiSlice";
import { Stack } from "@mui/material";
import { useShareListMutation } from "../../../store/api";
import { RootState } from "../../../store/store";

type Inputs = {
  name: string;
};

export default function ShareListDialog() {
  const dispatch = useDispatch();
  const open = useSelector(selectIsShareListDialogOpen);
  const [shareList] = useShareListMutation();
  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    reset();
    dispatch(setIsShareListDialogOpen(false));
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await shareList({ listId: selectedListId, userName: data.name }).unwrap();
      dispatch(
        displaySnackBar({
          msg: "Created invitation to share list with user: " + data.name,
          severity: MsgSeverity.Success,
        })
      );
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "Error sharing list with user: " + data.name,
          severity: MsgSeverity.Error,
        })
      );
    } finally {
      handleClose();
    }
  };

  return (
    <div>
      <Box sx={{ textAlign: "center", margin: "auto", p: 1 }}>
        <Dialog open={open} onClose={handleClose} sx={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Enter user to share this list with</DialogTitle>
            <DialogContent>
              <Controller
                name="name"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <TextField {...field} />}
              />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Share
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </div>
  );
}
