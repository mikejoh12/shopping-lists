import NewListDialog from "../components/lists/view/NewListDialog";
import { useAuth } from "../hooks/useAuth";
import NewVisitorShoppingLists from "../components/lists/view/NewVisitorLists";
import LoggedInLists from "../components/lists/view/LoggedInLists";
import Grid from "@mui/material/Grid";

export default function ViewLists() {
  const auth = useAuth();

  return (
    <Grid
      container
      direction="column"
      alignContent="center"
      sx={{pb: 2}}
    >
      {auth.user.name ? <LoggedInLists /> : <NewVisitorShoppingLists />}
      <NewListDialog />
    </Grid>
  );
}
