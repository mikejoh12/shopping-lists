import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";

type Inputs = {
  username: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  return (
    <Box>
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
          <TextField
            id="password"
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
    </Box>
  );
}
