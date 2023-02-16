import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAddTodoMutation } from "../store/todos";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Inputs = {
  newTodo: string;
};

export default function AddTodoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [addTodo] = useAddTodoMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    addTodo({ name: data.newTodo });
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
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
          label="New todo"
          variant="outlined"
          {...register("newTodo", { required: true })}
        />
      </Grid2>

      <Grid2>
        <Button type="submit" variant="contained">
          Add todo
        </Button>
      </Grid2>
    </Grid2>
  );
}
