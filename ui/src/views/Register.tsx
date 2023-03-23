import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { useAddUserMutation } from "../store/api";
import { useDispatch } from "react-redux";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";
import { useNavigate } from "react-router-dom";

type Inputs = {
  username: string;
  password: string;
  passwordConfirm: string;
};

export default function Register() {
  const [addUser] = useAddUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const password = React.useRef({});
  password.current = watch("password");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await addUser({
        username: data.username,
        password: data.password,
      }).unwrap();
      dispatch(
        displaySnackBar({
          msg: "User account created: " + data.username,
          severity: MsgSeverity.Success,
        })
      );
      navigate("/login");
    } catch (err: any) {
      console.log(err);
      dispatch(
        displaySnackBar({
          msg: err.data?.message
            ? err.data.message
            : "Error registering new user",
          severity: MsgSeverity.Error,
        })
      );
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        Register
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
        {/* register your input into the hook by invoking the "register" function */}
        <Grid2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            {...register("username", { required: true })}
          />
        </Grid2>
        <Grid2>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Password"
                variant="filled"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                type="password"
              />
            )}
            rules={{
              required: "Password required",
              minLength: {
                value: 6,
                message: "Password needs to be minimum 6 characters.",
              },
            }}
          />
        </Grid2>
        <Grid2>
          <Controller
            name="passwordConfirm"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Confirm Password"
                variant="filled"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                type="password"
              />
            )}
            rules={{
              required: "Password required",
              minLength: {
                value: 6,
                message: "Password needs to be minimum 6 characters.",
              },
              validate: (value) =>
                value === password.current || "The passwords do not match",
            }}
          />
        </Grid2>

        <Grid2>
          <Button type="submit" variant="contained">
            Create Account
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
}
