import { createBrowserRouter } from "react-router";
import { Review } from "./pages/Review";
import { Dashboard } from "./pages/Dashboard";
import { VocabularySearch } from "./pages/VocabularySearch";
import { RelatedWordsPage } from "./pages/VocabularyMananger";
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
