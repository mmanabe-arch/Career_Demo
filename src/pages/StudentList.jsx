import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, GraduationCap, BookOpen, BarChart2, MessageCircle,
  TrendingUp, ChevronUp, ChevronDown, Filter, X,
} from 'lucide-react';
import { studentList, gradeList, streamList } from '../data/students';

// ===================== Subject Config =====================
const SUBJECTS = [
  { key: 'japanese', label: '国語', color: '#16a34a' },
  { key: 'math',     label: '数学', color: '#2563eb' },
  { key: 'english',  label: '英語', color: '#9333ea' },
  { key: 'science',  label: '理科', color: '#ea580c' },
  { key: 'social',   label: '社会', color: '#ca8a04' },
];

const STREAM_BADGE = {
  '理系': 'bg-blue-100 text-blue-700',
  '文系': 'bg-purple-100 text-purple-700',
  '未定': 'bg-gray-100 text-gray-500',
};

const JUDGMENT_STYLE = {
  A: { bg: 'bg-green-100', text: 'text-green-700', label: 'A判定' },
  B: { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'B判定' },
  C: { bg: 'bg-yellow-100',text: 'text-yellow-700',label: 'C判定' },
  D: { bg: 'bg-orange-100',text: 'text-orange-700',label: 'D判定' },
  E: { bg: 'bg-red-100',   text: 'text-red-600',   label: 'E判定' },
};

// Heat color for deviation values (偏差値)
function deviationColor(v) {
  if (v === null || v === undefined) return '#f3f4f6';
  if (v >= 70) return '#16a34a';
  if (v >= 65) return '#4ade80';
  if (v >= 60) return '#fbbf24';
  if (v >= 55) return '#fb923c';
  return '#f87171';
}
function deviationTextColor(v) {
  if (v === null || v === undefined) return '#9ca3af';
  if (v >= 65) return '#fff';
  return '#374151';
}

