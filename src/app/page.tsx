// Home.tsx
import ChatBox from "@/components/ChatBox";

export default function Home() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 flex flex-col h-[calc(100vh-6rem)]">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                    AI 여행 일정 생성기
                </h2>
                <div className="flex-grow flex flex-col max-h-[calc(100%-3rem)]">
                    <ChatBox/>
                </div>
            </div>
        </div>
    );
}
