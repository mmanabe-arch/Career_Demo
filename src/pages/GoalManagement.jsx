import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Trash2, ChevronLeft, ChevronRight, Check, X,
  Trophy, ClipboardList, Calendar, Users, BarChart2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ── Utilities ───────────────────────────────────────────── */

function uid() { return Math.random().toString(36).slice(2, 9); }

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDateJP(s) {
  const d = new Date(s + 'T00:00:00');
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${'日月火水木金土'[d.getDay()]}）`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const t = new Date(dateStr + 'T00:00:00');
  const n = new Date(); n.setHours(0,0,0,0);
  return Math.ceil((t - n) / 86400000);
}

/* ── Storage ─────────────────────────────────────────────── */

const EXAM_KEY   = 'career-exams-v2';
const HW_KEY     = 'career-homework-v1';
const MOCKEX_KEY = 'career-mockexams-v1';

const load = (key, fb) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fb)); } catch { return fb; } };

/* ── Constants ───────────────────────────────────────────── */

const DEFAULT_SUBJECTS = ['国語', '数学', '英語', '理科', '社会'];
const HW_SUBJECTS = ['国語', '数学', '英語', '理科', '社会', '体育', '音楽', '美術', '技家', 'その他'];

const EXAMS = [
  { id: '1st-mid',   label: '1学期 中間' },
  { id: '1st-final', label: '1学期 期末' },
  { id: '2nd-mid',   label: '2学期 中間' },
  { id: '2nd-final', label: '2学期 期末' },
  { id: 'year-end',  label: '学年末' },
];

const SC = [
  { bg:'bg-blue-100',   tx:'text-blue-700',   bar:'#3b82f6' },
  { bg:'bg-green-100',  tx:'text-green-700',  bar:'#22c55e' },
  { bg:'bg-purple-100', tx:'text-purple-700', bar:'#a855f7' },
  { bg:'bg-orange-100', tx:'text-orange-700', bar:'#f97316' },
  { bg:'bg-pink-100',   tx:'text-pink-700',   bar:'#ec4899' },
  { bg:'bg-teal-100',   tx:'text-teal-700',   bar:'#14b8a6' },
  { bg:'bg-yellow-100', tx:'text-yellow-700', bar:'#eab308' },
  { bg:'bg-red-100',    tx:'text-red-700',    bar:'#ef4444' },
];
const sc = i => SC[i % SC.length];

// Mock senior scores for comparison
const SENIOR = {
  '1st-mid':   { '国語':74, '数学':68, '英語':79, '理科':71, '社会':80 },
  '1st-final': { '国語':76, '数学':72, '英語':81, '理科':74, '社会':82 },
  '2nd-mid':   { '国語':77, '数学':75, '英語':83, '理科':76, '社会':79 },
  '2nd-final': { '国語':79, '数学':78, '英語':85, '理科':79, '社会':80 },
  'year-end':  { '国語':82, '数学':82, '英語':87, '理科':81, '社会':83 },
};

// Mock school average
const SCHOOL_AVG = {
  '1st-mid':   { '国語':68, '数学':60, '英語':65, '理科':62, '社会':66 },
  '1st-final': { '国語':70, '数学':63, '英語':67, '理科':64, '社会':68 },
  '2nd-mid':   { '国語':69, '数学':61, '英語':66, '理科':63, '社会':67 },
  '2nd-final': { '国語':71, '数学':64, '英語':68, '理科':65, '社会':69 },
  'year-end':  { '国語':72, '数学':66, '英語':70, '理科':67, '社会':71 },
};

const TABS = [
  { key:'exam',   label:'定期テスト', icon: Trophy       },
  { key:'hw',     label:'宿題',       icon: ClipboardList },
  { key:'mockex', label:'模試予定',   icon: Calendar      },
];

function emptyExam() {
  return {
    date: '', goal: '',
    subjects: DEFAULT_SUBJECTS.map(n => ({
      id: uid(), name: n, target:'', score:'', scope:'', todos:[],
    })),
  };
}

/* ── Main ────────────────────────────────────────────────── */

export default function GoalManagement() {
  const { role, studentProfile } = useApp();
  const [tab,    setTab]    = useState('exam');
  const [exams,  setExams]  = useState(() => load(EXAM_KEY,   {}));
  const [hw,     setHw]     = useState(() => load(HW_KEY,     {}));
  const [mockex, setMockex] = useState(() => load(MOCKEX_KEY, []));

  useEffect(() => { localStorage.setItem(EXAM_KEY,   JSON.stringify(exams));  }, [exams]);
  useEffect(() => { localStorage.setItem(HW_KEY,     JSON.stringify(hw));     }, [hw]);
  useEffect(() => { localStorage.setItem(MOCKEX_KEY, JSON.stringify(mockex)); }, [mockex]);

  const univ = studentProfile?.targetUniversity || '志望校';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">目標管理</h1>
        <p className="text-gray-500 text-sm mt-1">定期テスト・宿題・模試の管理</p>
      </div>

      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === key ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {tab === 'exam'   && <ExamView   exams={exams} setExams={setExams} univ={univ} />}
      {tab === 'hw'     && <HwView     hw={hw}       setHw={setHw}       role={role} />}
      {tab === 'mockex' && <MockExView mockex={mockex} setMockex={setMockex} />}
    </div>
  );
}

/* ── ExamView ─────────────────────────────────────────────── */

function ExamView({ exams, setExams, univ }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [sel,  setSel]  = useState('1st-mid');

  const key  = `${year}-${sel}`;
  const exam = exams[key] ?? emptyExam();
  const name = EXAMS.find(e => e.id === sel)?.label ?? '';

  const upd = (field, val) =>
    setExams(p => ({ ...p, [key]: { ...(p[key] ?? emptyExam()), [field]: val } }));

  const updSubjs = subjects => upd('subjects', subjects);
  const updOne   = (id, f, v) => updSubjs(exam.subjects.map(s => s.id === id ? { ...s, [f]: v } : s));

  const days    = daysUntil(exam.date);
  const senior  = SENIOR[sel]      ?? {};
  const schAvg  = SCHOOL_AVG[sel]  ?? {};

  const myTotal  = exam.subjects.filter(s => s.score !== '').reduce((a, s) => a + +s.score, 0);
  const snTotal  = Object.values(senior).reduce((a, v) => a + v, 0);
  const avgTotal = Object.values(schAvg).reduce((a, v) => a + v, 0);
  const hasScore = exam.subjects.some(s => s.score !== '');

  // Build chart history
  const history = useMemo(() => EXAMS.map(({ id, label }) => {
    const e  = exams[`${year}-${id}`];
    const my = e?.subjects.some(s => s.score !== '')
      ? e.subjects.filter(s => s.score !== '').reduce((a, s) => a + +s.score, 0) : null;
    const sn = Object.values(SENIOR[id] ?? {}).reduce((a, v) => a + v, 0) || null;
    const av = Object.values(SCHOOL_AVG[id] ?? {}).reduce((a, v) => a + v, 0) || null;
    return { id, label, my, sn, av };
  }), [exams, year]);

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Year + Period selector */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setYear(y => y-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <span className="font-bold text-gray-900 text-sm">{year}年度</span>
          <button onClick={() => setYear(y => y+1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMS.map(({ id, label }) => (
            <button key={id} onClick={() => setSel(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                sel === id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Countdown + Goal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-gray-900">{name}</h3>
          </div>
          <div className="mb-3">
            <label className="text-xs text-gray-400 font-medium">テスト日</label>
            <input type="date" value={exam.date} onChange={e => upd('date', e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          {days !== null && (
            <div className={`text-center py-3 rounded-xl ${days < 0 ? 'bg-gray-50' : days <= 7 ? 'bg-red-50' : days <= 14 ? 'bg-amber-50' : 'bg-orange-50'}`}>
              {days < 0
                ? <p className="text-sm text-gray-500">テスト終了</p>
                : days === 0
                  ? <p className="text-2xl font-black text-red-600">今日！</p>
                  : <><p className="text-4xl font-black text-orange-600">{days}</p><p className="text-xs text-gray-500 mt-1">日後</p></>
              }
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="text-xs text-gray-400 font-medium">目標</label>
          <InlineEdit value={exam.goal} onChange={v => upd('goal', v)} placeholder="例：平均80点以上" className="font-bold text-gray-900 text-base" />
          {hasScore && (
            <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">{myTotal}</div>
                <div className="text-xs text-gray-400">自分</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-500">{avgTotal}</div>
                <div className="text-xs text-gray-400">校内平均</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{snTotal}</div>
                <div className="text-xs text-gray-400">{univ}先輩</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score History Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-gray-500" />
          点数の推移（{year}年度 合計点）
        </h3>
        <ScoreChart data={history} current={sel} />
        <div className="flex items-center gap-4 mt-3 justify-center text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" />自分</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-400 inline-block" />校内平均</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" />{univ}先輩</span>
        </div>
      </div>

      {/* Subject cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900">科目別 管理</h3>
        {exam.subjects.map((subj, i) => (
          <SubjectCard
            key={subj.id}
            subj={subj}
            index={i}
            senior={senior[subj.name]}
            schoolAvg={schAvg[subj.name]}
            onUpdate={(f, v) => updOne(subj.id, f, v)}
            onDelete={() => updSubjs(exam.subjects.filter(s => s.id !== subj.id))}
            updTodos={todos => updOne(subj.id, 'todos', todos)}
          />
        ))}
        <AddSubjectRow onAdd={name => {
          if (!name.trim()) return;
          updSubjs([...exam.subjects, { id: uid(), name: name.trim(), target:'', score:'', scope:'', todos:[] }]);
        }} />
      </div>
    </div>
  );
}

/* ── ScoreChart ──────────────────────────────────────────── */

function ScoreChart({ data, current }) {
  const max = 500;
  const chartH = 150;
  const barW   = 16;
  const groupW = 72;
  const padL   = 38;
  const padB   = 28;
  const totalW = padL + data.length * groupW + 10;

  return (
    <div className="overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + padB}`} className="overflow-visible min-w-[320px]">
        {[0, 100, 200, 300, 400, 500].map(v => {
          const y = chartH - (v / max) * chartH;
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={totalW - 8} y2={y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x0 = padL + i * groupW + 4;
          const isCur = d.id === current;
          return (
            <g key={d.id}>
              {isCur && <rect x={x0 - 2} y={0} width={groupW - 2} height={chartH} fill="#fff7ed" rx="3" />}

              {d.my !== null && (() => {
                const h = (d.my / max) * chartH;
                return (
                  <g>
                    <rect x={x0} y={chartH - h} width={barW} height={h} fill={isCur ? '#4f46e5' : '#a5b4fc'} rx="2" />
                    <text x={x0 + barW/2} y={chartH - h - 2} textAnchor="middle" fontSize="8" fill="#4f46e5">{d.my}</text>
                  </g>
                );
              })()}

              {d.av !== null && (() => {
                const h = (d.av / max) * chartH;
                return (
                  <g>
                    <rect x={x0 + barW + 2} y={chartH - h} width={barW} height={h} fill="#9ca3af" rx="2" />
                    <text x={x0 + barW + 2 + barW/2} y={chartH - h - 2} textAnchor="middle" fontSize="8" fill="#6b7280">{d.av}</text>
                  </g>
                );
              })()}

              {d.sn !== null && (() => {
                const h = (d.sn / max) * chartH;
                return (
                  <g>
                    <rect x={x0 + (barW + 2) * 2} y={chartH - h} width={barW} height={h} fill={isCur ? '#f97316' : '#fdba74'} rx="2" />
                    <text x={x0 + (barW+2)*2 + barW/2} y={chartH - h - 2} textAnchor="middle" fontSize="8" fill="#f97316">{d.sn}</text>
                  </g>
                );
              })()}

              <text x={x0 + barW + 3} y={chartH + padB - 4} textAnchor="middle" fontSize="9" fill={isCur ? '#f97316' : '#6b7280'} fontWeight={isCur ? 'bold' : 'normal'}>{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── SubjectCard ─────────────────────────────────────────── */

function SubjectCard({ subj, index, senior, schoolAvg, onUpdate, onDelete, updTodos }) {
  const [open,    setOpen]    = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const color = sc(index);

  const vsAvg    = subj.score !== '' && schoolAvg  != null ? +subj.score - schoolAvg  : null;
  const vsSenior = subj.score !== '' && senior      != null ? +subj.score - senior      : null;
  const todoDone = subj.todos.filter(t => t.done).length;

  const addTodo = () => {
    const t = newTodo.trim(); if (!t) return;
    updTodos([...subj.todos, { id: uid(), text: t, done: false }]);
    setNewTodo('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${color.bg} ${color.tx}`}>{subj.name}</span>
        <div className="flex gap-3 flex-1 flex-wrap items-center">
          {subj.score !== '' && <span className="text-sm font-bold text-gray-900">{subj.score}点</span>}
          {vsAvg !== null && (
            <span className={`text-xs font-medium ${vsAvg >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {vsAvg >= 0 ? '+' : ''}{vsAvg} vs平均
            </span>
          )}
          {vsSenior !== null && (
            <span className={`text-xs font-medium ${vsSenior >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {vsSenior >= 0 ? '+' : ''}{vsSenior} vs先輩
            </span>
          )}
          {subj.todos.length > 0 && (
            <span className="text-xs text-gray-400">{todoDone}/{subj.todos.length} 完了</span>
          )}
          {subj.scope && <span className="text-xs text-gray-400 truncate max-w-[160px]">範囲: {subj.scope}</span>}
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-gray-50 p-4 space-y-4">
          {/* Score inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { f:'target', label:'目標点数', cls:'border-orange-200 focus:ring-orange-400 text-orange-700' },
              { f:'score',  label:'結果点数', cls:'border-primary-200 focus:ring-primary-400 text-primary-700 font-bold' },
            ].map(({ f, label, cls }) => (
              <div key={f}>
                <label className="text-xs text-gray-400 font-medium">{label}</label>
                <input type="number" min="0" max="100" value={subj[f]}
                  onChange={e => onUpdate(f, e.target.value)} placeholder="—"
                  className={`w-full mt-1 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${cls}`} />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-400 font-medium">校内平均</label>
              <div className="mt-1 text-center border border-gray-100 rounded-lg px-2 py-1.5 text-sm bg-gray-50 text-gray-600">
                {schoolAvg ?? '—'}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">先輩の点数</label>
              <div className="mt-1 text-center border border-orange-100 rounded-lg px-2 py-1.5 text-sm bg-orange-50 text-orange-600 font-medium">
                {senior ?? '—'}
              </div>
            </div>
          </div>

          {/* Scope */}
          <div>
            <label className="text-xs text-gray-400 font-medium">出題範囲</label>
            <textarea value={subj.scope} onChange={e => onUpdate('scope', e.target.value)}
              placeholder="例：教科書 p.50-80、漢字練習帳 第3章..."
              rows={2}
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
          </div>

          {/* Todos */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">やること</label>
            <div className="space-y-1 mb-2">
              {subj.todos.map(t => (
                <div key={t.id} className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-50 group">
                  <button
                    onClick={() => updTodos(subj.todos.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                    className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                      t.done ? 'bg-primary-500 border-primary-500' : 'border-gray-300 hover:border-primary-400'
                    }`}
                  >
                    {t.done && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{t.text}</span>
                  <button
                    onClick={() => updTodos(subj.todos.filter(x => x.id !== t.id))}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-red-500 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
                placeholder="やることを追加..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
              <button onClick={addTodo} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={onDelete} className="text-xs text-gray-300 hover:text-red-500 transition-colors flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" />この科目を削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddSubjectRow({ onAdd }) {
  const [v, setV] = useState('');
  return (
    <div className="flex gap-2">
      <input value={v} onChange={e => setV(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { onAdd(v); setV(''); } }}
        placeholder="科目を追加..."
        className="flex-1 border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
      <button onClick={() => { onAdd(v); setV(''); }}
        className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200">
        <Plus className="w-3.5 h-3.5" />追加
      </button>
    </div>
  );
}

function InlineEdit({ value, onChange, placeholder, className = 'text-sm text-gray-700' }) {
  const [ed, setEd] = useState(false);
  if (ed) return (
    <input
      className="w-full mt-1 border border-primary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
      value={value} onChange={e => onChange(e.target.value)}
      onBlur={() => setEd(false)} onKeyDown={e => e.key === 'Enter' && setEd(false)} autoFocus />
  );
  return (
    <div className="group cursor-pointer mt-1" onClick={() => setEd(true)}>
      {value ? <p className={className}>{value}</p> : <p className="text-sm text-gray-300 italic">{placeholder}</p>}
    </div>
  );
}

/* ── HwView ──────────────────────────────────────────────── */

function HwView({ hw, setHw, role }) {
  const today   = new Date();
  const todayStr = toDateStr(today);
  const [date,  setDate]  = useState(todayStr);
  const [subj,  setSubj]  = useState(HW_SUBJECTS[0]);
  const [txt,   setTxt]   = useState('');
  const [tOpen, setTOpen] = useState(false);
  const [tStart,setTStart]= useState(todayStr);
  const [tEnd,  setTEnd]  = useState(todayStr);
  const [tSubj, setTSubj] = useState(HW_SUBJECTS[0]);
  const [tTxt,  setTTxt]  = useState('');

  const tasks    = hw[date] ?? [];
  const setTasks = t => setHw(p => ({ ...p, [date]: t }));

  const add = () => {
    const t = txt.trim(); if (!t) return;
    setTasks([...tasks, { id: uid(), subject: subj, title: t, done: false, fromTeacher: false }]);
    setTxt('');
  };

  const toggle = id => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del    = id => setTasks(tasks.filter(t => t.id !== id));

  const prev = () => { const d = new Date(date + 'T00:00:00'); d.setDate(d.getDate()-1); setDate(toDateStr(d)); };
  const next = () => { const d = new Date(date + 'T00:00:00'); d.setDate(d.getDate()+1); setDate(toDateStr(d)); };

  const bulkAdd = () => {
    const t = tTxt.trim(); if (!t) return;
    const start = new Date(tStart + 'T00:00:00');
    const end   = new Date(tEnd   + 'T00:00:00');
    if (start > end) return;
    setHw(prev => {
      const next = { ...prev };
      for (const d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
        const k = toDateStr(d);
        const existing = next[k] ?? [];
        if (!existing.some(x => x.subject === tSubj && x.title === t)) {
          next[k] = [...existing, { id: uid(), subject: tSubj, title: t, done: false, fromTeacher: true }];
        }
      }
      return next;
    });
    setTTxt('');
  };

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = total > 0 ? Math.round(done / total * 100) : 0;

  const grouped = useMemo(() => {
    const m = {};
    tasks.forEach(t => { if (!m[t.subject]) m[t.subject] = []; m[t.subject].push(t); });
    return m;
  }, [tasks]);

  return (
    <div className="max-w-3xl space-y-5">

      {/* Teacher bulk-add */}
      {role === 'teacher' && (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-gray-900">生徒への一斉宿題追加</h3>
            </div>
            <button onClick={() => setTOpen(o => !o)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                tOpen ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
              }`}
            >{tOpen ? '▲ 閉じる' : '▼ 開く'}</button>
          </div>
          {tOpen && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium">開始日</label>
                  <input type="date" value={tStart} onChange={e => setTStart(e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">終了日</label>
                  <input type="date" value={tEnd} onChange={e => setTEnd(e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select value={tSubj} onChange={e => setTSubj(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  {HW_SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <input value={tTxt} onChange={e => setTTxt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && bulkAdd()}
                  placeholder="宿題の内容..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <button onClick={bulkAdd}
                  className="flex items-center justify-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                  <Plus className="w-4 h-4" />一斉追加
                </button>
              </div>
              <p className="text-xs text-gray-400">選択期間の全日付に宿題が追加されます</p>
            </div>
          )}
        </div>
      )}

      {/* Date navigation */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-3">
        <button onClick={prev} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
        <div className="text-center">
          <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full mb-1.5 inline-block">宿題</span>
          <p className="font-bold text-gray-900 text-sm">{formatDateJP(date)}</p>
          {date === todayStr && <p className="text-xs text-teal-500 mt-0.5">今日</p>}
        </div>
        <button onClick={next} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
      </div>

      {/* Quick add */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-3">宿題を追加</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <select value={subj} onChange={e => setSubj(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
            {HW_SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <input value={txt} onChange={e => setTxt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="宿題の内容を入力... (Enterで追加)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={add}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors">
            <Plus className="w-4 h-4" />追加
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            宿題リスト
            {total > 0 && <span className="ml-2 text-xs font-normal text-gray-400">{done}/{total} 完了</span>}
          </h3>
          {total > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-teal-600 font-bold">{pct}%</span>
            </div>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">この日の宿題はありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([s, items], gi) => {
              const c = sc(gi);
              return (
                <div key={s}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.tx}`}>{s}</span>
                    <span className="text-xs text-gray-400">{items.filter(t => t.done).length}/{items.length}</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {items.map(t => (
                      <div key={t.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 group">
                        <button onClick={() => toggle(t.id)}
                          className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                            t.done ? 'bg-teal-500 border-teal-500' : 'border-gray-300 hover:border-teal-400'
                          }`}>
                          {t.done && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{t.title}</span>
                        {t.fromTeacher && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">先生</span>
                        )}
                        <button onClick={() => del(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 rounded transition-opacity">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MockExView ──────────────────────────────────────────── */

function MockExView({ mockex, setMockex }) {
  const todayStr = toDateStr(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', date:'', organizer:'', deadline:'', note:'' });
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const add = () => {
    if (!form.name || !form.date) return;
    setMockex(p => [...p, { id: uid(), ...form }]);
    setForm({ name:'', date:'', organizer:'', deadline:'', note:'' });
    setShowForm(false);
  };
  const del = id => setMockex(p => p.filter(e => e.id !== id));

  const sorted   = useMemo(() => [...mockex].sort((a, b) => a.date.localeCompare(b.date)), [mockex]);
  const upcoming = sorted.filter(e => e.date >= todayStr);
  const past     = sorted.filter(e => e.date <  todayStr);

  return (
    <div className="max-w-3xl space-y-5">

      {/* Next exam countdown */}
      {upcoming[0] && (() => {
        const d = daysUntil(upcoming[0].date);
        const dl = upcoming[0].deadline ? daysUntil(upcoming[0].deadline) : null;
        return (
          <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">次の模試</span>
                <p className="font-bold text-gray-900 mt-2 text-lg">{upcoming[0].name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{formatDateJP(upcoming[0].date)}</p>
                {upcoming[0].organizer && <p className="text-xs text-gray-400 mt-0.5">主催：{upcoming[0].organizer}</p>}
                {upcoming[0].deadline && (
                  <p className={`text-xs mt-1 font-medium ${dl !== null && dl <= 7 ? 'text-red-500' : 'text-gray-500'}`}>
                    申込締切：{formatDateJP(upcoming[0].deadline)}{dl !== null && dl >= 0 && ` (あと${dl}日)`}
                  </p>
                )}
              </div>
              {d !== null && (
                <div className={`text-center px-6 py-4 rounded-xl shrink-0 ${d <= 7 ? 'bg-red-50' : d <= 30 ? 'bg-amber-50' : 'bg-primary-50'}`}>
                  <div className={`text-4xl font-black ${d <= 7 ? 'text-red-600' : d <= 30 ? 'text-amber-600' : 'text-primary-600'}`}>{d}</div>
                  <div className="text-xs text-gray-500 mt-1">日後</div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Header + add button */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">模試スケジュール</h3>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />模試を追加
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5 space-y-3">
          <h4 className="font-bold text-gray-900">模試を追加</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 font-medium">模試名 *</label>
              <input value={form.name} onChange={e => setF('name', e.target.value)}
                placeholder="例：第1回全統記述模試"
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">試験日 *</label>
              <input type="date" value={form.date} onChange={e => setF('date', e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">主催</label>
              <input value={form.organizer} onChange={e => setF('organizer', e.target.value)}
                placeholder="例：河合塾"
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">申込締切</label>
              <input type="date" value={form.deadline} onChange={e => setF('deadline', e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">メモ（会場・科目など）</label>
              <input value={form.note} onChange={e => setF('note', e.target.value)}
                placeholder="例：○○会場、英数国"
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200">キャンセル</button>
            <button onClick={add} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700">追加</button>
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">今後の模試</p>
          {upcoming.map(e => <MockExCard key={e.id} exam={e} onDelete={del} />)}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">過去の模試</p>
          {past.map(e => <MockExCard key={e.id} exam={e} onDelete={del} past />)}
        </div>
      )}

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>模試の予定がありません</p>
          <p className="text-xs mt-1">「模試を追加」ボタンから登録しましょう</p>
        </div>
      )}
    </div>
  );
}

function MockExCard({ exam, onDelete, past = false }) {
  const days = daysUntil(exam.date);
  const dlDays = exam.deadline ? daysUntil(exam.deadline) : null;

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 ${past ? 'opacity-60 border-gray-100' : 'border-gray-100'}`}>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm">{exam.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatDateJP(exam.date)}</p>
        {exam.organizer && <p className="text-xs text-gray-400 mt-0.5">主催：{exam.organizer}</p>}
        {exam.deadline && (
          <p className={`text-xs mt-0.5 ${dlDays !== null && dlDays >= 0 && dlDays <= 7 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            申込締切：{formatDateJP(exam.deadline)}
            {dlDays !== null && dlDays >= 0 && dlDays <= 14 && ` (あと${dlDays}日)`}
          </p>
        )}
        {exam.note && <p className="text-xs text-gray-400 mt-0.5">{exam.note}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {!past && days !== null && days >= 0 && (
          <div className="text-center">
            <div className={`text-xl font-black ${days <= 7 ? 'text-red-600' : days <= 30 ? 'text-amber-600' : 'text-primary-600'}`}>{days}</div>
            <div className="text-xs text-gray-400">日後</div>
          </div>
        )}
        {past && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">終了</span>}
        <button onClick={() => onDelete(exam.id)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
