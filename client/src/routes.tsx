import { createBrowserRouter } from "react-router";
import { Review } from "./pages/review";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "review", Component: Review },
    ],
  },
]);
