'use server';

import prisma from '@/lib/prisma';
import { ChatData } from "@/store/store";
import { revalidatePath } from 'next/cache';
import {travelKeywords} from "@/lib/travelKeywords";

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
  // 여행 관련 키워드 체크
  const isTravelRequest = (input: string): boolean => {
    return travelKeywords.some(keyword =>
      input.toLowerCase().includes(keyword) || input.includes(keyword)
    );
  };

  // 여행 요청인지 확인
  const isTravel = isTravelRequest(userInput);

  // 여행 관련이 아니면 안내 메시지 반환
  if (!isTravel) {
    const guideMessage = "여행에 관한 질문만 도와드릴 수 있어요! 일정, 코스, 맛집 등 여행 관련해서 궁금한 게 있으면 언제든 물어봐주세요 🙋‍♀️️";

    await prisma.message.createMany({
      data: [
        { role: "user", content: userInput, chatId: chatId },
        { role: "assistant", content: guideMessage, chatId: chatId },
      ],
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    revalidatePath('/');
    return true;
  }

  const prompt = `
  **중요 규칙 - 반드시 준수:**
  1. 모든 텍스트는 100% 한국어로만 작성 (영어, 중국어, 한자 절대 금지)
  2. <ul>, <li>, <del> 태그 절대 사용 금지
  3. 목록 작성시 오직 "-" 기호만 사용
  4. ** 사용 시 **로 닫아주기
  5. 마크다운 헤더는 "###" + 이모지 + 제목 형식만 사용
  
  **출력 형식 예시:**
  ### 🗺️ 추천 코스
  - 첫째 날: 장소명 (시간)
  - 둘째 날: 장소명 (시간)
  
  ### 🍽️ 먹거리
  - 음식명: 맛집명
  
  ### 💡 특징과 팁
  - 팁 내용

  너는 여행 전문가야. 아래 단계에 따라 단계별 reasoning을 진행해:
  - 먼저 목적지와 여행 기간을 분석해 여행의 전체적인 흐름을 생각해본다. (사용자가 입력한 날짜 기준으로, 입력한 날짜가 없으면 최소 3일)
  - 각 날의 목적과 이동 동선, 시간대별 일정을 구상한다.
  - 추천 코스를 시간 순서대로 최소 3개 장소 이상으로 작성한다.
  - 여행 지역의 대표 먹거리와 맛집을 조사하고, 지역별 음식 추천을 추가한다.
  - 여행의 특징과 Tip을 간단하고 명확하게 작성한다.
  
  필수 포함 사항:
  1. 추천 코스 (시간 순서대로, 최소 3개 장소 포함)
  2. 먹거리 (지역 대표 음식과 맛집)
  3. 특징 / Tip (내용만 간단하고 명확하게 작성할 것)
  
  사용자 요청: ${userInput}
  
  **다시 한번 강조: 한국어만 사용해**
  `;
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
            content: `너는 한국 여행 전문가야. 
            
            **절대 규칙:**
            - 모든 응답은 100% 한국어로만 작성
            - HTML 태그 사용 절대 금지 
            - 목록은 오직 "-" 기호만 사용
            - 영어, 중국어, 한자 사용 금지
            
            응답 형식은 마크다운 헤더(### 이모지 제목)와 대시 목록(-)만 사용해.`
          },
          {
            role: "user",
            content: prompt
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await aiResponse.json();

    const assistantMessage = data?.choices?.[0]?.message?.content
      ?.replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/#region\d*/g, "")
      .replace(/<li[^>]*>(.*?)<\/li>/g, "- $1")
      .replace(/<ul[^>]*>|<\/ul>/g, "")
      .replace(/\n\s*\n/g, "\n")
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
