import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import CreateApplication from "../pages/CreateApplication";
import EditApplication from "../pages/EditApplication";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        
        element: <ProtectedRoutes />,
        children:[
          {path: "/", element:<Dashboard/>},
          {path: "/applications/new", element:<CreateApplication/>},
          {path:"/applications/:id", element:<EditApplication/>}
        ],
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

export default router;
