import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useAddListMutation } from "../store/api";
import { useDispatch } from "react-redux";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";

type Inputs = {
  name: string;
};

export default function NewListDialog() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const [addList] = useAddListMutation();

  const { control, handleSubmit } = useForm({
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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addList(data);
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
      <Box sx={{ textAlign: "center", p: 1 }}>
        <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
          Create new list
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Enter new list name</DialogTitle>
            <DialogContent>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <TextField {...field} />}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">
                Create List
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </div>
  );
}
