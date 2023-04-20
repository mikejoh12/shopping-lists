import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { api, useRespondToShareInviteMutation } from "../store/api";
import { MsgSeverity, displaySnackBar } from "../features/uiSlice";

export default function MailBox() {
  const dispatch = useDispatch();

  const { data: lists } = api.useGetAllShareInviteListsQuery();
  const [respondToShareInvite] = useRespondToShareInviteMutation();

  async function handleRespondClick(id: string, isAccepting: boolean) {
    try {
      await respondToShareInvite({ listId: id, isAccepting }).unwrap();
      dispatch(
        displaySnackBar({
          msg: "Share list invite " + isAccepting ? "accepted" : "declined",
          severity: MsgSeverity.Success,
        })
      );
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "An error occured responding to share list invite",
          severity: MsgSeverity.Success,
        })
      );
    }
  }

  return (
    <Box
      sx={{
        minWidth: 120,
        maxWidth: 400,
        margin: "auto",
        pt: 3,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        List Invites
      </Typography>
      {lists && lists.length > 0 ? (
        lists?.map((list, idx) => {
          return (
            <Card key={list.id}>
              <CardContent>
                <Typography>{list.name}</Typography>
                <Typography>Invite by: {list.ownerName}</Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "center", p: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleRespondClick(list.id, true)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleRespondClick(list.id, false)}
                  >
                    Decline
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography>No invites found</Typography>
      )}
    </Box>
  );
}
