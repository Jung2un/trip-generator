"use client";

import ChatBox from "@/components/ChatBox";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";
import { useChat } from "@/lib/useChat";

export default function Home() {
    const { isOpen } = useSidebar();
    const {
        chats,
        messages,
        bottomRef,
        loadChat,
        startChat,
        deleteChat,
        handleSend
    } = useChat();

    return (
        <>
            <Sidebar chats={chats} onSelect={loadChat} onDelete={deleteChat} onNewChat={startChat} />
            <div
                className={`transition-all duration-300 ${
                    isOpen ? "ml-64" : "ml-0"
                } flex justify-center items-center min-h-[calc(100vh-4rem)]`}
            >
                <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-6rem)]">
                    <div className="flex-grow flex flex-col max-h-[calc(100%)]">
                        <ChatBox messages={messages} onSend={handleSend} bottomRef={bottomRef} />
                    </div>
                </div>
            </div>
        </>
    );
}
