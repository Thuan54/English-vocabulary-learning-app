export interface PdfHighlight {
  id: string;
  pageNumber: number;
  rects: Array<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>;
  text: string;
}

export interface SelectionPosition {
  top: number;
  left: number;
}

export interface PdfViewerProps {
  onExplainRequest?: (text: string, pageNumber?: number) => Promise<void>;
  onContextSet?: (text: string, pageNumber?: number) => void;
}

export interface PdfPageProps {
  pageNumber: number;
  scale: number;
  highlights: PdfHighlight[];
  onRemoveHighlight: (id: string) => void;
}

export interface SelectionToolbarProps {
  selectedText: string;
  pageNumber: number | null;
  position: SelectionPosition;
  isAlreadySaved: boolean;
  isSingleWord: boolean;
  onAskAI: () => void;
  onSetContext: () => void;
  onHighlight: () => void;
  onAddToVocab: () => void;
  hasContextHandler: boolean;
}