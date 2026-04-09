import { useRef, useState } from "react";

type Props = {
  suggestions: string[];
};

const Suggestions = ({ suggestions }: Props) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopiedIndex(null);
      timeoutRef.current = null;
    }, 1500);
  };

  return (
    <div className="bg-[#1b222c] p-2 mb-2">
      <div className="font-bold text-sm mb-1">Resume bullets</div>
      {suggestions.map((s, i) => (
        <div key={`${s}-${i}`} className="text-sm mb-2">
          <div className="mb-1">- {s}</div>
          <button
            className="text-xs bg-[#334155] text-white px-2 py-1"
            onClick={() => handleCopy(s, i)}
          >
            {copiedIndex === i ? "copied" : "copy"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
