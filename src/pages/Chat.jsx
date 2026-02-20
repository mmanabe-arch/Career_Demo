import { useState } from 'react';
import { Send, ChevronLeft, MessageCircle } from 'lucide-react';
import { mockChats } from '../data/messages';
import { alumniList } from '../data/alumni';

export default function Chat() {
  const [selectedChatIdx, setSelectedChatIdx] = useState(0);
  const [chats, setChats] = useState(mockChats);
  const [input, setInput] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'chat'

  const currentChat = chats[selectedChatIdx];
  const alumni = alumniList.find(a => a.id === currentChat?.alumniId);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'student',
      text: input,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
    setChats(prev => prev.map((c, i) =>
      i === selectedChatIdx ? { ...c, messages: [...c.messages, newMsg] } : c
    ));
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectChat = (idx) => {
    setSelectedChatIdx(idx);
    setView('chat');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">チャット</h1>
        <p className="text-gray-500 text-sm mt-1">OB・OGとメッセージのやりとり</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-full sm:w-72 border-r border-gray-100 flex flex-col ${view === 'chat' ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">メッセージ一覧</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat, idx) => {
                const a = alumniList.find(al => al.id === chat.alumniId);
                const lastMsg = chat.messages[chat.messages.length - 1];
                return (
                  <button
                    key={chat.alumniId}
                    onClick={() => selectChat(idx)}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      selectedChatIdx === idx ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shrink-0">
                        {a?.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{a?.name}</p>
                          <span className="text-xs text-gray-400">{lastMsg?.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {lastMsg?.sender === 'student' ? 'あなた: ' : ''}{lastMsg?.text}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Add new chat hint */}
              <div className="p-4">
                <p className="text-xs text-gray-400 text-center">
                  OB・OGの詳細ページから新しいチャットを開始できます
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${view === 'list' ? 'hidden sm:flex' : 'flex'}`}>
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <button
                    onClick={() => setView('list')}
                    className="sm:hidden p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                    {alumni?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{alumni?.name}</p>
                    <p className="text-xs text-gray-500">{alumni?.currentRole} / {alumni?.currentCompany}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'alumni' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xs mr-2 shrink-0 self-end">
                          {alumni?.name.charAt(0)}
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-sm ${msg.sender === 'student' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.sender === 'student'
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="メッセージを入力... (Enter で送信)"
                      rows={1}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>チャットを選択してください</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
