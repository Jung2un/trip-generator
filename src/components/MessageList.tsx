import MessageItem from "./MessageItem";

export default function MessageList({ messages }: { messages: { role: string; content: string }[] }) {
  return (
    <div className="flex-1 flex flex-col px-2 overflow-y-auto scrollbar-hide">
      <div className="max-w-3xl w-full mx-auto flex flex-col space-y-3">
        {messages.map((msg, i) => (
          <MessageItem key={i} role={msg.role} content={msg.content} />
        ))}
      </div>
    </div>

  );
}
