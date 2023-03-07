import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import Lists from "./views/LoggedInShoppingLists";
import { HeaderLayout } from "./components/Header";
import Register from "./views/Register";
import Landing from "./views/Landing";
import { RequireAuth } from "./components/RequireAuth";

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/lists",
        element: (
          <RequireAuth>
            <Lists />
          </RequireAuth>
        ),
      },
      {
        path: "/login",
        element: <Login />,
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
