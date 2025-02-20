'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userMessage: Message = { role: 'user', content: message };
      const updatedHistory = [...history, userMessage];
      setHistory(updatedHistory);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          history: updatedHistory // Send the entire conversation history
        }),
      });

      const data = await res.json();
      
      if (data.response) {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: data.response as string 
        };
        setHistory([...updatedHistory, assistantMessage]);
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch('/api/chat', { method: 'DELETE' });
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chat with GPT</h2>
        <button
          onClick={clearHistory}
          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          Clear History
        </button>
      </div>
      
      <div className="mb-4 h-80 overflow-auto border rounded p-4">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.role === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}