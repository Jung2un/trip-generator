"use client";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { useEffect, useState, useRef } from "react";

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

export default function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSend = async (userInput: string) => {
        const newMessages: Message[] = [...messages, { role: "user", content: userInput }];
        setMessages(newMessages);

        const res = await fetch('/api/generate-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInput }),
        });

        const data = await res.json();
        const result = data.result || "응답을 생성하지 못했습니다.";

        setMessages((prev) => [...prev, { role: "assistant", content: result }]);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto mb-4 scrollbar-hide">
                <MessageList messages={messages}/>
                <div ref={bottomRef}/>
            </div>
            <ChatInput onSend={handleSend}/>
        </div>

    );
}