import { api } from "../../../store/api";
import ShowAllLists from "./ShowAllLists";

export default function LoggedInLists() {
  const { data: shoppingLists } = api.useGetAllListsQuery();

  return <ShowAllLists lists={shoppingLists} />;
}
