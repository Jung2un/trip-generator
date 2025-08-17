"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/store";
import { useChatActions } from "@/hook/useChatActions";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "./LoadingSpinner";

export default function Sidebar() {
  const { chats, sidebarOpen, isLoading, closeSidebar, openDeleteModal } = useChatStore();

  const { handleNewChat, handleSelectChat } = useChatActions();
  const [isMobile, setIsMobile] = useState(false);

  const handleDeleteClick = (chatId: string, chatTitle: string) => {
    openDeleteModal(chatId, chatTitle);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 565;
      setIsMobile(mobile);

      if (window.innerWidth < 855) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [closeSidebar]);

  // 모바일에서 사이드바 열릴 때 배경 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSidebar();
    }
  };

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-gray-50 dark:bg-zinc-800 z-[9999] transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${"w-[90vw] max-w-[400px] min-[565px]:w-56"}`}
      >
        <button className="flex items-center justify-between p-4" onClick={closeSidebar}>
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl text-gray-700 dark:text-gray-100"
          />
        </button>

        <div className="p-4 space-y-2 overflow-y-auto">
          <div className="pb-5 border-b border-zinc-200 dark:border-zinc-700">
            <button
              onClick={handleNewChat}
              disabled={isLoading}
              className="w-full flex items-center gap-2 justify-center text-sm py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:text-black dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              새 채팅
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-5">
              <LoadingSpinner size="md" />
            </div>
          ) : chats.length === 0 ? (
            <p className="text-sm text-center py-5 text-zinc-400 dark:text-zinc-500">저장된 채팅이 없습니다.</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className="w-full flex justify-between items-center bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-2 py-3 rounded"
              >
                <button
                  onClick={() => handleSelectChat(chat.id)}
                  className="text-left text-sm text-black dark:text-white truncate"
                >
                  {chat.title.length > 12
                    ? `${chat.title.slice(0, 12)}`
                    : chat.title}
                </button>
                <button onClick={() => handleDeleteClick(chat.id, chat.title)} className="text-xs text-red-400 hover:text-red-500 ml-2">삭제</button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
