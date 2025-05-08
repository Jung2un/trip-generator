import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userInput } = await req.json();

        const body = {
            model: "qwen-qwq-32b",
            messages: [
                {
                    role: "system",
                    content: "넌 반드시 한국어로만 대답하는 여행 안내 AI야. reasoning 하지 말고 바로 결과만 한국어로 출력해.",
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
