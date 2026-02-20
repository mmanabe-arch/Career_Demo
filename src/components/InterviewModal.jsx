import { useState } from 'react';
import { X, Calendar, Video, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InterviewModal() {
  const { interviewModalOpen, interviewTarget, closeInterviewModal } = useApp();
  const [form, setForm] = useState({ date: '', time: '16:00', method: 'オンライン', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!interviewModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeInterviewModal();
      setForm({ date: '', time: '16:00', method: 'オンライン', message: '' });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeInterviewModal} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">面談申込</h2>
            {interviewTarget && (
              <p className="text-sm text-gray-500 mt-0.5">{interviewTarget.name}さんへ</p>
            )}
          </div>
          <button onClick={closeInterviewModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">申込完了！</h3>
            <p className="text-gray-500 text-sm">OB・OGから確認メッセージが届きます。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {interviewTarget && (
              <div className="bg-primary-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
                  {interviewTarget.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{interviewTarget.name}</div>
                  <div className="text-xs text-gray-500">{interviewTarget.currentCompany} / {interviewTarget.currentRole}</div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1" />希望日
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">希望時間</label>
              <select
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {['15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Video className="w-4 h-4 inline mr-1" />面談方法
              </label>
              <div className="flex gap-2">
                {['オンライン', '対面'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, method: m }))}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                      form.method === m
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">メッセージ</label>
              <textarea
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={3}
                placeholder="聞いてみたいことや自己紹介を書いてください..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-2.5"
            >
              面談を申し込む
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
