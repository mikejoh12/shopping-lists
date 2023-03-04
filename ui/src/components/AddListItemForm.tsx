import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAddListItemMutation } from "../store/api";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";

type Inputs = {
  newItem: string;
};

export default function ListItemForm() {
  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const [addListItem] = useAddListItemMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    addListItem({ name: data.newItem, listId: selectedListId });
    reset();
    dispatch(
      displaySnackBar({
        msg: "Item added: " + data.newItem,
        severity: MsgSeverity.Success,
      })
    );
  };

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
