import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target, TrendingUp, BookOpen, Users, Plus, Trash2,
  CheckCircle, Circle, Award, ChevronRight, RotateCcw,
} from 'lucide-react';
import { studentList } from '../data/students';

// ── 定数 ────────────────────────────────────────────────────────────────────
const SUBJECTS = ['国語', '数学', '英語', '理科', '社会'];

// Tailwind クラスはソース上にリテラルで存在する必要があるため個別定義
const STYLES = {
  国語: { hex: '#ef4444', bg: 'bg-red-50',     border: 'border-red-200',    text: 'text-red-700'    },
  数学: { hex: '#3b82f6', bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700'   },
  英語: { hex: '#22c55e', bg: 'bg-green-50',   border: 'border-green-200',  text: 'text-green-700'  },
  理科: { hex: '#a855f7', bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700' },
  社会: { hex: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700'  },
};

// ── 志望大学ベンチマーク ─────────────────────────────────────────────────────
const UNIVERSITIES = [
  '東京大学 理学部',
  '東京大学 工学部',
  '京都大学 理学部',
  '京都大学 工学部',
  '大阪大学 経済学部',
  '慶應義塾大学 法学部',
];

const BENCHMARKS = {
  '東京大学 理学部': {
    targets: { 国語: 88, 数学: 96, 英語: 90, 理科: 94, 社会: 82 },
    trend: [
      { term: '高1-1中', 国語: 75, 数学: 82, 英語: 76, 理科: 80, 社会: 70 },
      { term: '高1-1末', 国語: 78, 数学: 85, 英語: 79, 理科: 83, 社会: 73 },
      { term: '高1-2中', 国語: 80, 数学: 88, 英語: 82, 理科: 86, 社会: 75 },
      { term: '高2-1中', 国語: 83, 数学: 91, 英語: 85, 理科: 89, 社会: 78 },
      { term: '高2-1末', 国語: 85, 数学: 93, 英語: 87, 理科: 91, 社会: 80 },
    ],
  },
  '東京大学 工学部': {
    targets: { 国語: 85, 数学: 97, 英語: 88, 理科: 95, 社会: 80 },
    trend: [
      { term: '高1-1中', 国語: 72, 数学: 85, 英語: 74, 理科: 82, 社会: 68 },
      { term: '高1-1末', 国語: 75, 数学: 88, 英語: 77, 理科: 85, 社会: 71 },
      { term: '高1-2中', 国語: 77, 数学: 91, 英語: 80, 理科: 88, 社会: 73 },
      { term: '高2-1中', 国語: 80, 数学: 93, 英語: 83, 理科: 91, 社会: 76 },
      { term: '高2-1末', 国語: 82, 数学: 95, 英語: 85, 理科: 93, 社会: 78 },
    ],
  },
  '京都大学 理学部': {
    targets: { 国語: 84, 数学: 93, 英語: 88, 理科: 91, 社会: 80 },
    trend: [
      { term: '高1-1中', 国語: 73, 数学: 80, 英語: 75, 理科: 78, 社会: 69 },
      { term: '高1-1末', 国語: 76, 数学: 83, 英語: 78, 理科: 81, 社会: 72 },
      { term: '高1-2中', 国語: 78, 数学: 86, 英語: 80, 理科: 84, 社会: 74 },
      { term: '高2-1中', 国語: 81, 数学: 89, 英語: 83, 理科: 87, 社会: 77 },
      { term: '高2-1末', 国語: 82, 数学: 91, 英語: 85, 理科: 89, 社会: 79 },
    ],
  },
  '京都大学 工学部': {
    targets: { 国語: 82, 数学: 94, 英語: 86, 理科: 93, 社会: 78 },
    trend: [
      { term: '高1-1中', 国語: 70, 数学: 82, 英語: 72, 理科: 80, 社会: 67 },
      { term: '高1-1末', 国語: 73, 数学: 85, 英語: 75, 理科: 83, 社会: 70 },
      { term: '高1-2中', 国語: 75, 数学: 88, 英語: 78, 理科: 86, 社会: 72 },
      { term: '高2-1中', 国語: 78, 数学: 91, 英語: 81, 理科: 89, 社会: 75 },
      { term: '高2-1末', 国語: 80, 数学: 93, 英語: 83, 理科: 91, 社会: 77 },
    ],
  },
  '大阪大学 経済学部': {
    targets: { 国語: 82, 数学: 85, 英語: 88, 理科: 75, 社会: 90 },
    trend: [
      { term: '高1-1中', 国語: 71, 数学: 72, 英語: 74, 理科: 64, 社会: 78 },
      { term: '高1-1末', 国語: 74, 数学: 75, 英語: 77, 理科: 67, 社会: 81 },
      { term: '高1-2中', 国語: 76, 数学: 78, 英語: 80, 理科: 69, 社会: 84 },
      { term: '高2-1中', 国語: 79, 数学: 81, 英語: 83, 理科: 72, 社会: 87 },
      { term: '高2-1末', 国語: 80, 数学: 83, 英語: 85, 理科: 73, 社会: 88 },
    ],
  },
  '慶應義塾大学 法学部': {
    targets: { 国語: 88, 数学: 80, 英語: 93, 理科: 72, 社会: 91 },
    trend: [
      { term: '高1-1中', 国語: 75, 数学: 68, 英語: 80, 理科: 61, 社会: 78 },
      { term: '高1-1末', 国語: 78, 数学: 71, 英語: 83, 理科: 64, 社会: 81 },
      { term: '高1-2中', 国語: 80, 数学: 73, 英語: 86, 理科: 66, 社会: 84 },
      { term: '高2-1中', 国語: 83, 数学: 76, 英語: 89, 理科: 69, 社会: 87 },
      { term: '高2-1末', 国語: 85, 数学: 78, 英語: 91, 理科: 70, 社会: 89 },
    ],
  },
};

// ── モックデータ ─────────────────────────────────────────────────────────────
const INITIAL_EXAMS = [
  {
    id: 1,
    name: '1学期中間考査',
    date: '2025-06',
    goalTotal: 420,
    goalSubjects:   { 国語: 82, 数学: 88, 英語: 80, 理科: 85, 社会: 85 },
    resultSubjects: { 国語: 80, 数学: 91, 英語: 75, 理科: 87, 社会: 68 },
    tasks: {
      国語: [{ id: 'a1', text: '漢字テスト範囲の復習', done: true }, { id: 'a2', text: '古文単語100語暗記', done: true }],
      数学: [{ id: 'a3', text: '教科書章末問題p.45-60', done: true }, { id: 'a4', text: '過去問2年分', done: false }],
      英語: [{ id: 'a5', text: 'Lesson 1-3の単語', done: true }],
      理科: [{ id: 'a6', text: '物理: 力学公式暗記', done: true }],
      社会: [{ id: 'a7', text: '歴史年表まとめ', done: false }],
    },
    mistakes: {
      国語: [{ id: 'm1', question: '「逡巡」の読みを答えよ', answer: 'しゅんじゅん' }],
      数学: [{ id: 'm2', question: '√48 を簡単にせよ', answer: '4√3' }, { id: 'm3', question: '(x+3)² を展開せよ', answer: 'x²+6x+9' }],
      英語: [{ id: 'm4', question: 'despite の品詞と意味を答えよ', answer: '前置詞「〜にもかかわらず」' }],
      理科: [],
      社会: [{ id: 'm5', question: '明治維新が始まった年', answer: '1868年' }],
    },
  },
  {
    id: 2,
    name: '1学期期末考査',
    date: '2025-07',
    goalTotal: 440,
    goalSubjects:   { 国語: 85, 数学: 90, 英語: 83, 理科: 90, 社会: 92 },
    resultSubjects: { 国語: 85, 数学: 94, 英語: 80, 理科: 90, 社会: 70 },
    tasks: {
      国語: [{ id: 'b1', text: '現代文読解演習', done: true }],
      数学: [{ id: 'b2', text: '二次関数の応用問題', done: true }, { id: 'b3', text: '場合の数の練習', done: true }],
      英語: [{ id: 'b4', text: 'Lesson 4-6の文法確認', done: true }],
      理科: [{ id: 'b5', text: '波動の問題演習', done: true }],
      社会: [{ id: 'b6', text: '地理の地図暗記', done: false }],
    },
    mistakes: {
      国語: [],
      数学: [{ id: 'n1', question: '二次不等式 x²-5x+6<0 を解け', answer: '2<x<3' }],
      英語: [{ id: 'n2', question: 'hardly の意味を答えよ', answer: 'ほとんど〜ない（否定）' }],
      理科: [],
      社会: [{ id: 'n3', question: '日本の最南端の島', answer: '沖ノ鳥島' }, { id: 'n4', question: '世界最長の川', answer: 'ナイル川' }],
    },
  },
  {
    id: 3,
    name: '2学期中間考査',
    date: '2025-10',
    goalTotal: 455,
    goalSubjects:   { 国語: 88, 数学: 92, 英語: 86, 理科: 93, 社会: 96 },
    resultSubjects: { 国語: 88, 数学: 96, 英語: 84, 理科: 93, 社会: 72 },
    tasks: {
      国語: [{ id: 'c1', text: '漢文の返り点練習', done: true }],
      数学: [{ id: 'c2', text: '微分の基礎問題20問', done: true }],
      英語: [{ id: 'c3', text: '長文読解5題', done: false }],
      理科: [{ id: 'c4', text: '電磁気学の公式確認', done: true }],
      社会: [{ id: 'c5', text: '世界史近現代まとめ', done: false }],
    },
    mistakes: {
      国語: [{ id: 'p1', question: '「恣意的」の意味を答えよ', answer: '自分勝手で気ままなさま' }],
      数学: [],
      英語: [{ id: 'p2', question: 'as long as の意味を答えよ', answer: '〜する限り・〜さえすれば' }],
      理科: [],
      社会: [{ id: 'p3', question: '第一次世界大戦の終結年', answer: '1918年' }, { id: 'p4', question: 'ベルサイユ条約締結年', answer: '1919年' }],
    },
  },
];

// ── メインコンポーネント ──────────────────────────────────────────────────────
export default function ExamManagement() {
  const { role } = useApp();
  const [selectedUniversity, setSelectedUniversity] = useState('東京大学 工学部');
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [activeExamId, setActiveExamId] = useState(3);
  const [activeTab, setActiveTab] = useState('goals');

  const currentExam = exams.find(e => e.id === activeExamId);
  const benchmark = BENCHMARKS[selectedUniversity];

  const updateExam = (updates) => {
    setExams(prev => prev.map(e => e.id === activeExamId ? { ...e, ...updates } : e));
  };

  // 合計目標から各科目へ比率配分
  const distributeTotal = (total) => {
    const ref = currentExam.resultSubjects;
    const refTotal = SUBJECTS.reduce((s, sub) => s + ref[sub], 0);
    if (refTotal === 0) {
      const even = Math.round(total / SUBJECTS.length);
      return Object.fromEntries(SUBJECTS.map(s => [s, Math.min(100, even)]));
    }
    let result = {};
    let remaining = total;
    SUBJECTS.forEach((sub, i) => {
      if (i === SUBJECTS.length - 1) {
        result[sub] = Math.min(100, Math.max(0, remaining));
      } else {
        const score = Math.min(100, Math.round((ref[sub] / refTotal) * total));
        result[sub] = score;
        remaining -= score;
      }
    });
    return result;
  };

  const addExam = () => {
    const newId = Math.max(...exams.map(e => e.id)) + 1;
    const prev = exams[exams.length - 1];
    setExams(old => [...old, {
      id: newId,
      name: '新しいテスト',
      date: '2026-01',
      goalTotal: prev.goalTotal,
      goalSubjects: { ...prev.goalSubjects },
      resultSubjects: { 国語: 0, 数学: 0, 英語: 0, 理科: 0, 社会: 0 },
      tasks:    { 国語: [], 数学: [], 英語: [], 理科: [], 社会: [] },
      mistakes: { 国語: [], 数学: [], 英語: [], 理科: [], 社会: [] },
    }]);
    setActiveExamId(newId);
    setActiveTab('goals');
  };

  if (role === 'teacher') {
    return <TeacherView exams={exams} />;
  }

  const TABS = [
    { id: 'goals',  label: '目標・実績', icon: Target     },
    { id: 'graph',  label: '推移グラフ', icon: TrendingUp },
    { id: 'review', label: '振り返り',   icon: BookOpen   },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 志望大学セレクター */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <Award className="w-5 h-5 text-amber-500 shrink-0" />
        <span className="font-semibold text-gray-700 shrink-0">志望大学・学部</span>
        <select
          value={selectedUniversity}
          onChange={e => setSelectedUniversity(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <span className="text-xs text-gray-400">先輩の同時期の成績を参考に目標を設定できます</span>
      </div>

      {/* テスト選択タブ */}
      <div className="flex flex-wrap items-center gap-2">
        {exams.map(exam => (
          <button
            key={exam.id}
            onClick={() => setActiveExamId(exam.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeExamId === exam.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
            }`}
          >
            {exam.name}
          </button>
        ))}
        <button
          onClick={addExam}
          className="px-3 py-2 rounded-lg text-sm border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          追加
        </button>
      </div>

      {/* メインタブ */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'goals' && (
        <GoalsResultsTab
          exam={currentExam}
          benchmark={benchmark}
          onUpdate={updateExam}
          distributeTotal={distributeTotal}
        />
      )}
      {activeTab === 'graph' && (
        <TrendGraph exams={exams} benchmark={benchmark} />
      )}
      {activeTab === 'review' && (
        <MistakeReview exam={currentExam} onUpdate={updateExam} />
      )}
    </div>
  );
}

// ── 目標・実績タブ ───────────────────────────────────────────────────────────
function GoalsResultsTab({ exam, benchmark, onUpdate, distributeTotal }) {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [newTask, setNewTask] = useState('');

  const totalGoal   = SUBJECTS.reduce((s, sub) => s + exam.goalSubjects[sub],   0);
  const totalResult = SUBJECTS.reduce((s, sub) => s + exam.resultSubjects[sub], 0);
  const benchTotal  = SUBJECTS.reduce((s, sub) => s + benchmark.targets[sub],   0);

  const handleGoalTotalChange = (val) => {
    const total = Math.max(0, Math.min(500, Number(val)));
    onUpdate({ goalTotal: total, goalSubjects: distributeTotal(total) });
  };

  const toggleTask = (subject, taskId) => {
    onUpdate({
      tasks: {
        ...exam.tasks,
        [subject]: exam.tasks[subject].map(t => t.id === taskId ? { ...t, done: !t.done } : t),
      },
    });
  };

  const deleteTask = (subject, taskId) => {
    onUpdate({
      tasks: {
        ...exam.tasks,
        [subject]: exam.tasks[subject].filter(t => t.id !== taskId),
      },
    });
  };

  const addTask = (subject) => {
    if (!newTask.trim()) return;
    onUpdate({
      tasks: {
        ...exam.tasks,
        [subject]: [...exam.tasks[subject], { id: `t${Date.now()}`, text: newTask.trim(), done: false }],
      },
    });
    setNewTask('');
  };

  return (
    <div className="space-y-4">
      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-xs text-blue-500 mb-1">先輩合格目安</div>
          <div className="text-2xl font-bold text-blue-700">{benchTotal}<span className="text-sm font-normal ml-1">点</span></div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-xs text-amber-500 mb-1">目標合計</div>
          <div className="text-2xl font-bold text-amber-700">{totalGoal}<span className="text-sm font-normal ml-1">点</span></div>
          <input
            type="range" min={0} max={500} value={totalGoal}
            onChange={e => handleGoalTotalChange(e.target.value)}
            className="w-full mt-2 accent-amber-500"
          />
        </div>
        <div className={`border rounded-xl p-4 ${totalResult >= totalGoal ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`text-xs mb-1 ${totalResult >= totalGoal ? 'text-green-500' : 'text-red-500'}`}>実績合計</div>
          <div className={`text-2xl font-bold ${totalResult >= totalGoal ? 'text-green-700' : 'text-red-700'}`}>
            {totalResult}<span className="text-sm font-normal ml-1">点</span>
          </div>
          <div className={`text-xs mt-1 ${totalResult >= totalGoal ? 'text-green-500' : 'text-red-500'}`}>
            {totalResult >= totalGoal ? `+${totalResult - totalGoal}` : `${totalResult - totalGoal}`}点
          </div>
        </div>
      </div>

      {/* 科目別スライダー */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[90px_1fr_64px_64px_64px] gap-2 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-400 border-b border-gray-100">
          <div>科目</div>
          <div className="pl-6">目標 / 実績</div>
          <div className="text-center text-blue-500">先輩目安</div>
          <div className="text-center text-amber-500">目標</div>
          <div className="text-center text-green-600">実績</div>
        </div>

        {SUBJECTS.map(subject => {
          const st     = STYLES[subject];
          const goal   = exam.goalSubjects[subject];
          const result = exam.resultSubjects[subject];
          const bench  = benchmark.targets[subject];
          const expanded = expandedSubject === subject;

          return (
            <div key={subject} className="border-b border-gray-50 last:border-0">
              <div className="grid grid-cols-[90px_1fr_64px_64px_64px] gap-2 px-4 py-3 items-center">
                {/* 科目名 */}
                <button
                  onClick={() => setExpandedSubject(expanded ? null : subject)}
                  className={`flex items-center gap-1.5 text-sm font-medium ${st.text}`}
                >
                  <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: st.hex }} />
                  {subject}
                  <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </button>

                {/* デュアルスライダー */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-500 w-5 shrink-0">目標</span>
                    <input
                      type="range" min={0} max={100} value={goal}
                      onChange={e => onUpdate({ goalSubjects: { ...exam.goalSubjects, [subject]: Number(e.target.value) } })}
                      className="flex-1 h-1.5 accent-amber-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-600 w-5 shrink-0">実績</span>
                    <input
                      type="range" min={0} max={100} value={result}
                      onChange={e => onUpdate({ resultSubjects: { ...exam.resultSubjects, [subject]: Number(e.target.value) } })}
                      className="flex-1 h-1.5 accent-green-500"
                    />
                  </div>
                </div>

                <div className="text-center text-sm font-medium text-blue-600">{bench}</div>
                <div className="text-center text-sm font-semibold text-amber-600">{goal}</div>
                <div className={`text-center text-sm font-semibold ${result >= goal ? 'text-green-600' : 'text-red-500'}`}>{result}</div>
              </div>

              {/* やることリスト（展開時） */}
              {expanded && (
                <div className={`mx-3 mb-3 rounded-lg p-3 ${st.bg} border ${st.border}`}>
                  <div className={`text-xs font-medium mb-2 ${st.text}`}>
                    {subject} のやること
                  </div>
                  <div className="space-y-1.5 mb-2">
                    {exam.tasks[subject].length === 0 && (
                      <div className="text-xs text-gray-400">タスクなし</div>
                    )}
                    {exam.tasks[subject].map(task => (
                      <div key={task.id} className="flex items-center gap-2 group">
                        <button onClick={() => toggleTask(subject, task.id)} className="shrink-0">
                          {task.done
                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                            : <Circle className="w-4 h-4 text-gray-300" />}
                        </button>
                        <span className={`text-sm flex-1 ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.text}
                        </span>
                        <button
                          onClick={() => deleteTask(subject, task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="やることを追加..."
                      value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTask(subject)}
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white"
                    />
                    <button
                      onClick={() => addTask(subject)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs border ${st.border} ${st.text} bg-white hover:opacity-80`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 推移グラフ ───────────────────────────────────────────────────────────────
function TrendGraph({ exams, benchmark }) {
  const [activeSubjects, setActiveSubjects] = useState(new Set(SUBJECTS));
  const [showBenchmark, setShowBenchmark] = useState(true);

  const W = 640, H = 300;
  const PL = 38, PR = 16, PT = 16, PB = 44;
  const IW = W - PL - PR;
  const IH = H - PT - PB;

  const n = exams.length;
  const xPos = (i) => PL + (n <= 1 ? IW / 2 : (i / (n - 1)) * IW);
  const yPos = (score) => PT + (1 - score / 100) * IH;

  const makePath = (scores) =>
    scores.map((s, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(s).toFixed(1)}`).join(' ');

  const toggleSubject = (sub) => {
    setActiveSubjects(prev => {
      const next = new Set(prev);
      next.has(sub) ? next.delete(sub) : next.add(sub);
      return next;
    });
  };

  const yLines = [0, 20, 40, 60, 80, 100];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">点数推移</h3>
        <button
          onClick={() => setShowBenchmark(!showBenchmark)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
            showBenchmark ? 'border-blue-400 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-400'
          }`}
        >
          先輩ベンチマーク
        </button>
      </div>

      {/* 科目トグル */}
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map(sub => (
          <button
            key={sub}
            onClick={() => toggleSubject(sub)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              activeSubjects.has(sub) ? 'text-white border-transparent' : 'border-gray-200 text-gray-400 bg-gray-50'
            }`}
            style={activeSubjects.has(sub) ? { background: STYLES[sub].hex } : {}}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* SVGチャート */}
      <div className="overflow-x-auto -mx-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
          {/* グリッド */}
          {yLines.map(y => (
            <g key={y}>
              <line x1={PL} y1={yPos(y)} x2={W - PR} y2={yPos(y)} stroke="#f3f4f6" strokeWidth={1} />
              <text x={PL - 5} y={yPos(y) + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{y}</text>
            </g>
          ))}

          {/* X軸ラベル */}
          {exams.map((exam, i) => (
            <text key={exam.id} x={xPos(i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {exam.name.length > 6 ? exam.name.slice(0, 6) + '…' : exam.name}
            </text>
          ))}

          {/* ベンチマーク（破線） */}
          {showBenchmark && SUBJECTS.filter(s => activeSubjects.has(s)).map(sub => {
            const scores = benchmark.trend.slice(0, exams.length).map(t => t[sub] ?? 0);
            if (scores.length < 2) return null;
            return (
              <path
                key={`bench-${sub}`}
                d={makePath(scores)}
                fill="none"
                stroke={STYLES[sub].hex}
                strokeWidth={1.5}
                strokeDasharray="5,4"
                strokeOpacity={0.4}
              />
            );
          })}

          {/* 生徒ライン */}
          {SUBJECTS.filter(s => activeSubjects.has(s)).map(sub => {
            const scores = exams.map(e => e.resultSubjects[sub]);
            if (scores.every(s => s === 0)) return null;
            return (
              <g key={sub}>
                <path d={makePath(scores)} fill="none" stroke={STYLES[sub].hex} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                {scores.map((score, i) => (
                  <circle key={i} cx={xPos(i)} cy={yPos(score)} r={4.5} fill={STYLES[sub].hex} stroke="white" strokeWidth={2} />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 凡例 */}
      <div className="flex gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <svg width="22" height="6"><line x1="0" y1="3" x2="22" y2="3" stroke="#9ca3af" strokeWidth="2.5" /></svg>
          自分の実績
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="22" height="6"><line x1="0" y1="3" x2="22" y2="3" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="5,3" /></svg>
          先輩ベンチマーク
        </span>
      </div>
    </div>
  );
}

// ── 振り返り（ミス問題）タブ ──────────────────────────────────────────────────
function MistakeReview({ exam, onUpdate }) {
  const [quizMode, setQuizMode]     = useState(false);
  const [quizSubject, setQuizSubject] = useState(null); // null = 全科目
  const [quizIndex, setQuizIndex]   = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [form, setForm] = useState({ subject: SUBJECTS[0], question: '', answer: '' });

  const addMistake = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    onUpdate({
      mistakes: {
        ...exam.mistakes,
        [form.subject]: [
          ...exam.mistakes[form.subject],
          { id: `m${Date.now()}`, question: form.question.trim(), answer: form.answer.trim() },
        ],
      },
    });
    setForm(prev => ({ ...prev, question: '', answer: '' }));
  };

  const deleteMistake = (subject, id) => {
    onUpdate({
      mistakes: {
        ...exam.mistakes,
        [subject]: exam.mistakes[subject].filter(m => m.id !== id),
      },
    });
  };

  const allMistakes = SUBJECTS.flatMap(s => exam.mistakes[s].map(m => ({ ...m, subject: s })));
  const quizItems   = quizSubject
    ? exam.mistakes[quizSubject].map(m => ({ ...m, subject: quizSubject }))
    : allMistakes;

  const exitQuiz = () => { setQuizMode(false); setShowAnswer(false); setQuizIndex(0); };
  const nextQuiz = (skip) => {
    setShowAnswer(false);
    if (!skip && quizIndex + 1 >= quizItems.length) { exitQuiz(); return; }
    setQuizIndex(prev => skip ? (prev + 1) % quizItems.length : prev + 1);
  };

  // クイズ画面
  if (quizMode && quizItems.length > 0) {
    const item = quizItems[quizIndex];
    const st   = STYLES[item.subject];
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">クイズモード</h3>
          <button onClick={exitQuiz} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <RotateCcw className="w-4 h-4" />終了
          </button>
        </div>
        <div className="text-center text-xs text-gray-400">
          {quizIndex + 1} / {quizItems.length}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${st.bg} ${st.text}`}>{item.subject}</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="text-xs text-gray-400 mb-2">Q.</div>
          <div className="text-base text-gray-800 font-medium">{item.question}</div>
        </div>
        {showAnswer ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-xs text-green-500 mb-1">答え</div>
              <div className="text-base font-semibold text-green-800">{item.answer}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => nextQuiz(true)}  className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 text-sm">もう一度</button>
              <button onClick={() => nextQuiz(false)} className="flex-1 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 text-sm">覚えた ✓</button>
            </div>
          </>
        ) : (
          <button onClick={() => setShowAnswer(true)} className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
            答えを見る
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 追加フォーム */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">間違えた問題を登録</h3>
        <select
          value={form.subject}
          onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
        >
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="text" placeholder="問題を入力..."
          value={form.question}
          onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
        />
        <input
          type="text" placeholder="答えを入力..."
          value={form.answer}
          onChange={e => setForm(prev => ({ ...prev, answer: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && addMistake()}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
        />
        <button
          onClick={addMistake}
          className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />追加
        </button>
      </div>

      {/* クイズ開始ボタン */}
      {allMistakes.length > 0 && (
        <button
          onClick={() => { setQuizSubject(null); setQuizMode(true); setQuizIndex(0); setShowAnswer(false); }}
          className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 text-sm"
        >
          全科目クイズ開始（{allMistakes.length}問）
        </button>
      )}

      {/* 科目別リスト */}
      {SUBJECTS.map(subject => {
        const mistakes = exam.mistakes[subject];
        const st = STYLES[subject];
        return (
          <div key={subject} className={`rounded-xl border ${st.border} overflow-hidden`}>
            <div className={`flex items-center justify-between px-4 py-2.5 ${st.bg}`}>
              <div className={`font-medium text-sm ${st.text} flex items-center gap-2`}>
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: st.hex }} />
                {subject}
                <span className="text-xs font-normal opacity-70">({mistakes.length}問)</span>
              </div>
              {mistakes.length > 0 && (
                <button
                  onClick={() => { setQuizSubject(subject); setQuizMode(true); setQuizIndex(0); setShowAnswer(false); }}
                  className={`text-xs px-2.5 py-1 rounded-full bg-white border ${st.border} ${st.text}`}
                >
                  クイズ
                </button>
              )}
            </div>
            <div className="bg-white divide-y divide-gray-50">
              {mistakes.length === 0
                ? <div className="px-4 py-3 text-xs text-gray-400 text-center">まだ登録なし</div>
                : mistakes.map(m => (
                  <div key={m.id} className="flex items-start gap-3 px-4 py-3 group">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700">Q. {m.question}</div>
                      <div className="text-xs text-gray-500 mt-0.5">A. {m.answer}</div>
                    </div>
                    <button onClick={() => deleteMistake(subject, m.id)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 先生ビュー ───────────────────────────────────────────────────────────────
function TeacherView({ exams }) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" />
        <h2 className="font-semibold text-gray-700">生徒の定期テスト入力状況</h2>
      </div>

      <div className="space-y-3">
        {studentList.map((student, idx) => {
          // デモ用: 生徒ごとに入力状況を少し変化させる
          const offset = idx * 0.3;
          const goalsCount   = exams.filter((_, i) => (i + offset) % 1.5 < 1).length;
          const resultsCount = exams.filter((_, i) => (i + offset) % 2   < 1).length;
          const mistakes = exams.reduce((sum, e) => sum + SUBJECTS.reduce((s2, sub) => s2 + e.mistakes[sub].length, 0), 0);

          return (
            <div key={student.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">{student.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {student.grade} {student.class} ／ {student.targetUniversity} {student.targetFaculty}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Stat label="目標入力" value={goalsCount} total={exams.length} color="amber" />
                  <Stat label="実績入力" value={resultsCount} total={exams.length} color="green" />
                  <Stat label="振り返り" value={mistakes} total={null} color="red" />
                </div>
              </div>

              {/* 直近テストのスコアサマリー */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {exams.map(exam => {
                  const total = SUBJECTS.reduce((s, sub) => s + exam.resultSubjects[sub], 0);
                  const goal  = SUBJECTS.reduce((s, sub) => s + exam.goalSubjects[sub],   0);
                  return (
                    <div key={exam.id} className="bg-gray-50 rounded-lg p-2 text-xs">
                      <div className="text-gray-500 truncate">{exam.name}</div>
                      <div className={`font-semibold mt-0.5 ${total >= goal ? 'text-green-600' : 'text-red-500'}`}>
                        {total}点 <span className="text-gray-400 font-normal">/ 目標{goal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, total, color }) {
  const colors = {
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
    red:   'bg-red-50 text-red-600',
  };
  return (
    <div className={`px-3 py-1.5 rounded-lg text-xs text-center ${colors[color]}`}>
      <div className="font-bold text-base leading-tight">
        {value}{total != null ? `/${total}` : ''}
      </div>
      <div className="opacity-80">{label}</div>
    </div>
  );
}
