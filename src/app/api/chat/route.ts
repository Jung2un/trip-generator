import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const chats = await prisma.chat.findMany({
            include: { messages: true },
            orderBy: { createdAt: "desc" },
        });
        return Response.json(chats);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "서버 에러" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title } = await req.json();
        const chat = await prisma.chat.create({
            data: {
                title,
            },
        });
        return Response.json(chat);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "서버 에러" }, { status: 500 });
    }
}
