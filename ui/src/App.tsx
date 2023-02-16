import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import Todos from "./views/Todos";
import { HeaderLayout } from "./components/Header";
import Register from "./views/Register";

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <Todos />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      }
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
