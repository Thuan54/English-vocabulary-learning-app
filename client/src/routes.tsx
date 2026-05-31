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
import { Dashboard } from "./pages/Dashboard";
import { VocabularySearch } from "./pages/VocabularySearch";
import { RelatedWordsPage } from "./pages/RelatedWord";
import { StudySessionPage } from "./pages/StudySessionPage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "review", Component: Review },
      { path: "search", Component: VocabularySearch },
      { path: "relate", Component: RelatedWordsPage },
      { path: "study", Component: StudySessionPage },
    ],
  },
]);
>>>>>>> cf0b1a83ec975660fb64f883db169dfc26d281c8
