"use client";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import React, { RefObject } from "react";
import type { Message} from "@/lib/useChat";

type Props = {
    messages: Message[];
    onSend: (userInput: string) => Promise<void>;
    bottomRef: RefObject<HTMLDivElement | null>;
};

export default function ChatBox({ messages, onSend, bottomRef }: Props) {

    return (
        <div className="flex flex-col h-full">
            {messages.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">AI 여행 일정 생성기</h2>
                    <div className="bg-blue-50 dark:bg-zinc-700 text-left text-sm text-gray-700 dark:text-gray-200 rounded-lg p-4 w-full max-w-xl">
                        <p className="mb-2 font-semibold">아래와 같은 질문으로 시작해보세요</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>&quot;일본 도쿄 3박 4일 여행 계획 추천해줘&quot;</li>
                            <li>&quot;제주도 가족 여행 일정 추천해줘&quot;</li>
                            <li>&quot;파리 여행 필수 방문 장소 알려줘&quot;</li>
                            <li>&quot;20만원으로 갈 수 있는 동남아 여행지 추천해줘&quot;</li>
                        </ul>
                        <p className="mt-2">여행 스타일, 기간을 알려주시면 더 맞춤형 추천을 받을 수 있습니다.</p>
                    </div>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto mb-4 scrollbar-hide px-2">
                    <MessageList messages={messages} />
                    <div ref={bottomRef} />
                </div>
            )}
            <ChatInput onSend={onSend} />
        </div>
    );
}