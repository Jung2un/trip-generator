"use client";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { useEffect, useState, useRef } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSend = async (userInput: string) => {
        const newMessages = [...messages, { role: "user", content: userInput }];
        setMessages(newMessages);

        // const res = await fetch("/api/generate-itinerary", {
        //     method: "POST",
        //     body: JSON.stringify({ userInput }),
        // });
        // const data = await res.json();
        //
        // setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
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