// Score badge color for regular exams
function scoreBadge(v) {
  if (v === null || v === undefined) return 'bg-gray-100 text-gray-400';
  if (v >= 90) return 'bg-green-100 text-green-700';
  if (v >= 75) return 'bg-blue-100 text-blue-700';
  if (v >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-600';
}

// ===================== Main Component =====================

export default function StudentList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // URL query param: ?id=1 to open a specific student
  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) {
      const id = parseInt(paramId);
      if (studentList.find(s => s.id === id)) {
        setSelectedId(id);
      }
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return studentList.filter(s => {
      if (filterGrade && s.grade !== filterGrade) return false;
      if (filterStream && s.stream !== filterStream) return false;
      if (search) {
        const q = search.toLowerCase();
        const hit =
          s.name.includes(search) ||
          s.nameKana.includes(q) ||
          s.targetUniversity.includes(search) ||
          s.targetFaculty.includes(search) ||
          s.club.includes(search) ||
          s.interests.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [search, filterGrade, filterStream]);

  const selected = studentList.find(s => s.id === selectedId);

  const tabs = [
    { key: 'profile', label: '基本情報',   icon: GraduationCap },
    { key: 'regular', label: '定期テスト', icon: BookOpen },
    { key: 'mock',    label: '模試成績',   icon: BarChart2 },
    { key: 'chat',    label: 'チャット',   icon: MessageCircle },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">生徒情報</h1>
        <p className="text-gray-500 text-sm mt-1">在校生の登録情報・成績を閲覧できます</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Left: Student List ── */}
        <div className="lg:col-span-2">
          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="名前・大学・部活・興味で検索..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={filterGrade}
                onChange={e => setFilterGrade(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">全学年</option>
                {gradeList.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select
                value={filterStream}
                onChange={e => setFilterStream(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">文理全て</option>
                {streamList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Student Cards */}
          <div className="space-y-2">
            {filtered.map(s => {
              const latestMock = s.mockExams?.at(-1);
              return (
                <div
                  key={s.id}
                  onClick={() => { setSelectedId(s.id); setActiveTab('profile'); }}
                  className={`bg-white rounded-xl border cursor-pointer transition-all p-4 ${
                    selectedId === s.id
                      ? 'border-primary-400 shadow-md ring-1 ring-primary-200'
                      : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${STREAM_BADGE[s.stream]}`}>{s.stream}</span>
                        <span className="text-xs text-gray-400 shrink-0">{s.grade}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {s.targetUniversity} {s.targetFaculty}
                      </p>
                      {latestMock && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-xs text-gray-400">最新模試:</span>
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{ background: deviationColor(latestMock.deviation.total), color: deviationTextColor(latestMock.deviation.total) }}
                          >
                            {latestMock.deviation.total}
                          </span>
                          {latestMock.judgment && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${JUDGMENT_STYLE[latestMock.judgment]?.bg ?? ''} ${JUDGMENT_STYLE[latestMock.judgment]?.text ?? ''}`}>
                              {latestMock.judgment}判定
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">該当する生徒がいません</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Detail ── */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-5 border-b border-sky-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {selected.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                      <span className="text-sm text-gray-400">{selected.nameKana}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="font-medium text-gray-700">{selected.grade} {selected.class}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STREAM_BADGE[selected.stream]}`}>{selected.stream}</span>
                      <span className="text-gray-500">{selected.club}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === 'chat') navigate(`/alumni-chat`);
                      else setActiveTab(key);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === key && key !== 'chat'
                        ? 'border-primary-600 text-primary-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-5">
                {activeTab === 'profile' && <ProfileTab student={selected} />}
                {activeTab === 'regular' && <RegularExamTab student={selected} />}
                {activeTab === 'mock'    && <MockExamTab    student={selected} />}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center py-24 text-gray-300">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">生徒を選択してください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== Profile Tab =====================

function ProfileTab({ student }) {
  return (
    <div className="space-y-5">
      {/* 基本情報 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">基本情報</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '学年',     value: student.grade },
            { label: '組',       value: student.class },
            { label: '文理',     value: student.stream },
            { label: '部活・活動', value: student.club },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 志望先 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">志望先</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-base font-bold text-gray-900">{student.targetUniversity}</p>
          <p className="text-sm text-gray-600 mt-0.5">{student.targetFaculty}</p>
          {student.targetDepartment && (
            <p className="text-xs text-gray-400 mt-0.5">{student.targetDepartment}</p>
          )}
        </div>
      </div>

      {/* 興味・関心 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">興味・関心</h3>
        <div className="flex flex-wrap gap-1.5">
          {student.interests.split('・').map(i => (
            <span key={i} className="text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full">{i}</span>
          ))}
        </div>
      </div>

      {/* 教師メモ */}
      {student.note && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">メモ</h3>
          <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl p-3 leading-relaxed">{student.note}</p>
        </div>
      )}
    </div>
  );
}

// ===================== Regular Exam Tab =====================

function RegularExamTab({ student }) {
  const exams = student.regularExams ?? [];
  if (exams.length === 0) {
    return <EmptyState message="定期テストのデータがありません" />;
  }

  // Subjects that have at least one score
  const activeSubjects = SUBJECTS.filter(s =>
    exams.some(e => e.scores[s.key] !== null && e.scores[s.key] !== undefined)
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">定期テスト成績（点/100）</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500 w-28">テスト名</th>
                {activeSubjects.map(s => (
                  <th key={s.key} className="px-2 py-2 text-xs font-medium text-gray-500 text-center"
                    style={{ color: s.color }}>{s.label}</th>
                ))}
                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center">平均</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, i) => {
                const vals = activeSubjects.map(s => exam.scores[s.key]).filter(v => v != null);
                const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
                return (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 text-xs text-gray-600 whitespace-nowrap">
                      <div>{exam.name}</div>
                      <div className="text-gray-400">{exam.date}</div>
                    </td>
                    {activeSubjects.map(s => {
                      const v = exam.scores[s.key];
                      return (
                        <td key={s.key} className="px-1 py-2">
                          {v != null ? (
                            <div className={`text-center text-xs font-semibold py-1 rounded ${scoreBadge(v)}`}>
                              {v}
                            </div>
                          ) : (
                            <div className="text-center text-xs text-gray-300">―</div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-1 py-2">
                      {avg != null ? (
                        <div className={`text-center text-xs font-bold py-1 rounded ${scoreBadge(avg)}`}>{avg}</div>
                      ) : (
                        <div className="text-center text-xs text-gray-300">―</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        {[
          { range: '90点〜', cls: 'bg-green-100 text-green-700' },
          { range: '75〜89', cls: 'bg-blue-100 text-blue-700' },
          { range: '60〜74', cls: 'bg-yellow-100 text-yellow-700' },
          { range: '〜59', cls: 'bg-red-100 text-red-600' },
        ].map(({ range, cls }) => (
          <div key={range} className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{range}</span>
          </div>
        ))}
      </div>

      {/* Subject trend per exam */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">科目別推移</h3>
        <div className="space-y-2">
          {activeSubjects.map(subj => {
            const vals = exams.map(e => e.scores[subj.key]);
            const latestVal = vals.filter(v => v != null).at(-1);
            const firstVal  = vals.filter(v => v != null)[0];
            const diff = latestVal != null && firstVal != null ? latestVal - firstVal : null;
            return (
              <div key={subj.key} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8 shrink-0 text-right">{subj.label}</span>
                <div className="flex gap-1 flex-1">
                  {vals.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 h-6 rounded text-center text-xs font-medium flex items-center justify-center"
                      style={{
                        background: v != null ? subj.color + '30' : '#f3f4f6',
                        color: v != null ? subj.color : '#d1d5db',
                        border: `1px solid ${v != null ? subj.color + '50' : '#e5e7eb'}`,
                      }}
                    >
                      {v ?? '―'}
                    </div>
                  ))}
                </div>
                {diff != null && (
                  <div className={`flex items-center gap-0.5 text-xs font-bold w-12 justify-end shrink-0 ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {diff >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {Math.abs(diff)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== Mock Exam Tab =====================

function MockExamTab({ student }) {
  const exams = student.mockExams ?? [];
  if (exams.length === 0) {
    return <EmptyState message="模試のデータがありません" />;
  }

  const activeSubjects = SUBJECTS.filter(s =>
    exams.some(e => e.deviation[s.key] != null)
  );

  // SVG chart for total deviation trend
  const totalVals = exams.map(e => e.deviation.total).filter(v => v != null);
  const chartW = 380, chartH = 120, padL = 30, padR = 10, padT = 15, padB = 25;
  const minV = Math.max(40, Math.min(...totalVals) - 5);
  const maxV = Math.min(90, Math.max(...totalVals) + 5);
  const toX = (i) => padL + (i / (exams.length - 1 || 1)) * (chartW - padL - padR);
  const toY = (v) => padT + (1 - (v - minV) / (maxV - minV)) * (chartH - padT - padB);

  return (
    <div className="space-y-5">
      {/* Deviation Heatmap Table */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">偏差値ヒートマップ</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500 w-32">模試名</th>
                {activeSubjects.map(s => (
                  <th key={s.key} className="px-1 py-2 text-xs font-medium text-center"
                    style={{ color: s.color }}>{s.label}</th>
                ))}
                <th className="px-1 py-2 text-xs font-medium text-gray-500 text-center">総合</th>
                <th className="px-1 py-2 text-xs font-medium text-gray-500 text-center">判定</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 pr-3 text-xs text-gray-600 whitespace-nowrap">
                    <div className="font-medium">{exam.name}</div>
                    <div className="text-gray-400">{exam.date}</div>
                  </td>
                  {activeSubjects.map(s => {
                    const v = exam.deviation[s.key];
                    return (
                      <td key={s.key} className="px-0.5 py-1.5">
                        <div
                          className="text-center text-xs font-bold py-1 rounded mx-0.5"
                          style={{
                            background: deviationColor(v),
                            color: deviationTextColor(v),
                          }}
                        >
                          {v ?? '―'}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-0.5 py-1.5">
                    <div
                      className="text-center text-xs font-bold py-1 rounded mx-0.5"
                      style={{
                        background: deviationColor(exam.deviation.total),
                        color: deviationTextColor(exam.deviation.total),
                      }}
                    >
                      {exam.deviation.total ?? '―'}
                    </div>
                  </td>
                  <td className="px-1 py-1.5">
                    {exam.judgment ? (
                      <div className={`text-center text-xs font-bold py-1 rounded ${JUDGMENT_STYLE[exam.judgment]?.bg ?? ''} ${JUDGMENT_STYLE[exam.judgment]?.text ?? ''}`}>
                        {exam.judgment}
                      </div>
                    ) : <div className="text-center text-xs text-gray-300">―</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deviation Legend */}
        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
          {[
            { range: '70以上', color: '#16a34a' },
            { range: '65〜69', color: '#4ade80' },
            { range: '60〜64', color: '#fbbf24' },
            { range: '55〜59', color: '#fb923c' },
            { range: '54以下', color: '#f87171' },
          ].map(({ range, color }) => (
            <div key={range} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: color }} />
              <span>{range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total deviation trend chart */}
      {exams.length >= 2 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">総合偏差値推移</h3>
          <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
            <svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-sm">
              {/* Grid lines */}
              {[minV, Math.round((minV + maxV) / 2), maxV].map(v => (
                <g key={v}>
                  <line x1={padL} x2={chartW - padR} y1={toY(v)} y2={toY(v)}
                    stroke="#e5e7eb" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={padL - 4} y={toY(v) + 3} textAnchor="end" fontSize={8} fill="#9ca3af">{v}</text>
                </g>
              ))}
              {/* Line */}
              {exams.length >= 2 && (
                <path
                  d={exams.map((e, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(e.deviation.total)}`).join(' ')}
                  stroke="#2563eb" strokeWidth={2.5} fill="none" strokeLinejoin="round"
                />
              )}
              {/* Dots */}
              {exams.map((e, i) => (
                <circle key={i} cx={toX(i)} cy={toY(e.deviation.total)} r={4} fill="#2563eb" />
              ))}
              {/* Score labels */}
              {exams.map((e, i) => (
                <text key={i} x={toX(i)} y={toY(e.deviation.total) - 6}
                  textAnchor="middle" fontSize={9} fill="#1d4ed8" fontWeight="bold">
                  {e.deviation.total}
                </text>
              ))}
              {/* X labels */}
              {exams.map((e, i) => (
                <text key={i} x={toX(i)} y={chartH - 6}
                  textAnchor="middle" fontSize={7} fill="#9ca3af">
                  {e.date.slice(5)}
                </text>
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Subject deviation comparison (latest exam) */}
      {exams.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            科目別偏差値（最新: {exams.at(-1).name}）
          </h3>
          <div className="space-y-2.5">
            {activeSubjects.map(subj => {
              const val = exams.at(-1).deviation[subj.key];
              if (val == null) return null;
              const pct = Math.min(100, Math.max(0, ((val - 40) / 40) * 100));
              return (
                <div key={subj.key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8 text-right shrink-0">{subj.label}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${pct}%`, background: deviationColor(val) }}>
                      <span className="text-xs font-bold" style={{ color: deviationTextColor(val) }}>{val}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
