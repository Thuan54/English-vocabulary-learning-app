import { createBrowserRouter } from "react-router";
import { Review } from "./pages/Review";
import { LearnedWordsPage } from "./pages/LearnedWordsPage"; 

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "review", Component: Review },
      { path: "learned", Component: LearnedWordsPage }, 
    ],
  },
]);
