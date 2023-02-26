import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAddListItemMutation } from "../store/api";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

type Inputs = {
  newTodo: string;
};

export default function ListItemForm() {
  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const [addListItem] = useAddListItemMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    addListItem({ name: data.newTodo, listId: selectedListId });
    reset();
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
