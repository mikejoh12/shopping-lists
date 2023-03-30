import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Inputs = {
  newItem: string;
};

interface ListItemFormProps {
  handleSubmit: UseFormHandleSubmit<Inputs>;
  onSubmit: SubmitHandler<Inputs>;
  register: UseFormRegister<Inputs>;
}

export default function ListItemForm({
  onSubmit,
  handleSubmit,
  register,
}: ListItemFormProps) {

  return (
    <Grid2
      container
      component="form"
      noValidate
      autoComplete="off"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* register your input into the hook by invoking the "register" function */}
      <Grid2>
        <TextField
          id="outlined-basic"
          label="Add item"
          variant="outlined"
          {...register("newItem", { required: true })}
        />
      </Grid2>

      <Grid2>
        <Button type="submit" variant="contained" color="secondary">
          Add item
        </Button>
      </Grid2>
    </Grid2>
  );
}
