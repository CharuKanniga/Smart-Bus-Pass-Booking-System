import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { OperatorDashboard } from "./components/OperatorDashboard";
import { ApplyPass } from "./components/ApplyPass";
import { MyPasses } from "./components/MyPasses";
import { LiveTracking } from "./components/LiveTracking";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/user",
    Component: UserDashboard,
  },
  {
    path: "/user/apply",
    Component: ApplyPass,
  },
  {
    path: "/user/passes",
    Component: MyPasses,
  },
  {
    path: "/user/tracking",
    Component: LiveTracking,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/operator",
    Component: OperatorDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
