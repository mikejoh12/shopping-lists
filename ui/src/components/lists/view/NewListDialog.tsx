import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useAddListMutation } from "../../../store/api";
import { useDispatch } from "react-redux";
import { displaySnackBar, MsgSeverity } from "../../../features/uiSlice";
import { useAuth } from "../../../hooks/useAuth";
import { addNewVisitorList } from "../../../features/listsSlice";
import { ShoppingList } from "../../../store/api";
import { v4 as uuidv4 } from "uuid";
import { setSelectedList } from "../../../features/userSlice";
import { Stack } from "@mui/material";

type Inputs = {
  name: string;
};

export default function NewListDialog() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const auth = useAuth();

  const [addList] = useAddListMutation();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (auth.user.name) {
      try {
        const payload = await addList(data).unwrap();
        dispatch(setSelectedList({ id: payload.id }));
      } catch (err) {
        console.error("error", err);
      }
    } else {
      const newList: ShoppingList = {
        id: uuidv4(),
        ownerId: null,
        ownerName: "",
        name: data.name,
        items: [],
        sharingIds: [],
        sharingInviteIds: [],
        sharingNames: [],
      };
      dispatch(addNewVisitorList(newList));
      dispatch(setSelectedList({ id: newList.id }));
    }
    reset();
    handleClose();
    dispatch(
      displaySnackBar({
        msg: "New list created: " + data.name,
        severity: MsgSeverity.Success,
      })
    );
  };

  return (
    <div>
      <Box sx={{ textAlign: "center", margin: "auto", p: 1 }}>
        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          Create new list
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Enter new list name</DialogTitle>
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
                  Create
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </div>
  );
}
