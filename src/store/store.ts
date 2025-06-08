import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ChatData = {
  id: string;
  title: string;
  messages: Message[];
};

export type DeleteModalState = {
  isOpen: boolean;
  chatId: string | null;
  chatTitle: string;
};

interface ChatState {
  // 채팅 관련 상태
  chats: ChatData[];
  messages: Message[];
  currentChatId: string | null;

  // 로딩 상태
  isLoading: boolean;
  isSending: boolean;

  // 사이드바 상태
  sidebarOpen: boolean;

  // 모달 상태
  deleteModal: DeleteModalState;

  // Actions
  setChats: (chats: ChatData[]) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentChatId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // 모달 Actions
  openDeleteModal: (chatId: string, chatTitle: string) => void;
  closeDeleteModal: () => void;

  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set) => ({
    // 초기 상태
    chats: [],
    messages: [],
    currentChatId: null,
    isLoading: false,
    isSending: false,
    sidebarOpen: false,

    // 모달 초기 상태
    deleteModal: {
      isOpen: false,
      chatId: null,
      chatTitle: '',
    },

    // Actions
    setChats: (chats) => set({ chats }),
    setMessages: (messages) => set({ messages }),
    setCurrentChatId: (currentChatId) => set({ currentChatId }),
    setLoading: (isLoading) => set({ isLoading }),
    setSending: (isSending) => set({ isSending }),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    openSidebar: () => set({ sidebarOpen: true }),
    closeSidebar: () => set({ sidebarOpen: false }),
    // 모달 Actions
    openDeleteModal: (chatId: string, chatTitle: string) => set({
      deleteModal: {
        isOpen: true,
        chatId,
        chatTitle
      }
    }),
    closeDeleteModal: () => set({
      deleteModal: {
        isOpen: false,
        chatId: null,
        chatTitle: ''
      }
    }),
    reset: () => set({
      chats: [],
      messages: [],
      currentChatId: null,
      isLoading: false,
      isSending: false,
    }),
  }))
);
