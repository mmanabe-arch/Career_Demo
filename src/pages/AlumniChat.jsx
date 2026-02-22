import { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, MessageCircle, User, GraduationCap, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { alumniInboxChats } from '../data/messages';
import { studentList } from '../data/students';

const STREAM_BADGE = {
  '理系': 'bg-blue-100 text-blue-700',
  '文系': 'bg-purple-100 text-purple-700',
  '未定': 'bg-gray-100 text-gray-500',
};

export default function AlumniChat() {
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [chats, setChats] = useState(() =>
    alumniInboxChats.map(c => ({ ...c, messages: [...c.messages] }))
  );
  const [input, setInput] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'chat'
  const bottomRef = useRef(null);

  const currentChat = chats[selectedIdx];
  const student = studentList.find(s => s.id === currentChat?.studentId);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedIdx]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'alumni',
      text: input,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
    setChats(prev => prev.map((c, i) =>
      i === selectedIdx ? { ...c, messages: [...c.messages, newMsg] } : c
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
    setSelectedIdx(idx);
    setView('chat');
  };

  const getLastMsg = (chat) => chat.messages[chat.messages.length - 1];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">生徒チャット</h1>
        <p className="text-gray-500 text-sm mt-1">在校生からのメッセージに返信しましょう</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: '640px' }}>
        <div className="flex h-full">

          {/* ── Sidebar ── */}
          <div className={`w-full sm:w-80 border-r border-gray-100 flex flex-col ${view === 'chat' ? 'hidden sm:flex' : 'flex'}`}>
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">受信チャット（{chats.length}件）</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat, idx) => {
                const last = getLastMsg(chat);
                const isUnread = last?.sender === 'student';
                return (
                  <button
                    key={chat.chatId}
                    onClick={() => selectChat(idx)}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      selectedIdx === idx ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {chat.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <p className={`text-sm font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {chat.studentName}
                            </p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${STREAM_BADGE[chat.studentStream]}`}>
                              {chat.studentStream}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">{last?.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{chat.studentGrade} · {chat.targetUniversity} 志望</p>
                        <p className={`text-xs mt-1 truncate ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                          {last?.sender === 'alumni' ? 'あなた: ' : ''}{last?.text}
                        </p>
                      </div>
                    </div>
                    {isUnread && (
                      <div className="flex justify-end mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Chat Area ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${view === 'list' ? 'hidden sm:flex' : 'flex'}`}>
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
                  <button onClick={() => setView('list')} className="sm:hidden p-1 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {currentChat.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{currentChat.studentName}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${STREAM_BADGE[currentChat.studentStream]}`}>
                        {currentChat.studentStream}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{currentChat.studentGrade} · {currentChat.targetUniversity} 志望</p>
                  </div>
                  {student && (
                    <button
                      onClick={() => navigate(`/students?id=${student.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors shrink-0"
                    >
                      <User className="w-3.5 h-3.5" />
                      生徒情報
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Student Info Banner */}
                {student && (
                  <div className="px-4 py-2.5 bg-sky-50 border-b border-sky-100 flex items-center gap-4 text-xs text-sky-800 overflow-x-auto">
                    <div className="flex items-center gap-1 shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span className="font-medium">{student.grade} {student.class}</span>
                    </div>
                    <span className="text-sky-400">|</span>
                    <span className="shrink-0">志望: <strong>{student.targetUniversity} {student.targetFaculty}</strong></span>
                    <span className="text-sky-400">|</span>
                    <span className="shrink-0">興味: {student.interests}</span>
                    {student.note && (
                      <>
                        <span className="text-sky-400">|</span>
                        <span className="text-sky-700 shrink-0">{student.note}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {currentChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'alumni' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'student' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs mr-2 shrink-0 self-end">
                          {currentChat.studentName.charAt(0)}
                        </div>
                      )}
                      <div className={`flex flex-col max-w-xs lg:max-w-md ${msg.sender === 'alumni' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.sender === 'alumni'
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex gap-2">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="メッセージを入力... (Enter で送信、Shift+Enter で改行)"
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
