import { RouterProvider } from "react-router";
import { router } from "./routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { VocabularyProvider } from "./contexts/VocabularyContext";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <VocabularyProvider>
        <RouterProvider router={router} />
      </VocabularyProvider>
    </DndProvider>
  );
}
