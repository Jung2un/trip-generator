import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userInput } = await req.json();

        const body = {
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
                        
                        괄호는 설명용이며 결과에 절대 출력하지마. 항목은 번호 또는 리스트(-)로 정리해.
                    `.trim()

                },
                {
                    role: "user",
                    content: userInput
                }
            ]
        };

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API 응답 실패:", data);
            return new Response(JSON.stringify({ error: "Groq API 실패" }), { status: 500 });
        }

        const modify = data?.choices?.[0]?.message?.content || "";

        const result = modify
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            .replace(/#region\d*/g, "")
            .trim();

        return new Response(JSON.stringify({ result }), { status: 200 });

    } catch (err) {
        console.error("서버 에러:", err);
        return new Response(JSON.stringify({ error: "서버 에러" }), { status: 500 });
    }
}
