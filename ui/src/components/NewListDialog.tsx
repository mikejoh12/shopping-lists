import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";

export default function NewListDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{ minWidth: 120, maxWidth: 400, margin: "auto", p: 2 }}>
        <Button variant="outlined" onClick={handleClickOpen}>
          Create new list
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Enter new list name</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="List name"
              type="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Create List</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
