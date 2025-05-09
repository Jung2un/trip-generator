// Home.tsx
import ChatBox from "@/components/ChatBox";

export default function Home() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
            <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-6rem)]">
                <div className="flex-grow flex flex-col max-h-[calc(100%)]">
                    <ChatBox/>
                </div>
            </div>
        </div>
    );
}
