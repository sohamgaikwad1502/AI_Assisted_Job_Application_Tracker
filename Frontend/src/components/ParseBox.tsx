import { useState } from "react";

type Props = {
  onParse: (text: string) => void;
  loading: boolean;
  error: string;
};

const ParseBox = ({ onParse, loading, error }: Props) => {
  const [text, setText] = useState("");

  return (
    <div className="bg-[#1b222c] p-2 mb-3">
      <div className="text-sm font-bold mb-1">Paste job description</div>
      <textarea
        className="w-full border p-2"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="paste JD here..."
      />
      <button
        className="mt-2 bg-[#1d4ed8] text-white px-2 py-1"
        onClick={() => onParse(text)}
        disabled={loading || text.trim().length < 10}
      >
        {loading ? "parsing..." : "Parse with AI"}
      </button>
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </div>
  );
};

export default ParseBox;
