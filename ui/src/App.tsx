import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import { HeaderLayout } from "./components/Header";
import Register from "./views/Register";
import { RequireAuth } from "./components/RequireAuth";
import ShoppingLists from "./views/ShoppingLists";
import Account from "./views/Account";
import UploadLists from "./views/UploadLists";

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <ShoppingLists />,
      },
      {
        path: "/account",
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/upload-lists",
        element: (
          <RequireAuth>
            <UploadLists />
          </RequireAuth>
        ),
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
