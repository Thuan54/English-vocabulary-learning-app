import { Upload, RefreshCcw, Search, Loader2 } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';

interface Props {
  numPages: number | null;
  fileName: string;
  pdfError: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isScanMode?: boolean;
  isScanning?: boolean;
  onScanToggle?: () => void;
}

export function PdfUploader({ numPages, fileName, pdfError, fileInputRef, onFileChange, onClear, isScanMode, isScanning, onScanToggle }: Props) {
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
          
          {/* Scan Patterns Toggle */}
          {onScanToggle && (
            <button
              type="button"
              onClick={onScanToggle}
              disabled={isScanning}
              className={`ml-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isScanMode
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 border border-transparent'
              } ${isScanning ? 'opacity-60 cursor-wait' : ''}`}
            >
              {isScanning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              {isScanning ? 'Scanning...' : isScanMode ? 'Patterns ON' : 'Scan Patterns'}
            </button>
          )}
          
          <button type="button" onClick={onClear} className="text-xs text-gray-500 hover:text-red-500 transition ml-auto">
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </>
      )}
      {pdfError && <span className="text-xs text-red-600 ml-2">{pdfError}</span>}
    </div>
  );
}