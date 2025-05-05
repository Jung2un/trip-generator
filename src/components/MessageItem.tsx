export default function MessageItem({ role, content }: { role: string; content: string }) {
    const isUser = role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-xl px-4 py-2 max-w-[70%] ${isUser ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                {content}
            </div>
        </div>
    );
}
