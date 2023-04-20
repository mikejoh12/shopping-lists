import { useSelector } from "react-redux";
import { selectLists } from "../../../features/listsSlice";
import ShowAllLists from "./ShowAllLists";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import groceriesImg from "../../../images/raul-gonzalez-escobar-ZpIskW1Tuvc-unsplash.jpg";
import Grid from "@mui/material/Grid";

export default function NewVisitorLists() {
  const shoppingLists = useSelector(selectLists);

  return (
    <>
      <Grid container
      direction="column"
      alignItems="center"
        sx={{
          width: "100%",
          p: 2,
          backgroundImage: `url(${groceriesImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Card sx={{ minWidth: 300, maxWidth: 600, m: 3}}>
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
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create an account for increased functionality and to synchronize your lists between different devices." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Share your lists with others users such as family or team-members." />
                </ListItem>
              </List>
            </CardContent>
          </Paper>
        </Card>
      </Grid>
      <Box>
        <ShowAllLists lists={shoppingLists} />
      </Box>
    </>
  );
}
