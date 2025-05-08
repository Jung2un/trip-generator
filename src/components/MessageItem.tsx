import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageItem({ role, content }: { role: string; content: string }) {
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`rounded-xl px-4 py-2 max-w-[70%] whitespace-pre-wrap ${
                    isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
            >
                {isUser ? (
                    content
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> // ✅ 마크다운 렌더링
                )}
            </div>
        </div>
    );
}
