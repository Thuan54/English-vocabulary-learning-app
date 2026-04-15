import { createBrowserRouter } from "react-router";
import { Review } from "./pages/Review";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "review", Component: Review },
    ],
  },
]);
