import { createBrowserRouter } from "react-router-dom";
// import RootLayout from "../layouts/RootLayout";
import Error from "../error/Error";
import Links from "../components/Links";
import Profile from "../components/Profile";
import SignUp from "../components/auth/SignUp";
import SignIn from "../components/auth/SignIn";
import PreviewLayout from "../layouts/PreviewLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import RootLayout from "../layouts/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "/",
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <Links />,
          },
          {
            path: "/links",
            element: <Links />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "/user/:userId",
        element: <PreviewLayout />,
      },
    ],
  },
]);

export default router;
