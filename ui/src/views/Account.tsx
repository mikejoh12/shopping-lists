import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Account() {
  const selectedUser = useSelector((state: RootState) => state.user.name);

  return (
    <Box sx={{p: 3}}>
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        User Account
      </Typography>
      <Typography
        variant="h5"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        User Name: {selectedUser}
      </Typography>
    </Box>
  );
}
