import { useState, useMemo } from 'react';
import {
  Users, BookOpen, BarChart3, LayoutDashboard,
  CheckCircle, Clock, AlertCircle, XCircle, Plus,
  ChevronDown, ChevronUp, Star, Calendar, Target,
  TrendingUp, ClipboardList, Pencil, Save, X
} from 'lucide-react';
import {
  tutoringRequests, sessions, progressRecords,
  SUBJECT_COLORS, UNDERSTANDING_LABELS
} from '../data/tutoring';

// ===== タブ定義 =====
const TABS = [
  { key: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { key: 'students',  label: '生徒管理',       icon: Users },
  { key: 'sessions',  label: '授業記録',       icon: ClipboardList },
  { key: 'progress',  label: '進捗トラッキング', icon: TrendingUp },
];

const STATUS_CONFIG = {
  pending:   { label: '申込中',  icon: Clock,        color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' },
  confirmed: { label: '受講中',  icon: CheckCircle,  color: 'bg-primary-100 text-primary-700', border: 'border-primary-200' },
  completed: { label: '完了',    icon: Star,         color: 'bg-gray-100 text-gray-500', border: 'border-gray-200' },
  cancelled: { label: 'キャンセル', icon: XCircle,  color: 'bg-red-100 text-red-600', border: 'border-red-200' },
};

// ===== メインコンポーネント =====
export default function TutorHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState(tutoringRequests);
  const [sessionList, setSessionList] = useState(sessions);

  // 申込ステータス変更
  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, confirmedAt: status === 'confirmed' ? new Date().toISOString().slice(0, 10) : r.confirmedAt } : r));
  };

  // 新規セッション追加
  const addSession = (session) => {
    setSessionList(prev => [{ ...session, id: Date.now() }, ...prev]);
  };

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">チューター管理</h1>
            <p className="text-gray-500 text-sm">家庭教師・コーチング活動の一元管理</p>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === key
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard'  && <DashboardTab requests={requests} sessions={sessionList} updateStatus={updateStatus} />}
      {activeTab === 'students'   && <StudentsTab   requests={requests} sessions={sessionList} updateStatus={updateStatus} />}
      {activeTab === 'sessions'   && <SessionsTab   requests={requests} sessions={sessionList} addSession={addSession} />}
      {activeTab === 'progress'   && <ProgressTab   requests={requests} />}
    </div>
  );
}

