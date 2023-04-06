import NewListDialog from "../components/lists/view/NewListDialog";
import { useAuth } from "../hooks/useAuth";
import NewVisitorShoppingLists from "../components/lists/view/NewVisitorLists";
import LoggedInLists from "../components/lists/view/LoggedInLists";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function ViewLists() {
  const auth = useAuth();

  return (
    <Grid container direction="column" alignContent="center" sx={{ p: 2 }}>
      <Card sx={{ minWidth: 300, maxWidth: 600, m: 1 }}>
        <Paper>
          <CardContent>
            <Typography variant="h5" textAlign="center">
              The easy way to manage your shopping lists
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Start managing your shopping lists without creating an account." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Create an account for increased functionality and to synchronize your lists between different devices." />
              </ListItem>
            </List>
          </CardContent>
        </Paper>
      </Card>
      {auth.user ? <LoggedInLists /> : <NewVisitorShoppingLists />}
      <NewListDialog />
    </Grid>
  );
}
