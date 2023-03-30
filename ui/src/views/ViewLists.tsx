import { api } from "../store/api";
import NewListDialog from "../components/lists/view/NewListDialog";
import { useAuth } from "../hooks/useAuth";
import NewVisitorShoppingLists from "../components/lists/view/NewVisitorLists";
import LoggedInLists from "../components/lists/view/LoggedInLists";

export default function ViewLists() {
  const { data: shoppingLists } = api.useGetAllListsQuery();
  const auth = useAuth();

  return (
    <>
      {auth.user ? <LoggedInLists /> : <NewVisitorShoppingLists />}
      <NewListDialog />
    </>
  );
}
