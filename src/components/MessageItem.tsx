import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageItem({ role, content }: { role: string; content: string }) {
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`rounded-2xl px-4 py-2 max-w-[85%] whitespace-pre-wrap shadow-md ring-1 ring-zinc-200 dark:ring-zinc-700 bg-gradient-to-br ${
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
        </div>
    );
}
