'use client';

import { useChatStore } from '@/store/store';
import { createChat, sendMessage, getChat, getChats, deleteChat } from '@/lib/actions';

export function useChatActions() {
  const {
    currentChatId,
    setCurrentChatId,
    setMessages,
    setChats,
    setLoading,
    setSending,
  } = useChatStore();

  const handleSendMessage = async (userInput: string) => {
    setSending(true);

    try {
      if (!currentChatId) {
        // 새 채팅방 생성
        const newChat = await createChat(userInput);
        if (!newChat) throw new Error('채팅방 생성 실패');

        setCurrentChatId(newChat.id);
        await sendMessage(newChat.id, userInput);

        // 채팅 목록, 메시지 갱신
        const [updatedChats, updatedChat] = await Promise.all([
          getChats(),
          getChat(newChat.id)
        ]);

        setChats(updatedChats);
        if (updatedChat) {
          setMessages(updatedChat.messages);
        }
      } else {
        // 기존 채팅방에 메시지 전송
        await sendMessage(currentChatId, userInput);

        // 현재 채팅 갱신
        const [updatedChats, updatedChat] = await Promise.all([
          getChats(),
          getChat(currentChatId)
        ]);

        setChats(updatedChats);
        if (updatedChat) {
          setMessages(updatedChat.messages);
        }
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleSelectChat = async (id: string) => {
    setLoading(true);

    try {
      const chat = await getChat(id);
      if (chat) {
        setCurrentChatId(chat.id);
        setMessages(chat.messages);
      }
    } catch (error) {
      console.error('채팅 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (id: string) => {
    setLoading(true);

    try {
      await deleteChat(id);
      const updatedChats = await getChats();
      setChats(updatedChats);

      if (currentChatId === id) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('채팅 삭제 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
  };
}