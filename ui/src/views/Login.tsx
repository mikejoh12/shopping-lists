import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import { useLoginUserMutation } from "../store/api";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";
import { selectLists } from "../features/listsSlice";
import { LinearProgress } from "@mui/material";

type Inputs = {
  username: string;
  password: string;
};

export default function Login() {
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = React.useState<Boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newVisitorLists = useSelector(selectLists);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const user = await loginUser(data).unwrap();
      dispatch(setCredentials(user));
      reset();
      navigate("/");
      dispatch(
        displaySnackBar({
          msg: "Login successful",
          severity: MsgSeverity.Success,
        })
      );
      navigate(newVisitorLists.length > 0 ? "/upload-lists" : "/");
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "Incorrect username or password",
          severity: MsgSeverity.Error,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        Login
      </Typography>
      <Grid2
        container
        component="form"
        noValidate
        autoComplete="off"
        alignItems="center"
        direction="column"
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid2>
          <TextField
            id="username"
            label="Email"
            variant="outlined"
            {...register("username", { required: true })}
          />
        </Grid2>
        <Grid2>
          <TextField
            id="password"
            type="password"
            label="Password"
            variant="outlined"
            {...register("password", { required: true })}
          />
        </Grid2>

        <Grid2>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Grid2>
      </Grid2>
      {loading && (
        <Box sx={{ width: "75%", pt: 5, margin: "auto" }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
}
