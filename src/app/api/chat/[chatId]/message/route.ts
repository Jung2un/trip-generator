import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ chatId: string }> }
) {
    const params = await context.params;
    const chatId = params.chatId;

    try {
        const messages = await prisma.message.findMany({
            where: { chatId: chatId },
            orderBy: { id: "asc" },
        });
        return Response.json(messages);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "서버 에러" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ chatId: string }> }
) {
    const params = await context.params;
    const chatId = params.chatId;

    try {
        const { userInput } = await req.json();

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

        return Response.json({ status: "success" });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "서버 에러" }, { status: 500 });
    }
}