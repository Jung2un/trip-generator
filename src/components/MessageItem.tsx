import { useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import {FiCheck, FiCopy} from "react-icons/fi";

export default function MessageItem({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) return;
    setCopied(true);

    const cleanedText = content
      .replace(/\*\*/g, "")   // bold (**)
      .replace(/---/g, "")    // 구분선 (---)
      .replace(/###/g, "")    // 제목 (###)
      .replace(/##/g, "");    // 제목 (##)

    await navigator.clipboard.writeText(cleanedText);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`px-4 py-2 flex items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser && hovered && (
        <button
          onClick={handleCopy}
          className="sticky top-2 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-md px-2 py-2 text-xs shadow hover:bg-gray-100 dark:hover:bg-zinc-700 self-start flex items-center mt-1"
        >
          {copied ? (
            <>
              <FiCheck className="inline w-3 h-3" />
            </>
          ) : (
            <>
              <FiCopy className="inline w-3 h-3" />
            </>
          )}
        </button>
      )}
      <div
        className={`relative rounded-2xl px-4 py-2 max-w-[85%] whitespace-pre-wrap shadow-md ring-1 ring-zinc-200 dark:ring-zinc-700 bg-gradient-to-br ${
          isUser
            ? "from-blue-500 to-blue-600 text-white self-end"
            : "from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 text-black dark:text-white self-start"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h3: (props) => (
                <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-300 tracking-tight" {...props} />
              ),
              p: (props) => (
                <p className="leading-relaxed text-sm text-gray-800 dark:text-gray-200" {...props} />
              ),
              ul: (props) => (
                <ul className="list-disc list-inside" {...props} />
              ),
              li: (props) => (
                <li className="text-sm leading-snug" {...props} />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {!isUser && hovered && (
        <button
          onClick={handleCopy}
          className="sticky top-2 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-md px-2 py-1 text-xs shadow hover:bg-gray-100 dark:hover:bg-zinc-700 self-start flex items-center gap-x-1"
        >
          {copied ? (
            <>
              <FiCheck className="inline w-3 h-3" />
              복사됨
            </>
          ) : (
            <>
              <FiCopy className="inline w-3 h-3" />
              복사
            </>
          )}
        </button>
      )}
    </div>
  );
}

