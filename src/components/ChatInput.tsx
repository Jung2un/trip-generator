import { useRef, useState } from "react";

export default function ChatInput({ onSend }: { onSend: (input: string) => void }) {
    const [text, setText] = useState("");
    const pRef = useRef<HTMLParagraphElement>(null);

    const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
        e?.preventDefault();
        if (!text.trim()) return;

        onSend(text);
        setText("");

        if (pRef.current) {
            pRef.current.textContent = "";
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex px-3 gap-2 w-full">
            <p
                ref={pRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setText(e.currentTarget.textContent ?? "")}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        handleSubmit(e);
                    }
                }}
                data-placeholder="어디로 여행하고 싶으신가요?"
                className={`relative w-full min-h-[40px] border rounded-lg px-3 py-2 outline-none whitespace-pre-wrap dark:border-zinc-600 before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:pointer-events-none ${
                    text ? "before:content-none" : ""
                }`}
            />
            <input type="hidden" name="message" value={text} />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-400 dark:hover:bg-blue-500 dark:text-black font-bold px-4 py-2 rounded-3xl transition-colors duration-300"
            >
                ↑
            </button>
        </form>
    );
}
