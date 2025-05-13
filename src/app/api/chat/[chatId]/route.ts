import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ chatId: string }> }
) {
    const params = await context.params;
    const chatId = params.chatId;

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { messages: true },
        });
        if (!chat) return Response.json({ error: "Chat not found" }, { status: 404 });
        return Response.json(chat);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "서버 에러" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ chatId: string }> }
) {
    const params = await context.params;
    const chatId = params.chatId;

    try {
        await prisma.chat.delete({
            where: { id: chatId },
        });
        return new Response(null, { status: 204 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "서버 에러" }, { status: 500 });
    }
}