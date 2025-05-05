import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
              <div className="text-red-500">Hello</div>
              <h1 className="text-2xl font-bold mb-4 text-center">✈️ TripGen - AI 여행 일정 생성기</h1>
              <ChatBox/>
          </div>
      </main>
  );
}
