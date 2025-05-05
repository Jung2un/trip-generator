import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { userInput } = await req.json();

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: userInput }],
        }),
    });

    const data = await res.json();
    return Response.json({ reply: data.choices[0].message.content });
}