// ===== ダッシュボードタブ =====
function DashboardTab({ requests, sessions, updateStatus }) {
  const confirmed = requests.filter(r => r.status === 'confirmed');
  const pending   = requests.filter(r => r.status === 'pending');
  const thisMonth = sessions.filter(s => s.date.startsWith('2025-10'));

  const avgUnderstanding = sessions.length
    ? (sessions.reduce((s, x) => s + x.understanding, 0) / sessions.length).toFixed(1)
    : '—';

  const kpis = [
    { label: '担当生徒数',     value: confirmed.length, unit: '名', icon: Users,         color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: '今月の授業数',  value: thisMonth.length,  unit: '回', icon: Calendar,      color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: '申込待ち',      value: pending.length,    unit: '件', icon: AlertCircle,   color: 'text-yellow-600',  bg: 'bg-yellow-50' },
    { label: '平均理解度',    value: avgUnderstanding,  unit: '/5', icon: Star,          color: 'text-amber-600',   bg: 'bg-amber-50' },
  ];

  const recentSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, unit, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}<span className="text-sm font-normal text-gray-400 ml-0.5">{unit}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 申込待ち */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />新着申込（{pending.length}件）
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">申込待ちはありません</p>
          ) : (
            <div className="space-y-3">
              {pending.map(r => (
                <div key={r.id} className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.studentName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {r.targetUniversity} 志望 / {r.subjects.join('・')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{r.appliedAt}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{r.message}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(r.id, 'confirmed')}
                      className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      承認する
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, 'cancelled')}
                      className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      辞退する
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 最近の授業記録 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />最近の授業記録
          </h2>
          <div className="space-y-3">
            {recentSessions.map(s => {
              const u = UNDERSTANDING_LABELS[s.understanding];
              return (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.studentName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.date} · {s.subjects.join('・')} · {s.duration}分</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${u.bg} ${u.color}`}>
                      理解度: {s.understanding}/5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 生徒管理タブ =====
function StudentsTab({ requests, sessions, updateStatus }) {
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = requests.filter(r => statusFilter === 'all' || r.status === statusFilter);
  const selected = requests.find(r => r.id === selectedId);
  const studentSessions = selectedId ? sessions.filter(s => s.requestId === selectedId) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Left: 一覧 */}
      <div className="lg:col-span-2">
        {/* フィルタ */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {[['all','すべて'],['pending','申込中'],['confirmed','受講中'],['completed','完了']].map(([k,l]) => (
            <button
              key={k}
              onClick={() => setStatusFilter(k)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                statusFilter === k
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(r => {
            const st = STATUS_CONFIG[r.status];
            const Icon = st.icon;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedId(r.id === selectedId ? null : r.id)}
                className={`p-4 bg-white rounded-xl border cursor-pointer transition-all ${
                  selectedId === r.id
                    ? 'border-amber-400 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.studentName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{r.targetUniversity}</p>
                  </div>
                  <span className={`badge text-xs shrink-0 ${st.color}`}>
                    <Icon className="w-3 h-3 inline mr-1" />{st.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.subjects.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{s}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: 詳細 */}
      <div className="lg:col-span-3">
        {selected ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.studentName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selected.grade} · 申込: {selected.appliedAt}</p>
                </div>
                {selected.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(selected.id, 'confirmed')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                      承認
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'cancelled')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                      辞退
                    </button>
                  </div>
                )}
                {selected.status === 'confirmed' && (
                  <button onClick={() => updateStatus(selected.id, 'completed')}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                    完了にする
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* 基本情報 */}
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="志望大学" value={selected.targetUniversity} icon={Target} />
                <InfoItem label="目標偏差値" value={`${selected.targetScore}`} icon={BarChart3} />
                <InfoItem label="担当科目" value={selected.subjects.join('・')} icon={BookOpen} />
                <InfoItem label="授業形式" value={selected.method} icon={Calendar} />
                <InfoItem label="希望曜日" value={selected.preferredDays.join('・')} icon={Calendar} />
                <InfoItem label="希望時間" value={selected.preferredTime} icon={Clock} />
              </div>

              {/* 学習目的・メッセージ */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">学習目的</p>
                <span className="badge bg-amber-100 text-amber-700">{selected.goal}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">申込メッセージ</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{selected.message}</p>
              </div>

              {/* 授業履歴 */}
              {studentSessions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">授業履歴（{studentSessions.length}回）</p>
                  <div className="space-y-2">
                    {studentSessions.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="text-gray-400 text-xs w-20 shrink-0">{s.date}</span>
                        <span className="text-gray-700 flex-1">{s.subjects.join('・')} · {s.duration}分</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${UNDERSTANDING_LABELS[s.understanding].bg} ${UNDERSTANDING_LABELS[s.understanding].color}`}>
                          {s.understanding}/5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 bg-white rounded-xl border border-gray-100 py-20">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">生徒を選択してください</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
        <Icon className="w-3 h-3" />{label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

// ===== 授業記録タブ =====
function SessionsTab({ requests, sessions, addSession }) {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({
    requestId: '', studentName: '', date: '', startTime: '16:00',
    duration: 90, subjects: [], content: '', understanding: 3,
    homework: '', nextGoal: '', tutorNote: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const confirmed = requests.filter(r => r.status === 'confirmed');

  const handleStudentChange = (reqId) => {
    const req = requests.find(r => r.id === Number(reqId));
    setForm(p => ({ ...p, requestId: Number(reqId), studentName: req?.studentName ?? '', subjects: req?.subjects ?? [] }));
  };

  const toggleSubject = (s) => setForm(p => ({
    ...p,
    subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s],
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addSession({ ...form, tutorId: 36 });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setForm({ requestId:'', studentName:'', date:'', startTime:'16:00', duration:90, subjects:[], content:'', understanding:3, homework:'', nextGoal:'', tutorNote:'' }); }, 1500);
  };

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-5">
      {/* 新規記録ボタン */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white transition-colors"
          style={{ background: '#f59e0b' }}
          onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
          onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
        >
          <Plus className="w-4 h-4" />
          授業記録を追加
        </button>
      </div>

      {/* 入力フォーム */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-amber-500" />授業記録入力
          </h2>
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-800">記録しました！</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">生徒</label>
                  <select
                    value={form.requestId}
                    onChange={e => handleStudentChange(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">選択</option>
                    {confirmed.map(r => <option key={r.id} value={r.id}>{r.studentName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">日付</label>
                  <input type="date" required value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">開始時刻</label>
                  <input type="time" value={form.startTime}
                    onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">授業時間（分）</label>
                  <select value={form.duration}
                    onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {[45, 60, 90, 120].map(d => <option key={d} value={d}>{d}分</option>)}
                  </select>
                </div>
              </div>

              {/* 科目 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">実施科目</label>
                <div className="flex flex-wrap gap-2">
                  {['数学','英語','物理','化学','生物','国語','社会','情報'].map(s => (
                    <button key={s} type="button" onClick={() => toggleSubject(s)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        form.subjects.includes(s) ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {/* 授業内容 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">授業内容</label>
                <textarea required rows={3} value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="扱ったトピック、解いた問題、説明した概念など..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* 理解度 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">生徒の理解度</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(v => {
                    const u = UNDERSTANDING_LABELS[v];
                    return (
                      <button key={v} type="button" onClick={() => setForm(p => ({ ...p, understanding: v }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                          form.understanding === v ? `${u.bg} ${u.color} border-current` : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >{v}</button>
                    );
                  })}
                </div>
                <p className={`text-xs mt-1.5 ${UNDERSTANDING_LABELS[form.understanding].color}`}>
                  {UNDERSTANDING_LABELS[form.understanding].label}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">宿題・課題</label>
                  <textarea rows={2} value={form.homework}
                    onChange={e => setForm(p => ({ ...p, homework: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    placeholder="次回までの課題..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">次回の目標</label>
                  <textarea rows={2} value={form.nextGoal}
                    onChange={e => setForm(p => ({ ...p, nextGoal: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    placeholder="次回扱う内容・目標..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">チューターメモ（非公開）</label>
                <textarea rows={2} value={form.tutorNote}
                  onChange={e => setForm(p => ({ ...p, tutorNote: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  placeholder="気になった点、次回の指導方針など..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#f59e0b' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
                >
                  <Save className="w-4 h-4" />記録を保存
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* セッション一覧 */}
      <div className="space-y-3">
        {sorted.map(s => {
          const u = UNDERSTANDING_LABELS[s.understanding];
          const isOpen = expanded === s.id;
          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : s.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{s.studentName}</p>
                    {s.subjects.map(sub => (
                      <span key={sub} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: SUBJECT_COLORS[sub] + '20', color: SUBJECT_COLORS[sub] }}>
                        {sub}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.date} · {s.startTime}〜 · {s.duration}分</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.bg} ${u.color}`}>
                    理解 {s.understanding}/5
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 bg-gray-50">
                  <Section title="授業内容" text={s.content} />
                  {s.homework && <Section title="宿題・課題" text={s.homework} highlight="amber" />}
                  {s.nextGoal && <Section title="次回の目標" text={s.nextGoal} highlight="blue" />}
                  {s.tutorNote && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1.5">チューターメモ（非公開）</p>
                      <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-dashed border-gray-200 italic">{s.tutorNote}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, text, highlight }) {
  const bg = highlight === 'amber' ? 'bg-amber-50 border-amber-100' : highlight === 'blue' ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100';
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1.5">{title}</p>
      <p className={`text-sm text-gray-700 rounded-lg p-3 border leading-relaxed ${bg}`}>{text}</p>
    </div>
  );
}

// ===== 進捗トラッキングタブ =====
function ProgressTab({ requests }) {
  const confirmed = requests.filter(r => r.status === 'confirmed');
  const [selectedReqId, setSelectedReqId] = useState(confirmed[0]?.id ?? null);

  const data = selectedReqId ? progressRecords[selectedReqId] : null;

  // SVG折れ線グラフ描画
  const chartWidth  = 520;
  const chartHeight = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const allScores = data?.records.flatMap(r => Object.values(r).filter(v => typeof v === 'number')) ?? [];
  const minScore = Math.max(0,  Math.min(...allScores) - 5);
  const maxScore = Math.min(100, Math.max(...allScores) + 5);

  const toX = (i, n) => padLeft + (i / (n - 1)) * (chartWidth - padLeft - padRight);
  const toY = (v) => padTop + (1 - (v - minScore) / (maxScore - minScore)) * (chartHeight - padTop - padBottom);

  const subjectKeys = { 数学: 'math', 英語: 'english', 物理: 'physics', 化学: 'chemistry', 生物: 'biology' };

  return (
    <div className="space-y-5">
      {/* 生徒選択 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {confirmed.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReqId(r.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                selectedReqId === r.id
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
              }`}
            >
              {r.studentName}
            </button>
          ))}
        </div>
      </div>

      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 偏差値グラフ */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />偏差値推移
              </h2>
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-gray-500">目標: {data.targetScore}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* グリッド線 */}
                {[minScore, Math.round((minScore+maxScore)/2), maxScore].map(v => (
                  <g key={v}>
                    <line x1={padLeft} x2={chartWidth - padRight} y1={toY(v)} y2={toY(v)}
                      stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 3" />
                    <text x={padLeft - 6} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{v}</text>
                  </g>
                ))}

                {/* 目標ライン */}
                <line x1={padLeft} x2={chartWidth - padRight} y1={toY(data.targetScore)} y2={toY(data.targetScore)}
                  stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3" />

                {/* 各科目の折れ線 */}
                {data.subjects.map(subLabel => {
                  const key = subjectKeys[subLabel];
                  if (!key) return null;
                  const color = SUBJECT_COLORS[subLabel] || '#6b7280';
                  const pts = data.records
                    .map((r, i) => r[key] !== null ? { x: toX(i, data.records.length), y: toY(r[key]), v: r[key] } : null)
                    .filter(Boolean);
                  if (pts.length < 2) return null;
                  const d = pts.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
                  return (
                    <g key={subLabel}>
                      <path d={d} stroke={color} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
                      {pts.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
                      ))}
                    </g>
                  );
                })}

                {/* X軸ラベル */}
                {data.records.map((r, i) => (
                  <text key={i}
                    x={toX(i, data.records.length)} y={chartHeight - 5}
                    textAnchor="middle" fontSize={8} fill="#9ca3af"
                  >
                    {r.date.slice(5)}
                  </text>
                ))}
              </svg>
            </div>

            {/* 凡例 */}
            <div className="flex flex-wrap gap-3 mt-3">
              {data.subjects.map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: SUBJECT_COLORS[s] }} />
                  <span className="text-xs text-gray-500">{s}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 bg-red-400" style={{ borderTop: '2px dashed #ef4444' }} />
                <span className="text-xs text-gray-400">目標</span>
              </div>
            </div>
          </div>

          {/* 右: 最新スコア & 伸び */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">最新スコアと伸び</h3>
              <div className="space-y-3">
                {data.subjects.map(s => {
                  const key = subjectKeys[s];
                  const vals = data.records.map(r => r[key]).filter(v => v !== null);
                  const latest = vals.at(-1);
                  const first  = vals[0];
                  const diff   = latest - first;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full" style={{ background: SUBJECT_COLORS[s] }} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{s}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-gray-900">{latest}</span>
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${diff >= 0 ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-600'}`}>
                              {diff >= 0 ? '+' : ''}{diff}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full mt-1.5">
                          <div className="h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (latest / data.targetScore) * 100)}%`, background: SUBJECT_COLORS[s] }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />目標情報
              </h3>
              <p className="text-xs text-gray-500 mb-1">志望大学</p>
              <p className="text-sm font-semibold text-gray-800 mb-3">{data.targetUniversity}</p>
              <p className="text-xs text-gray-500 mb-1">目標偏差値</p>
              <p className="text-2xl font-bold text-amber-600">{data.targetScore}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-300">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">生徒を選択してください</p>
        </div>
      )}
    </div>
  );
}
