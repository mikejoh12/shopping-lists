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

type Inputs = {
  name: string;
};

export default function NewListDialog() {
  const [open, setOpen] = React.useState(false);

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
    console.log(data);
    addList(data)
    handleClose();
  };

  return (
    <div>
      <Box sx={{ minWidth: 120, maxWidth: 400, margin: "auto", p: 2 }}>
        <Button variant="outlined" onClick={handleClickOpen}>
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
              <Button type="submit">Create List</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </div>
  );
}
