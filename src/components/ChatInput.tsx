'use client';

import { useRef, useState } from 'react';
import { useChatStore } from '@/store/store';
import { useChatActions } from '@/hook/useChatActions';
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ChatInput() {
  const [text, setText] = useState('');
  const pRef = useRef<HTMLParagraphElement>(null);
  const { isSending } = useChatStore();
  const { handleSendMessage } = useChatActions();

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!text.trim() || isSending) return;

    await handleSendMessage(text);
    setText('');

    if (pRef.current) {
      pRef.current.textContent = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex px-3 gap-2 w-full items-end">
      <p
        ref={pRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setText(e.currentTarget.innerText ?? '')}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
        data-placeholder="어디로 여행하고 싶으신가요?"
        className={`relative w-full min-h-[40px] border rounded-lg px-3 py-2 outline-none whitespace-pre-wrap dark:border-zinc-600 before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:pointer-events-none ${
          text ? 'before:content-none' : ''
        } ${isSending ? 'opacity-50' : ''}`}
      />
      <input type="hidden" name="message" value={text} />
      <button
        type="submit"
        disabled={!text.trim() || isSending}
        className="h-10 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-400 dark:hover:bg-blue-500 dark:text-black font-bold px-4 py-2 rounded-3xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? <LoadingSpinner size="sm" /> : '↑'}
      </button>
    </form>
  );
}
