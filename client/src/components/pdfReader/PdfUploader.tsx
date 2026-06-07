import { Upload, RefreshCcw } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';

interface Props {
  numPages: number | null;
  fileName: string;
  pdfError: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function PdfUploader({ numPages, fileName, pdfError, fileInputRef, onFileChange, onClear }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
      {!numPages ? (
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white font-medium hover:bg-gray-800 transition">
          <Upload className="w-4 h-4" />
          Open PDF
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={onFileChange} hidden />
        </label>
      ) : (
        <>
          <span className="text-sm text-gray-600 truncate max-w-[200px]">{fileName}</span>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:underline">Replace</button>
          <button type="button" onClick={onClear} className="text-xs text-gray-500 hover:text-red-500 transition ml-auto">
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </>
      )}
      {pdfError && <span className="text-xs text-red-600 ml-2">{pdfError}</span>}
    </div>
  );
}