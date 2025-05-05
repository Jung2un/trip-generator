import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (input: string) => void }) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="5월 제주도 3박 4일 일정 추천해줘"
                className="flex-1 border rounded-lg px-3 py-2"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">전송</button>
        </form>
    );
}
