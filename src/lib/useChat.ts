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

    // 전체 채팅 불러오기
    const fetchChats = async () => {
        try {
            const res = await fetch("/api/chat");
            const data = await res.json();
            setChats(data);
        } catch (err) {
            console.error("채팅 목록 로딩 실패", err);
        }
    };

    // 메시지 보내기 handler
    const handleSend = async (userInput: string) => {
        if (!currentChatId) {
            // 새 채팅방 생성
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: userInput }),
            });
            const newChat = await res.json();
            if (!newChat.id) throw new Error("채팅방 생성 실패");
            setCurrentChatId(newChat.id);

            // 새 채팅방 생성 후 메시지 전송
            await sendMessage(newChat.id, userInput);
            await fetchChats();
            await loadChat(newChat.id)
        } else {
            // 기존 채팅방에 메시지 전송
            await sendMessage(currentChatId, userInput);
            await fetchChats();
            await loadChat(currentChatId); // 현재 채팅 갱신
        }
    };

    // 메시지 보내기 API call
    const sendMessage = async (id: string, userInput: string) => {
        await fetch(`/api/chat/${id}/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput }),
        });
    };

    // 새 채팅 버튼 클릭 시
    const startChat = () => {
        setMessages([]);
        setCurrentChatId(null);
    };

    // 채팅방 불러오기
    const loadChat = async (id: string | undefined) => {
        if (!id) {
            console.warn("id undefined");
            setMessages([]);
            setCurrentChatId(null);
            return;
        }
        try {
            const res = await fetch(`/api/chat/${id}`);
            if (!res.ok) throw new Error("채팅방 불러오기 실패");
            const chat = await res.json();
            if (chat && chat.messages) {
                setMessages(chat.messages);
                setCurrentChatId(chat.id);
            } else {
                console.warn("loadChat 호출 성공");
                setMessages([]);
                setCurrentChatId(chat.id);
            }
        } catch (error) {
            console.error("loadChat 에러:", error);
            setMessages([]);
        }
    };

    // 채팅방 삭제
    const deleteChat = async (id: string) => {
        await fetch(`/api/chat/${id}`, { method: "DELETE" });
        await fetchChats();
        if (currentChatId === id) {
            setCurrentChatId(null);
            setMessages([]);
        }
    };

    // 페이지 로드 시 채팅 목록 불러오기
    useEffect(() => {
        fetchChats();
    }, []);

    // 채팅 입력 시 현재 채팅으로 스크롤
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return { chats, messages, bottomRef, loadChat, startChat, deleteChat, handleSend };
}
