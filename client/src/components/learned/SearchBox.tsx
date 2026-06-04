import { useRef } from "react";

type Props = {
  setValue: (v: string) => void;
  placeholder?: string;
};

export function SearchBox({ setValue, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <div className="relative mb-8">
      <input type="text" ref={inputRef} placeholder={placeholder} 
        onKeyDown={(e) => {
          if(e.key === 'Enter'){
            setValue(inputRef.current.value)
          }
        }}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-white" />
      <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={() => setValue(inputRef.current.value)}>
        Search
      </button>
    </div>
  );
}

export default SearchBox;
