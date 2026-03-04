import { useState, useEffect, useMemo } from 'react';
import {
  Target, Plus, Trash2, ChevronDown, ChevronRight, ChevronLeft,
  BarChart2, BookOpen, Calendar, Edit3, Check, RotateCcw, Map,
  Trophy, ClipboardList, X,
} from 'lucide-react';

// ================================================================
//  Utilities
// ================================================================

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function getISOWeek(date) {
  const d = new Date(date.valueOf());
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function getWeekMonday(year, week) {
  const jan1 = new Date(year, 0, 1);
  const jan1Day = jan1.getDay() || 7;
  const daysToFirstMonday = jan1Day <= 4 ? 1 - jan1Day : 8 - jan1Day;
  const firstMonday = new Date(year, 0, 1 + daysToFirstMonday);
  const monday = new Date(firstMonday);
  monday.setDate(firstMonday.getDate() + (week - 1) * 7);
  return monday;
}

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateJP(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dow = '日月火水木金土'[d.getDay()];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${dow}）`;
}

const MONTHS_JP = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

function calcProgress(tasks = []) {
  const all = flatTasks(tasks);
  if (!all.length) return null;
  return Math.round(all.filter(t => t.done).length / all.length * 100);
}

function flatTasks(tasks = []) {
  return tasks.flatMap(t => [t, ...flatTasks(t.children)]);
}

function updateTaskNode(tasks, id, fn) {
  return tasks.map(t =>
    t.id === id ? fn(t) : { ...t, children: updateTaskNode(t.children || [], id, fn) }
  );
}

function deleteTaskNode(tasks, id) {
  return tasks
    .filter(t => t.id !== id)
    .map(t => ({ ...t, children: deleteTaskNode(t.children || [], id) }));
}

function addChildNode(tasks, parentId) {
  return tasks.map(t => {
    if (t.id === parentId) {
      return { ...t, children: [...(t.children || []), { id: uid(), title: '', done: false, children: [] }] };
    }
    return { ...t, children: addChildNode(t.children || [], parentId) };
  });
}

// ================================================================
//  Storage
// ================================================================

const STORAGE_KEY      = 'career-goals-v1';
const EXAM_STORAGE_KEY = 'career-exams-v1';
const HW_STORAGE_KEY   = 'career-homework-v1';

function loadGoals() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function loadExams() {
  try { return JSON.parse(localStorage.getItem(EXAM_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function loadHomework() {
  try { return JSON.parse(localStorage.getItem(HW_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

// ================================================================
//  Constants
// ================================================================

const DEFAULT_SUBJECTS = ['国語', '数学', '英語', '理科', '社会'];
const HW_SUBJECTS = ['国語', '数学', '英語', '理科', '社会', '体育', '音楽', '美術', '技家', 'その他'];

const PRESET_EXAMS = [
  { id: '1st-mid',   label: '1学期 中間テスト' },
  { id: '1st-final', label: '1学期 期末テスト' },
  { id: '2nd-mid',   label: '2学期 中間テスト' },
  { id: '2nd-final', label: '2学期 期末テスト' },
  { id: 'year-end',  label: '学年末テスト' },
];

const SUBJECT_COLORS = [
  { bg: 'bg-blue-100',   text: 'text-blue-700' },
  { bg: 'bg-green-100',  text: 'text-green-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-pink-100',   text: 'text-pink-700' },
  { bg: 'bg-teal-100',   text: 'text-teal-700' },
  { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { bg: 'bg-red-100',    text: 'text-red-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-cyan-100',   text: 'text-cyan-700' },
];

function getSubjectColor(index) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

// ================================================================
//  Empty data factories
// ================================================================

function emptyGoal() {
  return { title: '', description: '', tasks: [], reflection: '', reflectionDate: '' };
}

function emptyExam() {
  return {
    goal: '',
    description: '',
    subjects: DEFAULT_SUBJECTS.map(name => ({ id: uid(), name, current: '', target: '' })),
    tasks: [],
    reflection: '',
    reflectionDate: '',
  };
}

// ================================================================
//  Tab config
// ================================================================

const TABS = [
  { key: 'yearly',     label: '年次',       icon: Target },
  { key: 'monthly',   label: '月次',       icon: Calendar },
  { key: 'weekly',    label: '週次',       icon: BarChart2 },
  { key: 'exam',      label: '定期テスト',  icon: Trophy },
  { key: 'homework',  label: '宿題',       icon: ClipboardList },
  { key: 'overview',  label: '全体MAP',    icon: Map },
  { key: 'reflection',label: '振り返り',    icon: RotateCcw },
];

const TYPE_STYLE = {
  yearly:  { label: '年次目標',  badge: 'bg-green-100 text-green-700',   ring: 'ring-green-300',  bar: '#16a34a' },
  monthly: { label: '月次目標',  badge: 'bg-blue-100 text-blue-700',     ring: 'ring-blue-300',   bar: '#2563eb' },
  weekly:  { label: '週次目標',  badge: 'bg-purple-100 text-purple-700', ring: 'ring-purple-300', bar: '#7c3aed' },
};

const DEPTH_STYLE = [
  { indent: '',      line: '',                                            dot: 'bg-primary-500' },
  { indent: 'ml-6', line: 'border-l-2 border-primary-200 pl-3',         dot: 'bg-blue-400' },
  { indent: 'ml-6', line: 'border-l-2 border-dashed border-gray-300 pl-3', dot: 'bg-purple-400' },
];

// ================================================================
//  Main Page
// ================================================================

export default function GoalManagement() {
  const today = new Date();
  const [tab, setTab] = useState('yearly');
  const [goals,    setGoals]    = useState(loadGoals);
  const [exams,    setExams]    = useState(loadExams);
  const [homework, setHomework] = useState(loadHomework);
  const [selYear,  setSelYear]  = useState(today.getFullYear());
  const [selMonth, setSelMonth] = useState(today.getMonth() + 1);
  const [selWeek,  setSelWeek]  = useState(getISOWeek(today));

  useEffect(() => { localStorage.setItem(STORAGE_KEY,      JSON.stringify(goals));    }, [goals]);
  useEffect(() => { localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exams));    }, [exams]);
  useEffect(() => { localStorage.setItem(HW_STORAGE_KEY,   JSON.stringify(homework)); }, [homework]);

  const yearKey  = String(selYear);
  const monthKey = `${selYear}-${selMonth}`;
  const weekKey  = `${selYear}-W${selWeek}`;

  const getGoal = (key) => goals[key] ?? emptyGoal();
  const setGoal = (key, data) => setGoals(prev => ({ ...prev, [key]: data }));

  const weekMonday = getWeekMonday(selYear, selWeek);
  const weekSunday = new Date(weekMonday); weekSunday.setDate(weekMonday.getDate() + 6);
  const weekLabel  = `${weekMonday.getMonth() + 1}/${weekMonday.getDate()} 〜 ${weekSunday.getMonth() + 1}/${weekSunday.getDate()}`;

  const prevMonth = () => selMonth === 1  ? (setSelMonth(12), setSelYear(y => y - 1)) : setSelMonth(m => m - 1);
  const nextMonth = () => selMonth === 12 ? (setSelMonth(1),  setSelYear(y => y + 1)) : setSelMonth(m => m + 1);
  const prevWeek  = () => selWeek === 1   ? (setSelWeek(52),  setSelYear(y => y - 1)) : setSelWeek(w => w - 1);
  const nextWeek  = () => selWeek === 52  ? (setSelWeek(1),   setSelYear(y => y + 1)) : setSelWeek(w => w + 1);

  const props = { getGoal, setGoal };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">目標管理</h1>
        <p className="text-gray-500 text-sm mt-1">年次・月次・週次の目標とタスクを設定・振り返りましょう</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === key ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'yearly' && (
        <GoalView
          type="yearly"
          goalKey={yearKey}
          periodLabel={`${selYear}年`}
          onPrev={() => setSelYear(y => y - 1)}
          onNext={() => setSelYear(y => y + 1)}
          {...props}
        />
      )}
      {tab === 'monthly' && (
        <GoalView
          type="monthly"
          goalKey={monthKey}
          periodLabel={`${selYear}年 ${MONTHS_JP[selMonth - 1]}`}
          parentLabel={getGoal(yearKey).title ? `年次目標：${getGoal(yearKey).title}` : null}
          onPrev={prevMonth}
          onNext={nextMonth}
          {...props}
        />
      )}
      {tab === 'weekly' && (
        <GoalView
          type="weekly"
          goalKey={weekKey}
          periodLabel={`${selYear}年 第${selWeek}週（${weekLabel}）`}
          parentLabel={getGoal(monthKey).title ? `月次目標：${getGoal(monthKey).title}` : null}
          onPrev={prevWeek}
          onNext={nextWeek}
          {...props}
        />
      )}
      {tab === 'exam' && (
        <ExamView exams={exams} setExams={setExams} />
      )}
      {tab === 'homework' && (
        <HomeworkView homework={homework} setHomework={setHomework} />
      )}
      {tab === 'overview' && (
        <OverviewMap
          goals={goals}
          selYear={selYear}
          onSelectYear={setSelYear}
          onNavigate={(t, month, week) => {
            if (month) setSelMonth(month);
            if (week)  setSelWeek(week);
            setTab(t);
          }}
        />
      )}
      {tab === 'reflection' && (
        <ReflectionView
          goals={goals}
          onGoalChange={(key, g) => setGoal(key, g)}
        />
      )}
    </div>
  );
}

// ================================================================
//  GoalView  (shared by yearly / monthly / weekly tabs)
// ================================================================

function GoalView({ type, goalKey, periodLabel, parentLabel, onPrev, onNext, getGoal, setGoal }) {
  const goal = getGoal(goalKey);
  const ts   = TYPE_STYLE[type];
  const [editTitle,   setEditTitle]   = useState(false);
  const [editDesc,    setEditDesc]    = useState(false);
  const [editReflect, setEditReflect] = useState(false);

  const update      = (field, val) => setGoal(goalKey, { ...goal, [field]: val });
  const updateTasks = (tasks)      => setGoal(goalKey, { ...goal, tasks });
  const progress    = calcProgress(goal.tasks);

  const addTask = () => {
    updateTasks([...goal.tasks, { id: uid(), title: '新しいタスク', done: false, children: [] }]);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Period Selector */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
        <button onClick={onPrev} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1.5 inline-block ${ts.badge}`}>{ts.label}</span>
          <p className="font-bold text-gray-900 text-sm">{periodLabel}</p>
          {parentLabel && <p className="text-xs text-gray-400 mt-0.5">{parentLabel}</p>}
        </div>
        <button onClick={onNext} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Goal Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">目標</label>
          {editTitle ? (
            <div className="flex gap-2 mt-1">
              <input
                className="flex-1 border border-primary-300 rounded-lg px-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={goal.title}
                onChange={e => update('title', e.target.value)}
                placeholder="目標を入力..."
                autoFocus
                onBlur={() => setEditTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setEditTitle(false)}
              />
              <button onClick={() => setEditTitle(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Check className="w-4 h-4 text-primary-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1 group cursor-pointer" onClick={() => setEditTitle(true)}>
              {goal.title
                ? <h2 className="text-xl font-bold text-gray-900 flex-1">{goal.title}</h2>
                : <p className="text-gray-400 text-base flex-1 italic">クリックして目標を入力...</p>
              }
              <Edit3 className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">詳細・背景</label>
          {editDesc ? (
            <textarea
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              value={goal.description}
              onChange={e => update('description', e.target.value)}
              placeholder="目標の背景・理由・具体的な姿を記入..."
              rows={3}
              autoFocus
              onBlur={() => setEditDesc(false)}
            />
          ) : (
            <div className="group cursor-pointer mt-1" onClick={() => setEditDesc(true)}>
              {goal.description
                ? <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{goal.description}</p>
                : <p className="text-sm text-gray-300 italic">+ 詳細・背景を追加...</p>
              }
            </div>
          )}
        </div>

        {progress !== null && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">タスク達成率</span>
              <span className="font-bold" style={{ color: ts.bar }}>{progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: ts.bar }} />
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">タスク <span className="text-xs font-normal text-gray-400">（最大3階層）</span></h3>
          <button
            onClick={addTask}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            追加
          </button>
        </div>

        {goal.tasks.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">タスクを追加して目標を分解しましょう</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {goal.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                depth={0}
                maxDepth={2}
                onUpdate={(id, fn) => updateTasks(updateTaskNode(goal.tasks, id, fn))}
                onDelete={(id)     => updateTasks(deleteTaskNode(goal.tasks, id))}
                onAddChild={(pid)  => updateTasks(addChildNode(goal.tasks, pid))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reflection */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-gray-900">振り返り</h3>
        </div>
        {editReflect ? (
          <div className="space-y-2">
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              value={goal.reflection}
              onChange={e => update('reflection', e.target.value)}
              placeholder={"この期間を振り返って...\n\n・うまくいったこと\n・改善したいこと\n・次のアクション"}
              rows={5}
              autoFocus
            />
            <button
              onClick={() => {
                update('reflectionDate', new Date().toLocaleDateString('ja-JP'));
                setEditReflect(false);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              保存
            </button>
          </div>
        ) : goal.reflection ? (
          <div
            className="bg-amber-50 border border-amber-100 rounded-xl p-4 cursor-pointer hover:bg-amber-100 transition-colors"
            onClick={() => setEditReflect(true)}
          >
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{goal.reflection}</p>
            {goal.reflectionDate && <p className="text-xs text-gray-400 mt-2">{goal.reflectionDate} 記録</p>}
          </div>
        ) : (
          <button
            onClick={() => setEditReflect(true)}
            className="text-sm text-gray-300 italic hover:text-amber-500 transition-colors"
          >
            + 振り返りを記録する...
          </button>
        )}
      </div>
    </div>
  );
}

// ================================================================
//  TaskItem  (recursive, max depth 3 = 0/1/2)
// ================================================================

function TaskItem({ task, depth, maxDepth, onUpdate, onDelete, onAddChild }) {
  const [expanded, setExpanded] = useState(true);
  const [editing,  setEditing]  = useState(task.title === '');
  const hasChildren = (task.children?.length ?? 0) > 0;
  const ds = DEPTH_STYLE[depth] || DEPTH_STYLE[2];

  return (
    <div className={depth > 0 ? `${ds.indent} ${ds.line} mt-0.5` : ''}>
      <div className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 group">
        <button
          onClick={() => setExpanded(e => !e)}
          className={`w-4 h-4 shrink-0 text-gray-300 ${hasChildren ? 'hover:text-gray-600' : 'opacity-0 pointer-events-none'}`}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onUpdate(task.id, t => ({ ...t, done: !t.done }))}
          className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
            task.done ? 'bg-primary-500 border-primary-500' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          {task.done && <Check className="w-3 h-3 text-white" />}
        </button>

        {editing ? (
          <input
            className="flex-1 text-sm border-b border-primary-300 focus:outline-none bg-transparent py-0.5"
            value={task.title}
            onChange={e => onUpdate(task.id, t => ({ ...t, title: e.target.value }))}
            onBlur={() => setEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setEditing(false); }}
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 text-sm cursor-text select-text ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}
            onClick={() => setEditing(true)}
          >
            {task.title || <span className="text-gray-300 italic">タスク名を入力</span>}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {depth < maxDepth && (
            <button
              title="サブタスクを追加"
              onClick={() => { onAddChild(task.id); setExpanded(true); }}
              className="p-1 text-gray-400 hover:text-primary-600 rounded"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-500 rounded">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="mt-0.5">
          {task.children.map(child => (
            <TaskItem
              key={child.id}
              task={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ================================================================
//  ExamView
// ================================================================

function ExamView({ exams, setExams }) {
  const [selExam, setSelExam] = useState('1st-mid');
  const exam     = exams[selExam] ?? emptyExam();
  const examName = PRESET_EXAMS.find(e => e.id === selExam)?.label ?? '';

  const update = (field, val) =>
    setExams(prev => ({ ...prev, [selExam]: { ...(prev[selExam] ?? emptyExam()), [field]: val } }));

  const updateTasks    = (tasks)    => update('tasks', tasks);
  const updateSubjects = (subjects) => update('subjects', subjects);

  const progress   = calcProgress(exam.tasks);
  const withTarget  = exam.subjects.filter(s => s.target  !== '');
  const withCurrent = exam.subjects.filter(s => s.current !== '');
  const avgTarget  = withTarget.length  > 0 ? Math.round(withTarget.reduce((s, x)  => s + Number(x.target),  0) / withTarget.length)  : null;
  const avgCurrent = withCurrent.length > 0 ? Math.round(withCurrent.reduce((s, x) => s + Number(x.current), 0) / withCurrent.length) : null;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Exam selector */}
      <div className="flex flex-wrap gap-2">
        {PRESET_EXAMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelExam(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              selExam === id
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-gray-900 text-lg">{examName}</h2>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">目標</label>
          <ExamInlineEdit
            value={exam.goal}
            onChange={v => update('goal', v)}
            placeholder="例：平均80点以上を取る"
            className="text-base font-bold text-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">メモ・作戦</label>
          <ExamInlineEdit
            value={exam.description}
            onChange={v => update('description', v)}
            placeholder="+ 勉強計画や重点科目を記入..."
            multiline
          />
        </div>

        {(avgCurrent !== null || avgTarget !== null || progress !== null) && (
          <div className="flex gap-6 pt-2 border-t border-gray-50">
            {avgCurrent !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{avgCurrent}<span className="text-sm text-gray-400 ml-0.5">点</span></div>
                <div className="text-xs text-gray-400">現在平均</div>
              </div>
            )}
            {avgTarget !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{avgTarget}<span className="text-sm text-orange-400 ml-0.5">点</span></div>
                <div className="text-xs text-gray-400">目標平均</div>
              </div>
            )}
            {avgCurrent !== null && avgTarget !== null && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${avgTarget - avgCurrent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {avgTarget - avgCurrent >= 0 ? '+' : ''}{avgTarget - avgCurrent}
                  <span className="text-sm ml-0.5">点</span>
                </div>
                <div className="text-xs text-gray-400">差</div>
              </div>
            )}
            {progress !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{progress}<span className="text-sm text-primary-400 ml-0.5">%</span></div>
                <div className="text-xs text-gray-400">準備完了</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject scores */}
      <SubjectScoresCard subjects={exam.subjects} onUpdate={updateSubjects} />

      {/* Prep tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            準備タスク
            {progress !== null && <span className="ml-2 text-xs font-normal text-gray-400">{progress}% 完了</span>}
          </h3>
          <button
            onClick={() => updateTasks([...exam.tasks, { id: uid(), title: '新しいタスク', done: false, children: [] }])}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            追加
          </button>
        </div>

        {progress !== null && (
          <div className="mb-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        {exam.tasks.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">テスト準備タスクを追加しましょう</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {exam.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                depth={0}
                maxDepth={2}
                onUpdate={(id, fn) => updateTasks(updateTaskNode(exam.tasks, id, fn))}
                onDelete={(id)     => updateTasks(deleteTaskNode(exam.tasks, id))}
                onAddChild={(pid)  => updateTasks(addChildNode(exam.tasks, pid))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExamInlineEdit({ value, onChange, placeholder, className = 'text-sm text-gray-700', multiline = false }) {
  const [editing, setEditing] = useState(false);
  const inputClass = 'w-full mt-1 border border-primary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400';

  if (editing) {
    return multiline ? (
      <textarea
        className={`${inputClass} resize-none`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        rows={3}
        autoFocus
      />
    ) : (
      <input
        className={inputClass}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => e.key === 'Enter' && setEditing(false)}
        autoFocus
      />
    );
  }

  return (
    <div className="group cursor-pointer mt-1" onClick={() => setEditing(true)}>
      {value
        ? <p className={className}>{value}</p>
        : <p className="text-sm text-gray-300 italic">{placeholder}</p>
      }
    </div>
  );
}

function SubjectScoresCard({ subjects, onUpdate }) {
  const [newName, setNewName] = useState('');

  const updateSubject = (id, field, val) =>
    onUpdate(subjects.map(s => s.id === id ? { ...s, [field]: val } : s));

  const addSubject = () => {
    const name = newName.trim();
    if (!name) return;
    onUpdate([...subjects, { id: uid(), name, current: '', target: '' }]);
    setNewName('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-4">科目別 得点目標</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-100">
              <th className="text-left pb-2 font-medium">科目</th>
              <th className="text-center pb-2 font-medium w-24">前回点数</th>
              <th className="text-center pb-2 font-medium w-24">目標点数</th>
              <th className="text-center pb-2 font-medium w-16">差</th>
              <th className="w-8 pb-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subjects.map((s, i) => {
              const diff = (s.target !== '' && s.current !== '') ? Number(s.target) - Number(s.current) : null;
              const color = getSubjectColor(i);
              return (
                <tr key={s.id} className="group">
                  <td className="py-2.5 pr-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${color.bg} ${color.text}`}>{s.name}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number" min="0" max="100"
                      value={s.current}
                      onChange={e => updateSubject(s.id, 'current', e.target.value)}
                      placeholder="—"
                      className="w-full text-center border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number" min="0" max="100"
                      value={s.target}
                      onChange={e => updateSubject(s.id, 'target', e.target.value)}
                      placeholder="—"
                      className="w-full text-center border border-orange-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-orange-700"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {diff !== null
                      ? <span className={`text-xs font-bold ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>{diff >= 0 ? '+' : ''}{diff}</span>
                      : <span className="text-gray-300">—</span>
                    }
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => onUpdate(subjects.filter(x => x.id !== s.id))}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 rounded transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSubject()}
          placeholder="科目を追加..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <button
          onClick={addSubject}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          追加
        </button>
      </div>
    </div>
  );
}

// ================================================================
//  HomeworkView
// ================================================================

function HomeworkView({ homework, setHomework }) {
  const today = new Date();
  const [selDate,    setSelDate]    = useState(toDateStr(today));
  const [newSubject, setNewSubject] = useState(HW_SUBJECTS[0]);
  const [newTitle,   setNewTitle]   = useState('');

  const tasks    = homework[selDate] ?? [];
  const setTasks = (newTasks) => setHomework(prev => ({ ...prev, [selDate]: newTasks }));

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    setTasks([...tasks, { id: uid(), subject: newSubject, title, done: false }]);
    setNewTitle('');
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const prevDay = () => { const d = new Date(selDate + 'T00:00:00'); d.setDate(d.getDate() - 1); setSelDate(toDateStr(d)); };
  const nextDay = () => { const d = new Date(selDate + 'T00:00:00'); d.setDate(d.getDate() + 1); setSelDate(toDateStr(d)); };

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = total > 0 ? Math.round(done / total * 100) : 0;

  const grouped = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!map[t.subject]) map[t.subject] = [];
      map[t.subject].push(t);
    });
    return map;
  }, [tasks]);

  const subjectKeys = Object.keys(grouped);

  return (
    <div className="max-w-3xl space-y-5">
      {/* Date navigation */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-3">
        <button onClick={prevDay} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full mb-1.5 inline-block">宿題</span>
          <p className="font-bold text-gray-900 text-sm">{formatDateJP(selDate)}</p>
          {selDate === toDateStr(today) && <p className="text-xs text-teal-500 mt-0.5">今日</p>}
        </div>
        <button onClick={nextDay} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Quick add */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-3">宿題を追加</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          >
            {HW_SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="宿題の内容を入力... (Enterで追加)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={addTask}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            追加
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
            <p className="text-xs text-gray-300 mt-1">上のフォームから追加しましょう</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjectKeys.map((subject, gi) => {
              const color = getSubjectColor(gi);
              const subjectTasks = grouped[subject];
              const subDone = subjectTasks.filter(t => t.done).length;
              return (
                <div key={subject}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>{subject}</span>
                    <span className="text-xs text-gray-400">{subDone}/{subjectTasks.length}</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {subjectTasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 group">
                        <button
                          onClick={() => toggleTask(t.id)}
                          className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                            t.done ? 'bg-teal-500 border-teal-500' : 'border-gray-300 hover:border-teal-400'
                          }`}
                        >
                          {t.done && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {t.title}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 rounded transition-opacity"
                        >
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

// ================================================================
//  Overview MAP
// ================================================================

function OverviewMap({ goals, selYear, onSelectYear, onNavigate }) {
  const yearKey  = String(selYear);
  const yearGoal = goals[yearKey];

  const monthData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month    = i + 1;
      const monthKey = `${selYear}-${month}`;
      const mGoal    = goals[monthKey];

      const weekKeys = Object.keys(goals).filter(k => {
        if (!k.startsWith(`${selYear}-W`)) return false;
        const week   = parseInt(k.split('-W')[1]);
        const monday = getWeekMonday(selYear, week);
        return monday.getMonth() + 1 === month;
      }).sort();

      return { month, monthKey, mGoal, weekKeys };
    });
  }, [goals, selYear]);

  const prog = (g) => g ? calcProgress(g.tasks) : null;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-3">
        <button onClick={() => onSelectYear(y => y - 1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <span className="font-bold text-gray-900">{selYear}年 全体MAP</span>
        <button onClick={() => onSelectYear(y => y + 1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div
        className="bg-white border-2 border-green-300 rounded-2xl p-4 cursor-pointer hover:border-green-500 transition-colors shadow-sm"
        onClick={() => onNavigate('yearly')}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">年次目標</span>
            <p className="font-bold text-gray-900 mt-1.5 text-sm">
              {yearGoal?.title || <span className="text-gray-400 italic">（未設定）</span>}
            </p>
            {yearGoal?.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{yearGoal.description}</p>}
          </div>
          {prog(yearGoal) !== null && (
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-green-600">{prog(yearGoal)}%</div>
              <div className="text-xs text-gray-400">達成率</div>
            </div>
          )}
        </div>
        {prog(yearGoal) !== null && (
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${prog(yearGoal)}%` }} />
          </div>
        )}
      </div>

      <div className="relative pl-6 border-l-2 border-gray-200 ml-4 space-y-3">
        {monthData.map(({ month, monthKey, mGoal, weekKeys }) => {
          const mp = prog(mGoal);
          return (
            <div key={month} className="relative">
              <div className="absolute -left-8 top-4 w-4 h-px bg-gray-300" />
              <div className="absolute -left-9 top-3 w-3 h-3 rounded-full bg-white border-2 border-gray-300" />

              <div
                className={`bg-white border rounded-xl p-3 cursor-pointer transition-colors ${
                  mGoal?.title ? 'border-blue-200 hover:border-blue-400' : 'border-gray-100 hover:border-gray-300'
                }`}
                onClick={() => onNavigate('monthly', month)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-blue-600">{MONTHS_JP[month - 1]}</span>
                    <p className="text-sm text-gray-800 mt-0.5">
                      {mGoal?.title || <span className="text-gray-400 italic text-xs">（未設定）</span>}
                    </p>
                  </div>
                  {mp !== null && <span className="text-sm font-bold text-blue-600 shrink-0">{mp}%</span>}
                </div>
                {mp !== null && (
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mp}%` }} />
                  </div>
                )}
              </div>

              {weekKeys.length > 0 && (
                <div className="pl-6 border-l border-dashed border-gray-200 ml-3 mt-2 space-y-1.5">
                  {weekKeys.map(wk => {
                    const week   = parseInt(wk.split('-W')[1]);
                    const wGoal  = goals[wk];
                    const wp     = prog(wGoal);
                    const monday = getWeekMonday(selYear, week);
                    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
                    return (
                      <div
                        key={wk}
                        className="bg-gray-50 border border-gray-100 hover:border-purple-300 rounded-lg p-2.5 cursor-pointer transition-colors"
                        onClick={() => onNavigate('weekly', month, week)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-purple-500">
                              第{week}週（{monday.getMonth() + 1}/{monday.getDate()}〜{sunday.getMonth() + 1}/{sunday.getDate()}）
                            </span>
                            <p className="text-xs text-gray-700 mt-0.5">
                              {wGoal?.title || <span className="text-gray-400 italic">（未設定）</span>}
                            </p>
                          </div>
                          {wp !== null && <span className="text-xs font-bold text-purple-500 shrink-0">{wp}%</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ================================================================
//  Reflection View
// ================================================================

function ReflectionView({ goals, onGoalChange }) {
  const [editKey, setEditKey]   = useState(null);
  const [editText, setEditText] = useState('');

  const entries = useMemo(() => {
    return Object.entries(goals)
      .filter(([, g]) => g.title)
      .map(([key, goal]) => {
        const isWeekly  = key.includes('-W');
        const isMonthly = !isWeekly && key.includes('-');
        const type = isWeekly ? 'weekly' : isMonthly ? 'monthly' : 'yearly';
        return { key, goal, type };
      })
      .sort((a, b) => {
        const order = { yearly: 0, monthly: 1, weekly: 2 };
        if (order[a.type] !== order[b.type]) return order[a.type] - order[b.type];
        return b.key.localeCompare(a.key);
      });
  }, [goals]);

  const periodLabel = (key) => {
    if (key.includes('-W')) {
      const [yearStr, weekStr] = key.split('-W');
      const week   = parseInt(weekStr);
      const monday = getWeekMonday(parseInt(yearStr), week);
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
      return `${yearStr}年 第${week}週（${monday.getMonth() + 1}/${monday.getDate()}〜${sunday.getMonth() + 1}/${sunday.getDate()}）`;
    }
    if (key.includes('-')) {
      const [year, month] = key.split('-');
      return `${year}年 ${MONTHS_JP[parseInt(month) - 1]}`;
    }
    return `${key}年`;
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
        <RotateCcw className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold text-amber-800 mb-0.5">振り返りの3点セット</p>
          <p className="text-amber-700 text-xs">① うまくいったこと　② 改善点・課題　③ 次のアクション</p>
        </div>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>まだ目標が登録されていません</p>
          <p className="text-xs mt-1">年次・月次・週次タブから目標を設定してください</p>
        </div>
      )}

      {entries.map(({ key, goal, type }) => {
        const ts   = TYPE_STYLE[type];
        const prog = calcProgress(goal.tasks);
        const isEditing = editKey === key;

        return (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ts.badge}`}>{ts.label}</span>
                  <span className="text-xs text-gray-400">{periodLabel(key)}</span>
                </div>
                <h3 className="font-bold text-gray-900">{goal.title}</h3>
                {goal.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{goal.description}</p>}
              </div>
              {prog !== null && (
                <div className="text-center shrink-0">
                  <div className="text-xl font-bold" style={{ color: ts.bar }}>{prog}%</div>
                  <div className="text-xs text-gray-400">達成率</div>
                </div>
              )}
            </div>

            {prog !== null && (
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full" style={{ width: `${prog}%`, background: ts.bar }} />
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">振り返り</p>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    placeholder={"この期間を振り返って...\n\n・うまくいったこと\n・改善したいこと\n・次のアクション"}
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onGoalChange(key, { ...goal, reflection: editText, reflectionDate: new Date().toLocaleDateString('ja-JP') });
                        setEditKey(null);
                      }}
                      className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditKey(null)}
                      className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : goal.reflection ? (
                <div
                  className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => { setEditKey(key); setEditText(goal.reflection); }}
                >
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{goal.reflection}</p>
                  {goal.reflectionDate && <p className="text-xs text-gray-400 mt-2">{goal.reflectionDate} 記録</p>}
                </div>
              ) : (
                <button
                  onClick={() => { setEditKey(key); setEditText(''); }}
                  className="text-sm text-gray-300 italic hover:text-amber-500 transition-colors"
                >
                  + 振り返りを記録する...
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
