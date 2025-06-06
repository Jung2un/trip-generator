'use server';

import prisma from '@/lib/prisma';
import { ChatData } from "@/store/store";
import { revalidatePath } from 'next/cache';

// 모든 채팅방 목록 (전체 조회)
export async function getChats(): Promise<ChatData[]> {
  try {
    const chats = await prisma.chat.findMany({
      include: { messages: true },
      orderBy: { updatedAt: 'desc' },
    });
    return chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      messages: chat.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    }));

  } catch (error) {
    console.error('전체 채팅 조회 에러:', error);
    return [];
  }
}

// 특정 채팅방 가져오기 (상세 조회)
export async function getChat(id: string): Promise<ChatData | null> {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { messages: true },
    });
    if (!chat) return null;

    return {
      id: chat.id,
      title: chat.title,
      messages: chat.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    };
  } catch (error) {
    console.error('특정 채팅 조회 에러:', error);
    return null;
  }
}

export async function createChat(title: string): Promise<ChatData | null> {
  try {
    const chat = await prisma.chat.create({
      data: { title },
      include: { messages: true },
    });
    revalidatePath('/');

    return {
      id: chat.id,
      title: chat.title,
      messages: chat.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    };
  } catch (error) {
    console.error('채팅 생성 에러:', error);
    return null;
  }
}

export async function sendMessage(chatId: string, userInput: string): Promise<boolean> {
  try {
    // AI 호출 + 프롬프트 설정
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-qwq-32b",
        messages: [
          {
            role: "system",
            content: `
              너는 여행 전문 AI야. 모든 단어는 반드시 한국어로만 작성하고, 영어, 한자, 중국어는 절대 사용하지마.
              다음 항목을 반드시 포함해줘
              1. 추천 코스 (시간 순서대로, 최소 3개 장소 포함)
              2. 먹거리 (지역 대표 음식과 맛집)
              3. 특징 / Tip (내용만 간단하고 명확하게 작성할 것)
            `.trim()
          },
          { role: "user", content: userInput },
        ],
      }),
    });

    const data = await aiResponse.json();

    const assistantMessage = data?.choices?.[0]?.message?.content
      ?.replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/#region\d*/g, "")
      .trim() || "응답을 생성하지 못했습니다.";

    await prisma.message.createMany({
      data: [
        { role: "user", content: userInput, chatId: chatId },
        { role: "assistant", content: assistantMessage, chatId: chatId },
      ],
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('메세지(DB) 저장 에러:', error);
    return false;
  }
}

export async function deleteChat(id: string): Promise<boolean> {
  try {
    await prisma.chat.delete({
      where: { id },
    });
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('채팅 삭제 에러 error:', error);
    return false;
  }
}
