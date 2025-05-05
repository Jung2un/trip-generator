"use client";
import { useState } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export default function ChatBox() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

    const handleSend = async (userInput: string) => {
        const newMessages = [...messages, { role: "user", content: userInput }];
        setMessages(newMessages);

        const res = await fetch("/api/generate-itinerary", {
            method: "POST",
            body: JSON.stringify({ userInput }),
        });
        const data = await res.json();

        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    };

    return (
        <>
            <MessageList messages={messages} />
            <ChatInput onSend={handleSend} />
        </>
    );
}
