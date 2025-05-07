import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userInput } = await req.json();

        const response = await fetch("https://api-inference.huggingface.co/models/beomi/llama-2-koen-13b", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: userInput }),
        });

        const data = await response.json();

        console.log("" +
            "HuggingFace 응답 데이터:", data);

        const reply = Array.isArray(data) && data[0]?.generated_text
            ? data[0].generated_text
            : '응답을 생성하지 못했습니다.';

        return new Response(JSON.stringify({ reply }), { status: 200 });
    } catch (error) {
        console.error('HuggingFace API 에러:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
