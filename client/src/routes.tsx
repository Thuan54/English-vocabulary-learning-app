import { createBrowserRouter } from "react-router";
import { Review } from "./pages/Review";
import { VocabularyPage } from "./pages/VocabularyPage";
import { LearnedWordsPage } from "./pages/LearnedWordsPage"; 
import { Dashboard } from "./pages/Dashboard";
import { VocabularySearch } from "./pages/VocabularySearch";
import { RelatedWordsPage } from "./pages/RelatedWord";

import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "review", Component: Review },
      { path: "learned", Component: LearnedWordsPage }, 
      { path: "search", Component: VocabularySearch },
      { path: "relate", Component: RelatedWordsPage },
      
    ],
  },
]);
