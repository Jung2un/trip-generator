'use client';

import { useEffect } from 'react';
import ChatBox from '@/components/ChatBox';
import Sidebar from '@/components/Sidebar';
import { useChatStore } from '@/store/store';
import { ChatData } from '@/store/store';

interface ClientPageProps {
  initialChats: ChatData[];
}

export function ClientPage({ initialChats }: ClientPageProps) {
  const { sidebarOpen, setChats, chats } = useChatStore();

  // 서버에서 받은 초기 데이터로 초기화
  useEffect(() => {
    setChats(initialChats);
  }, [initialChats, setChats, chats.length]);

  return (
    <>
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-56" : "ml-0"
        } flex justify-center items-center min-h-[calc(100vh-4rem)] z-[1]`}
      >
        <div className="w-full flex flex-col h-[calc(100vh-6rem)]">
          <div className="flex-grow flex flex-col max-h-[calc(100%)]">
            <ChatBox />
          </div>
        </div>
      </div>
    </>
  );
}