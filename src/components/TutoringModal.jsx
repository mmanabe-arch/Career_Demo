import { useState } from 'react';
import { X, BookOpen, Calendar, Video, CheckCircle, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WEEKDAYS = ['月曜', '火曜', '水曜', '木曜', '金曜', '土曜', '日曜'];
const TIMESLOTS = ['放課後（16:00〜）', '夕方（18:00〜）', '夜（20:00〜）', '週末午前', '週末午後'];
const GOALS = ['大学受験対策', '定期テスト対策', '苦手科目の克服', '先取り学習', 'その他'];

export default function TutoringModal() {
  const { tutoringModalOpen, tutoringTarget, closeTutoringModal } = useApp();
  const [form, setForm] = useState({
    subjects: [],
    days: [],
    timeslot: '',
    method: 'オンライン',
    goal: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!tutoringModalOpen) return null;

  const availableSubjects = tutoringTarget?.tutorSubjects ?? [];

  const toggleSubject = (s) => setForm(p => ({
    ...p,
    subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s],
  }));

  const toggleDay = (d) => setForm(p => ({
    ...p,
    days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d],
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeTutoringModal();
      setForm({ subjects: [], days: [], timeslot: '', method: 'オンライン', goal: '', message: '' });
    }, 2500);
  };

  const handleClose = () => {
    closeTutoringModal();
    setForm({ subjects: [], days: [], timeslot: '', method: 'オンライン', goal: '', message: '' });
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">家庭教師を申し込む</h2>
              {tutoringTarget && (
                <p className="text-xs text-gray-400 mt-0.5">{tutoringTarget.name}さんへ</p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {submitted ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">申込完了！</h3>
              <p className="text-sm text-gray-500">
                {tutoringTarget?.name}さんから確認連絡が届きます。
              </p>
            </div>
          ) : (
            <form id="tutoring-form" onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Tutor Info */}
              {tutoringTarget && (
                <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {tutoringTarget.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{tutoringTarget.name}</p>
                    <p className="text-xs text-gray-500 truncate">{tutoringTarget.currentRole}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutoringTarget.tutorSubjects?.map(s => (
                        <span key={s} className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />教えてほしい科目
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        form.subjects.includes(s)
                          ? 'bg-amber-500 text-white border-amber-500 font-medium'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {form.subjects.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">1つ以上選択してください</p>
                )}
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">学習の目的</label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, goal: g }))}
                      className={`py-2 px-3 rounded-lg text-sm border text-left transition-all ${
                        form.goal === g
                          ? 'bg-amber-50 border-amber-400 text-amber-700 font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />希望曜日（複数可）
                </label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`w-12 py-1.5 rounded-lg text-xs border font-medium transition-all ${
                        form.days.includes(d)
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {d.replace('曜', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">希望時間帯</label>
                <select
                  value={form.timeslot}
                  onChange={e => setForm(p => ({ ...p, timeslot: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">選択してください</option>
                  {TIMESLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Video className="w-4 h-4 inline mr-1" />授業形式
                </label>
                <div className="flex gap-2">
                  {['オンライン', '対面'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, method: m }))}
                      className={`flex-1 py-2.5 text-sm rounded-lg border transition-colors font-medium ${
                        form.method === m
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介・相談内容</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={3}
                  placeholder="学年、現在の状況、苦手な単元など自由に書いてください..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="p-5 border-t border-gray-100 shrink-0">
            <button
              form="tutoring-form"
              type="submit"
              disabled={form.subjects.length === 0}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: form.subjects.length > 0 ? '#f59e0b' : undefined, color: 'white' }}
              onMouseEnter={e => { if (form.subjects.length > 0) e.currentTarget.style.background = '#d97706'; }}
              onMouseLeave={e => { if (form.subjects.length > 0) e.currentTarget.style.background = '#f59e0b'; }}
            >
              <BookOpen className="w-4 h-4" />
              家庭教師を申し込む
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              申込後、チャットで詳細を調整できます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
