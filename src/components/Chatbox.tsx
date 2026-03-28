'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [inputUser, setInputUser] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- DI SINI TEMPATNYA ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUser.trim()) return;

    // 1. Tambahkan pesan user ke UI
    const newUserMessage = { role: 'user', text: inputUser };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 2. LOGIC FETCH YANG KAMU TANYAKAN
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputUser }), // Mengirim input ke API Route
      });

      const data = await response.json();

      // 3. Tambahkan jawaban AI ke UI
      setMessages((prev) => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Waduh, asisten AI kami sedang istirahat sebentar karena ramai 😅. Tenang Kak, langsung chat admin via WA saja ya di 085726129692!' 
    }]);
    } finally {
      setIsLoading(false);
      setInputUser(''); // Kosongkan input setelah kirim
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      {/* Tampilan Chat History */}
      <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && <p className="text-xs text-gray-400">KLIQ AI sedang berpikir...</p>}
      </div>

      {/* Form Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
          placeholder="Tanya masalah AC kamu..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kirim
        </button>
      </form>
    </div>
  );
}