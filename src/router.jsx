import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./Root/Rootlayout";
import Home from "./Home";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "home/:id",
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
]);