import { useState } from 'react';
import { CheckCircle, Send, Calendar, Users, Video, FileText } from 'lucide-react';
import { alumniList } from '../data/alumni';
import { lectureRequests } from '../data/feedback';

const statusConfig = {
  pending: { label: '申請中', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: '確定', color: 'bg-primary-100 text-primary-700' },
  completed: { label: '完了', color: 'bg-gray-100 text-gray-500' },
};

export default function LectureRequest() {
  const lectureAlumni = alumniList.filter(a => a.canLecture);
  const [form, setForm] = useState({
    alumniId: '',
    title: '',
    date: '',
    format: 'オンライン',
    audience: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState(lectureRequests);

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = alumniList.find(a => a.id === Number(form.alumniId));
    const newReq = {
      id: Date.now(),
      teacherName: "山田 先生",
      title: form.title,
      targetAlumniId: Number(form.alumniId),
      targetAlumniName: target?.name || '',
      requestedDate: form.date,
      format: form.format,
      status: 'pending',
      message: form.message,
    };
    setRequests(prev => [newReq, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ alumniId: '', title: '', date: '', format: 'オンライン', audience: '', message: '' });
    }, 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">講演依頼フォーム</h1>
        <p className="text-gray-500 text-sm mt-1">OB・OGへ講演・授業参加を依頼します</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">新規講演依頼</h2>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">送信完了!</h3>
              <p className="text-sm text-gray-500">OB・OGからの返信をお待ちください。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 inline mr-1" />講師（OB・OG）<span className="text-red-500">*</span>
                </label>
                <select
                  value={form.alumniId}
                  onChange={e => setForm(p => ({ ...p, alumniId: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">選択してください</option>
                  {lectureAlumni.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}（{a.currentCompany} / {a.currentRole}）
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FileText className="w-4 h-4 inline mr-1" />講演タイトル<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="例：法律・司法の世界について"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="w-4 h-4 inline mr-1" />希望日<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Video className="w-4 h-4 inline mr-1" />形式
                  </label>
                  <select
                    value={form.format}
                    onChange={e => setForm(p => ({ ...p, format: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option>オンライン</option>
                    <option>対面</option>
                    <option>ハイブリッド</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 inline mr-1" />対象クラス・生徒数
                </label>
                <input
                  type="text"
                  value={form.audience}
                  onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                  placeholder="例：高校3年生全員（120名）"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">メッセージ・依頼内容</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={4}
                  placeholder="講演で話してほしいこと、生徒の状況など..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                講演を依頼する
              </button>
            </form>
          )}
        </div>

        {/* Request History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">依頼履歴</h2>
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{req.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.targetAlumniName} 氏</p>
                  </div>
                  <span className={`badge text-xs shrink-0 ${statusConfig[req.status].color}`}>
                    {statusConfig[req.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{req.requestedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3 h-3" />{req.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
