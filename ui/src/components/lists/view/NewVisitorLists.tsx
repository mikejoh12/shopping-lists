import { useSelector } from "react-redux";
import { selectLists } from "../../../features/listsSlice";
import ShowAllLists from "./ShowAllLists";

export default function NewVisitorLists() {
  const shoppingLists = useSelector(selectLists);

  return <ShowAllLists lists={shoppingLists} />;
}
