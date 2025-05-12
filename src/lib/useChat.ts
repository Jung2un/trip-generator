import {useState, useEffect, useRef} from "react";

export type Message = {
    role: "user" | "assistant";
    content: string;
};

export type ChatData = {
    id: string;
    title: string;
    messages: Message[];
};

export function useChat() {
    const [chats, setChats] = useState<ChatData[]>([]); // 전체 채팅 목록
    const [messages, setMessages] = useState<Message[]>([]); // 현재 선택된 채팅 메시지
    const [currentChatId, setCurrentChatId] = useState<string | null>(null); // 현재 활성 채팅 id
    const bottomRef = useRef<HTMLDivElement>(null);

    // 메시지 입력 시
    const handleSend = async (userInput: string) => {
        const userMessage: Message = { role: "user" as const, content: userInput };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput }),
        });

        const data = await res.json();
        const result = data.result || "응답을 생성하지 못했습니다.";
        const updatedMessages = [...newMessages, { role: "assistant" as const, content: result }];
        setMessages(updatedMessages);

        // 채팅방 없을 때 채팅방 생성
        if (!currentChatId) {
            const id = Date.now().toString();
            const newChat: ChatData = {
                id,
                title: userInput,
                messages: updatedMessages,
            };
            const newChats = [newChat, ...chats];
            setChats(newChats);
            setCurrentChatId(id);
            localStorage.setItem("chat-history", JSON.stringify(newChats));
        } else {
            // 현재 대화중인 채팅 목록 상단으로 이동
            const chatToUpdate = chats.find(chat => chat.id === currentChatId);
            if (!chatToUpdate) return;

            const updatedChats = [
                { ...chatToUpdate, messages: updatedMessages },
                ...chats.filter(chat => chat.id !== currentChatId)
            ];
            setChats(updatedChats);
            localStorage.setItem("chat-history", JSON.stringify(updatedChats));
        }
    };

    // 새 채팅 버튼 클릭 시
    const startChat = () => {
        setMessages([]);
        setCurrentChatId(null);
    };

    // 채팅 불러오기
    const loadChat = (id: string) => {
        const found = chats.find((c) => c.id === id);
        if (found) {
            setMessages(found.messages);
            setCurrentChatId(found.id);
        }
    };

    // 채팅 삭제
    const deleteChat = (id: string) => {
        const updated = chats.filter((c) => c.id !== id);
        setChats(updated);
        localStorage.setItem("chat-history", JSON.stringify(updated));
        if (currentChatId === id) {
            setCurrentChatId(null);
            setMessages([]);
        }
    };

    // 페이지 로드 시 채팅 목록 불러오기
    useEffect(() => {
        const saved = localStorage.getItem("chat-history");
        if (saved) {
            setChats(JSON.parse(saved));
        }
    }, []);

    // 채팅 입력 시 현재 채팅으로 스크롤
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return { chats, messages, bottomRef, loadChat, startChat, deleteChat, handleSend };
}
