import MessageItem from "./MessageItem";

export default function MessageList({ messages }: { messages: { role: string; content: string }[] }) {
    return (
        <div className="h-96 overflow-y-auto mb-4 space-y-3 px-2">
            {messages.map((msg, i) => (
                <MessageItem key={i} role={msg.role} content={msg.content} />
            ))}
        </div>
    );
}
