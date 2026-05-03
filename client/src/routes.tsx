<<<<<<< HEAD
import VocabularyPage from "./pages/VocabularyPage";

const routes = [
    {
        path: "/vocabulary",
        element: <VocabularyPage />,
    },
];

export default routes;
=======
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
>>>>>>> cf0b1a83ec975660fb64f883db169dfc26d281c8
