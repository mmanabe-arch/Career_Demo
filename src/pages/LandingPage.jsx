import { useState, useEffect } from 'react';

/* ── Brand colors ── */
const NAVY   = '#0B2447';
const ORANGE = '#FF6B35';
const AMBER  = '#FFD166';

/* ══════════════════════════════════════════
   LOGO / ICON
══════════════════════════════════════════ */
function TorchIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Flame outer */}
      <path d="M20 4 C14 10 10 16 13 22 C15 26 18 27 20 36 C22 27 25 26 27 22 C30 16 26 10 20 4Z"
        fill={ORANGE} />
      {/* Flame inner */}
      <path d="M20 12 C17 16 16 19 17.5 22 C18.5 24 19.5 25 20 30 C20.5 25 21.5 24 22.5 22 C24 19 23 16 20 12Z"
        fill={AMBER} />
      {/* Handle */}
      <rect x="17" y="34" width="6" height="4" rx="1.5" fill={NAVY} />
      {/* Handle base */}
      <rect x="15" y="37" width="10" height="2.5" rx="1.25" fill={NAVY} />
    </svg>
  );
}

/* ══════════════════════════════════════════
   BROWSER FRAME (for mockups)
══════════════════════════════════════════ */
function BrowserFrame({ children, title = 'Torch' }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
        <div className="flex-1 mx-3 bg-white border border-gray-300 rounded-md px-3 py-0.5 text-xs text-gray-400 text-center">
          torch.jp/{title.toLowerCase()}
        </div>
      </div>
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP: キャリア台帳
══════════════════════════════════════════ */
function AlumniListMockup() {
  const cards = [
    { name: '山田 太郎', univ: '東京大学 法学部', company: 'McKinsey & Company', tags: ['コンサル', '東大'], color: 'bg-blue-50 border-blue-200' },
    { name: '鈴木 花子', univ: '慶應義塾大学 経済学部', company: 'Goldman Sachs', tags: ['金融', '慶應'], color: 'bg-purple-50 border-purple-200' },
    { name: '田中 一郎', univ: '東京工業大学 情報工学科', company: 'Google Japan', tags: ['IT', '東工大'], color: 'bg-green-50 border-green-200' },
  ];
  return (
    <div className="p-3 bg-gray-50 text-xs" style={{ height: 220 }}>
      {/* Recommended */}
      <div className="mb-2 p-2 rounded-lg bg-white border border-orange-200">
        <p className="text-orange-600 font-bold mb-1.5 flex items-center gap-1">
          <span>⭐</span> あなたへのおすすめ
        </p>
        <div className="flex gap-2">
          {cards.slice(0,2).map((c,i) => (
            <div key={i} className={`flex-1 p-1.5 rounded-lg border ${c.color}`}>
              <div className="w-6 h-6 rounded-full bg-gray-300 mb-1"></div>
              <p className="font-semibold text-gray-800 leading-tight">{c.name}</p>
              <p className="text-gray-500 text-[10px] leading-tight">{c.company}</p>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {c.tags.map(t => (
                  <span key={t} className="px-1 rounded text-[9px]" style={{ background: '#FFF0E8', color: ORANGE }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* List */}
      {cards.map((c,i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100 mb-1.5">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{c.name}</p>
            <p className="text-gray-500 text-[10px] truncate">{c.univ}</p>
          </div>
          <button className="text-[10px] px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: ORANGE }}>詳細</button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP: チャット
══════════════════════════════════════════ */
function ChatMockup() {
  const msgs = [
    { from: 'student', text: '東大法学部を目指しています。どんな勉強をしていましたか？' },
    { from: 'alumni', text: '私も同じ目標でした！特に英語は早めに固めると有利ですよ。毎日単語帳を欠かさず続けました。' },
    { from: 'student', text: 'ありがとうございます！数学が苦手なんですが…' },
    { from: 'alumni', text: '数学は基礎から丁寧に。青チャートを完璧にするのが王道です 💪' },
  ];
  return (
    <div className="flex h-52" style={{ fontSize: 11 }}>
      {/* Sidebar */}
      <div className="w-28 border-r border-gray-100 bg-gray-50 p-2">
        <p className="text-gray-500 text-[10px] font-bold mb-1">チャット</p>
        {['鈴木一朗 (高3)', '中村花 (高2)', '田中翼 (高1)'].map((s,i) => (
          <div key={i} className={`p-1.5 rounded-lg mb-1 cursor-pointer ${i===0 ? 'bg-white border border-orange-200' : ''}`}>
            <p className={`font-medium truncate ${i===0?'text-gray-800':'text-gray-500'}`}>{s}</p>
          </div>
        ))}
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200"></div>
          <div>
            <p className="font-semibold text-gray-800">鈴木一朗</p>
            <p className="text-[9px] text-gray-500">高3・理系 | 東大志望</p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-2 space-y-1.5">
          {msgs.map((m,i) => (
            <div key={i} className={`flex ${m.from==='alumni'?'justify-end':''}`}>
              <div className={`max-w-[75%] px-2 py-1 rounded-xl text-[10px] leading-relaxed ${
                m.from==='alumni'
                  ? 'text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-700 rounded-bl-none'
              }`} style={m.from==='alumni' ? { background: ORANGE } : {}}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP: 目標管理
══════════════════════════════════════════ */
function GoalMockup() {
  return (
    <div className="p-3 bg-gray-50 text-xs" style={{ height: 220 }}>
      {/* Tabs */}
      <div className="flex gap-1 mb-2">
        {['年次', '月次', '週次', '全体MAP', '振り返り'].map((t,i) => (
          <button key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            i===0 ? 'text-white' : 'bg-white text-gray-500 border border-gray-200'
          }`} style={i===0 ? { background: NAVY } : {}}>
            {t}
          </button>
        ))}
      </div>
      {/* Goal card */}
      <div className="bg-white rounded-lg p-2 mb-2 border border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-gray-800">2025年 年次目標</p>
          <span className="text-[10px] font-bold" style={{ color: ORANGE }}>68%</span>
        </div>
        <p className="text-gray-600 mb-1.5 text-[10px]">東京大学理科一類に現役合格する</p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full">
          <div className="h-full rounded-full" style={{ width: '68%', background: ORANGE }}></div>
        </div>
      </div>
      {/* Tasks */}
      <div className="bg-white rounded-lg p-2 border border-gray-100">
        <p className="font-semibold text-gray-700 mb-1.5">タスク</p>
        {[
          { done: true, label: '数学：青チャート例題完了', depth: 0 },
          { done: false, label: '英語：単語帳 3000語', depth: 0 },
          { done: true, label: '└ DUO 3.0 完走', depth: 1 },
          { done: false, label: '└ 鉄壁 進行中 (1200/1700)', depth: 1 },
          { done: false, label: '物理：力学マスター', depth: 0 },
        ].map((t,i) => (
          <div key={i} className="flex items-center gap-1.5 mb-1" style={{ paddingLeft: t.depth * 12 }}>
            <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${
              t.done ? 'border-none' : 'border-gray-300'
            }`} style={t.done ? { background: ORANGE } : {}}>
              {t.done && <span className="text-white text-[8px]">✓</span>}
            </div>
            <span className={`text-[10px] ${t.done?'line-through text-gray-400':'text-gray-700'}`}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP: 家庭教師マッチング
══════════════════════════════════════════ */
function TutoringMockup() {
  const tutors = [
    { name: '中村 剛', univ: '東大 理学部4年', subjects: ['数学', '物理'], rate: '2,500円/h', rating: 4.9 },
    { name: '佐藤 美咲', univ: '京大 医学部3年', subjects: ['数学', '英語', '化学'], rate: '2,800円/h', rating: 5.0 },
  ];
  return (
    <div className="p-3 bg-gray-50 text-xs" style={{ height: 220 }}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-gray-800">家庭教師を探す</p>
        <div className="flex gap-1">
          {['数学','英語','理科'].map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500 text-[10px]">{s}</span>
          ))}
        </div>
      </div>
      {tutors.map((t,i) => (
        <div key={i} className="bg-white rounded-lg p-2 border border-gray-100 mb-2">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
              style={{ background: i===0 ? NAVY : '#7C3AED' }}>
              {t.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-[10px] font-bold" style={{ color: ORANGE }}>{'★'.repeat(Math.floor(t.rating))} {t.rating}</p>
              </div>
              <p className="text-[10px] text-gray-500">{t.univ}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex gap-1">
                  {t.subjects.map(s => (
                    <span key={s} className="px-1 py-0.5 rounded text-[9px]" style={{ background: '#E8F0FE', color: NAVY }}>{s}</span>
                  ))}
                </div>
                <p className="text-[10px] font-bold text-gray-700">{t.rate}</p>
              </div>
            </div>
          </div>
          <button className="mt-1.5 w-full py-0.5 rounded text-[10px] text-white font-medium" style={{ background: ORANGE }}>
            体験授業を申し込む
          </button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP: コンテンツ
══════════════════════════════════════════ */
function ContentsMockup() {
  const items = [
    { title: '【東大生が語る】合格までの1000日間', tag: '体験談', views: '2,341', color: 'bg-blue-100 text-blue-700' },
    { title: '志望校の決め方 完全ガイド', tag: 'ガイド', views: '1,892', color: 'bg-green-100 text-green-700' },
    { title: '現役京大生のリアルな一日', tag: '動画', views: '3,105', color: 'bg-purple-100 text-purple-700' },
  ];
  return (
    <div className="p-3 bg-gray-50 text-xs" style={{ height: 220 }}>
      <div className="flex gap-1 mb-2">
        {['すべて','体験談','動画','ガイド'].map((t,i) => (
          <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] cursor-pointer ${
            i===0 ? 'text-white' : 'bg-white text-gray-500 border border-gray-200'
          }`} style={i===0 ? { background: NAVY } : {}}>
            {t}
          </span>
        ))}
      </div>
      {items.map((item,i) => (
        <div key={i} className="bg-white rounded-lg p-2 border border-gray-100 mb-1.5 flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
            <span className="text-lg">{i===2 ? '▶' : '📄'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 leading-tight line-clamp-2">{item.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${item.color}`}>{item.tag}</span>
              <span className="text-[9px] text-gray-400">👁 {item.views}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MOCKUP: 生徒情報 (for school/teacher)
══════════════════════════════════════════ */
function StudentInfoMockup() {
  return (
    <div className="p-3 bg-gray-50 text-xs" style={{ height: 220 }}>
      <div className="flex gap-2 h-full">
        {/* Left panel */}
        <div className="w-28 space-y-1">
          {[
            { name: '鈴木一朗', grade: '高3', stream: '理系' },
            { name: '中村花', grade: '高2', stream: '理系' },
            { name: '田中翼', grade: '高1', stream: '未定' },
            { name: '佐藤美里', grade: '高3', stream: '文系' },
          ].map((s,i) => (
            <div key={i} className={`p-1.5 rounded-lg border ${i===0?'bg-white border-orange-200':'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div>
                  <p className={`font-medium truncate text-[10px] ${i===0?'text-gray-800':'text-gray-500'}`}>{s.name}</p>
                  <span className={`text-[9px] px-1 rounded ${s.stream==='理系'?'bg-blue-100 text-blue-700':s.stream==='文系'?'bg-pink-100 text-pink-700':'bg-gray-100 text-gray-600'}`}>{s.grade} {s.stream}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Right panel */}
        <div className="flex-1 bg-white rounded-lg border border-gray-100 p-2 overflow-hidden">
          <p className="font-bold text-gray-800 mb-1">鈴木一朗</p>
          <div className="grid grid-cols-2 gap-1 mb-2">
            {[['志望大学','東京大学'],['学部','理学部'],['学年','高校3年'],['偏差値','72.4']].map(([k,v])=>(
              <div key={k} className="bg-gray-50 rounded p-1">
                <p className="text-[9px] text-gray-500">{k}</p>
                <p className="font-semibold text-gray-800 text-[10px]">{v}</p>
              </div>
            ))}
          </div>
          <p className="font-semibold text-gray-700 mb-1 text-[10px]">模試成績推移</p>
          <svg width="100%" height="50" viewBox="0 0 120 50">
            <polyline points="0,40 30,34 60,28 90,20 120,16"
              fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"/>
            {[40,34,28,20,16].map((y,i) => (
              <circle key={i} cx={i*30} cy={y} r="3" fill={ORANGE}/>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <TorchIcon size={36} />
          <span className="text-2xl font-black tracking-tight" style={{ color: NAVY }}>
            Torch
          </span>
        </a>
        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">機能</a>
          <a href="#impact" className="hover:text-gray-900 transition-colors">導入効果</a>
          <a href="#business" className="hover:text-gray-900 transition-colors">ビジネスモデル</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">料金</a>
        </div>
        {/* CTA */}
        <a href="#contact" className="px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          style={{ background: ORANGE }}>
          資料請求・お問い合わせ
        </a>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28" style={{ background: NAVY }}>
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: ORANGE, filter: 'blur(80px)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: AMBER, filter: 'blur(60px)' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(255,107,53,0.15)', color: ORANGE, border: `1px solid ${ORANGE}` }}>
              <TorchIcon size={18} />
              <span>株式会社バディアス</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              キャリア形成における<br/>
              <span style={{ color: AMBER }}>障壁をなくす。</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              Torchは、私立中高一貫校のキャリア教育をDXする次世代プラットフォーム。
              OBOGとのマッチング・家庭教師・目標管理・コンテンツ提供を一元化し、
              すべての生徒が自分らしいキャリアを切り拓ける環境をつくります。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#contact" className="px-8 py-3.5 rounded-full font-bold text-white text-base shadow-xl transition-transform hover:scale-105"
                style={{ background: ORANGE }}>
                無料で資料請求する
              </a>
              <a href="#features" className="px-8 py-3.5 rounded-full font-bold text-base border-2 border-white text-white hover:bg-white transition-colors"
                style={{ }}>
                機能を見る
              </a>
            </div>
          </div>
          {/* Right – app preview */}
          <div className="flex-1 w-full max-w-lg">
            <BrowserFrame title="alumni">
              <AlumniListMockup />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   STATS BAR
══════════════════════════════════════════ */
function StatsBar() {
  const stats = [
    { value: '200円', unit: '/人/月', label: '業界最安水準の月額' },
    { value: '67%', unit: '', label: 'OBOGへの報酬還元率' },
    { value: '6機能', unit: '', label: '一元管理できる機能数' },
    { value: '∞', unit: '', label: '登録OBOGに上限なし' },
  ];
  return (
    <section className="py-10 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s,i) => (
          <div key={i} className="text-center">
            <p className="text-3xl font-black" style={{ color: NAVY }}>
              {s.value}<span className="text-lg font-bold text-gray-500">{s.unit}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PROBLEM SECTION
══════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    {
      icon: '🎓',
      title: 'OBOG活用が属人的',
      body: '現役OBOGとの連絡管理が担当教員のExcelや記憶に依存。卒業生の知見が学校に蓄積されない。',
    },
    {
      icon: '📊',
      title: '生徒の目標管理が分散',
      body: '年次・月次・週次の目標とタスクが紙やバラバラなアプリで管理され、振り返りが形骸化している。',
    },
    {
      icon: '💬',
      title: 'キャリア相談の機会格差',
      body: '保護者のコネクションや塾の質によってキャリア情報の格差が拡大。すべての生徒に均等な機会がない。',
    },
    {
      icon: '💰',
      title: '家庭教師費用が高額',
      body: '有名大学生との個別指導は相場1時間5,000〜10,000円。家庭の経済状況に関係なく利用できるべき。',
    },
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3" style={{ background: '#FFF0E8', color: ORANGE }}>
            解決すべき課題
          </span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            学校のキャリア教育が<br/>抱える4つの壁
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p,i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <span className="text-3xl flex-shrink-0">{p.icon}</span>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: NAVY }}>{p.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SOLUTION BANNER
══════════════════════════════════════════ */
function SolutionBanner() {
  return (
    <section className="py-16" style={{ background: NAVY }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <TorchIcon size={56} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
          Torchが、すべてを一つに。
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          キャリア台帳・チャット・目標管理・家庭教師マッチング・コンテンツを一元化。
          OBOGと生徒が自然につながり、学校ぐるみでキャリア教育を強化できます。
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      id: 'alumni',
      tag: '機能 01',
      title: 'キャリア台帳',
      subtitle: 'OBOG情報をスマートに一元管理',
      body: '卒業生・在学生のプロフィールをデータベース化。生徒の志望校・志向をもとにAIがOBOGをレコメンド。業種・大学・活動タグで絞り込み、最適な先輩にすぐつながれます。',
      points: ['AI×プロフィールによる自動レコメンド', '業種・大学・タグで多軸フィルタ', '無制限のOBOG登録'],
      mockup: <AlumniListMockup />,
    },
    {
      id: 'chat',
      tag: '機能 02',
      title: 'キャリア相談チャット',
      subtitle: 'OBOGと生徒のダイレクト対話',
      body: 'OBOG・生徒間のダイレクトチャット。OBOGは担当生徒の学年・志望校・成績を一目で確認しながら的確なアドバイスを届けられます。',
      points: ['1対1チャット機能', 'OBOG向け生徒情報ダッシュボード', 'スレッド形式で履歴管理'],
      mockup: <ChatMockup />,
    },
    {
      id: 'goals',
      tag: '機能 03',
      title: '目標管理',
      subtitle: '年次→月次→週次で目標を可視化',
      body: '年・月・週の3階層で目標とタスクを設定。ガントチャート的な全体MAPで目標のつながりを視覚化。振り返り機能で成長を記録できます。',
      points: ['3階層タスク管理', '全体MAPで俯瞰ビュー', '振り返り・リフレクション機能'],
      mockup: <GoalMockup />,
    },
    {
      id: 'tutor',
      tag: '機能 04',
      title: '家庭教師マッチング',
      subtitle: '現役難関大学生を低コストで',
      body: '現役難関大生と生徒をダイレクトマッチング。相場の半額以下で個別指導を提供。OBOGは指導収入を得ながら後輩支援ができます。',
      points: ['最安2,000円台/hで個別指導', 'OBOG収益の67%を還元', '科目・志望校でマッチング'],
      mockup: <TutoringMockup />,
    },
    {
      id: 'contents',
      tag: '機能 05',
      title: 'キャリアコンテンツ',
      subtitle: 'OBOGが制作する本物の体験談',
      body: '現役学生・社会人OBOGが執筆・制作した記事・動画コンテンツをいつでも閲覧。「どの大学のどの学部に進んだらどうなるか」をリアルに知れます。',
      points: ['体験談記事・動画を網羅', 'OBOG執筆による高信頼コンテンツ', '志望校・業界別に検索'],
      mockup: <ContentsMockup />,
    },
    {
      id: 'student',
      tag: '機能 06',
      title: '生徒情報ダッシュボード',
      subtitle: '担任・OBOGが生徒を深く理解',
      body: '定期テスト・模試の成績推移を可視化。志望校・志望学部・興味分野をデータで把握。担任からOBOGへの情報共有もスムーズに。',
      points: ['成績・偏差値推移グラフ', '志望大学・学部を一覧管理', 'チャット連携でシームレス対応'],
      mockup: <StudentInfoMockup />,
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3" style={{ background: '#FFF0E8', color: ORANGE }}>
            主要機能
          </span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            キャリア教育に必要なすべてが<br/>ここにある
          </h2>
        </div>

        <div className="space-y-24">
          {features.map((f, i) => (
            <div key={f.id} className={`flex flex-col lg:flex-row items-center gap-12 ${i%2===1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Text */}
              <div className="flex-1">
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: '#FFF0E8', color: ORANGE }}>
                  {f.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-black mt-3 mb-1" style={{ color: NAVY }}>{f.title}</h3>
                <p className="text-base font-medium text-gray-500 mb-4">{f.subtitle}</p>
                <p className="text-gray-600 leading-relaxed mb-6">{f.body}</p>
                <ul className="space-y-2">
                  {f.points.map((p,pi) => (
                    <li key={pi} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ background: ORANGE }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup */}
              <div className="flex-1 w-full max-w-md">
                <BrowserFrame title={f.id}>
                  {f.mockup}
                </BrowserFrame>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   IMPACT SECTION
══════════════════════════════════════════ */
function ImpactSection() {
  const impacts = [
    {
      role: '生徒',
      emoji: '🧑‍🎓',
      color: '#E8F0FE',
      borderColor: '#3B82F6',
      items: [
        'OBOGから生のキャリア情報を取得できる',
        '年次〜週次で目標・タスクを系統立てて管理',
        '家庭教師を低コストで利用できる',
        '志望大学・業界の実態をコンテンツで把握',
      ],
    },
    {
      role: 'OBOG',
      emoji: '🎓',
      color: '#FFF0E8',
      borderColor: ORANGE,
      items: [
        '後輩に自分の経験・知見を活かせる',
        '家庭教師として副収入を得られる',
        'コンテンツ制作で継続収益',
        '母校とのつながりが深まる',
      ],
    },
    {
      role: '学校・教員',
      emoji: '🏫',
      color: '#F0FDF4',
      borderColor: '#22C55E',
      items: [
        'キャリア教育のDXでコスト削減',
        'OBOGネットワークの構造的管理',
        '生徒の目標・成績を一元把握',
        '保護者への進路サポート強化',
      ],
    },
  ];

  return (
    <section id="impact" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3" style={{ background: '#FFF0E8', color: ORANGE }}>
            導入効果
          </span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            関わる全員が、豊かになる
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
            Torchは生徒・OBOG・学校の三者全員にメリットをもたらす設計です
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {impacts.map((impact) => (
            <div key={impact.role} className="bg-white rounded-2xl p-6 shadow-sm border-t-4"
              style={{ borderTopColor: impact.borderColor }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{impact.emoji}</span>
                <h3 className="text-lg font-black" style={{ color: NAVY }}>{impact.role}</h3>
              </div>
              <ul className="space-y-2.5">
                {impact.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0"
                      style={{ background: impact.borderColor }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   BUSINESS MODEL SECTION
══════════════════════════════════════════ */
function BusinessModelSection() {
  return (
    <section id="business" className="py-20" style={{ background: NAVY }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3"
            style={{ background: 'rgba(255,107,53,0.2)', color: ORANGE, border: `1px solid ${ORANGE}` }}>
            ビジネスモデル
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            持続可能な三者共創モデル
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            学校・OBOG・バディアスが共にメリットを享受する設計
          </p>
        </div>

        {/* Revenue streams */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            {
              icon: '💻', title: 'システム利用料', amount: '200円/人/月',
              desc: '生徒一人あたり月額200円の定額プラン。100名規模の学校で月2万円〜。低コストで全機能を利用可能。',
              badge: '定額',
            },
            {
              icon: '📝', title: 'コンテンツ制作費', amount: '記事2万〜 / 動画5万〜',
              desc: 'OBOGが執筆・制作するキャリアコンテンツの費用。高校・大学・企業のニーズに応じたカスタム制作。',
              badge: '都度',
            },
            {
              icon: '🤝', title: '家庭教師手数料', amount: '収益の18%',
              desc: 'マッチング成立時に取引額の18%を手数料として受領。OBOGへ67%・学校へ15%が還元される仕組み。',
              badge: '成果報酬',
            },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{r.icon}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,107,53,0.2)', color: ORANGE }}>{r.badge}</span>
              </div>
              <p className="font-bold text-white mb-1">{r.title}</p>
              <p className="font-black mb-2" style={{ color: AMBER }}>{r.amount}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Revenue split pie-like */}
        <div className="bg-white bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-10">
          <p className="text-white font-bold text-center mb-6">家庭教師マッチング 収益配分</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 rounded-l-full" style={{ width: '67%', background: ORANGE }}></div>
            <div className="h-8" style={{ width: '15%', background: '#22C55E' }}></div>
            <div className="h-8 rounded-r-full" style={{ width: '18%', background: AMBER }}></div>
          </div>
          <div className="flex justify-center gap-8">
            {[
              { label: 'OBOG (大学生)', value: '67%', color: ORANGE },
              { label: '学校', value: '15%', color: '#22C55E' },
              { label: 'バディアス', value: '18%', color: AMBER },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: item.color }}></div>
                <p className="text-white font-black text-lg">{item.value}</p>
                <p className="text-gray-400 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PRICING SECTION
══════════════════════════════════════════ */
function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3" style={{ background: '#FFF0E8', color: ORANGE }}>
            料金プラン
          </span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            シンプルで透明な料金体系
          </h2>
          <p className="text-gray-500 mt-3">すべての機能が1つのプランで利用可能</p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="rounded-3xl p-8 shadow-2xl border-2 relative overflow-hidden" style={{ borderColor: ORANGE }}>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: ORANGE }}>
              スタンダード
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-black" style={{ color: NAVY }}>200</span>
              <span className="text-xl font-bold text-gray-500 pb-1">円</span>
              <span className="text-gray-400 pb-1">/ 人 / 月</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">全機能含む、年間一括払い</p>
            <ul className="space-y-3 mb-8">
              {[
                'キャリア台帳（OBOG管理）',
                'AIレコメンド機能',
                'キャリア相談チャット',
                '目標管理（年次〜週次）',
                '家庭教師マッチング',
                'キャリアコンテンツ閲覧',
                '生徒情報ダッシュボード',
                'OBOG登録数無制限',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
                    style={{ background: ORANGE }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#contact" className="block w-full py-3.5 rounded-xl text-center font-bold text-white text-base shadow-lg transition-transform hover:scale-105"
              style={{ background: ORANGE }}>
              資料請求・お問い合わせ
            </a>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          ※ コンテンツ制作・家庭教師マッチングは別途お見積もり。まずはお気軽にご相談ください。
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CTA / CONTACT SECTION
══════════════════════════════════════════ */
function CtaSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-5">
          <TorchIcon size={52} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: NAVY }}>
          Torchで、学校のキャリア教育を<br/>次のステージへ。
        </h2>
        <p className="text-gray-500 mb-8 text-base leading-relaxed">
          導入事例・料金・機能の詳細は資料にまとめています。<br/>
          まずはお気軽にお問い合わせください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="mailto:info@buddies.co.jp" className="px-8 py-3.5 rounded-full font-bold text-white text-base shadow-xl transition-transform hover:scale-105"
            style={{ background: ORANGE }}>
            資料請求する（無料）
          </a>
          <a href="mailto:info@buddies.co.jp" className="px-8 py-3.5 rounded-full font-bold text-base border-2 transition-colors hover:bg-navy text-gray-700 hover:text-white"
            style={{ borderColor: NAVY }}>
            デモを依頼する
          </a>
        </div>
        <p className="text-gray-400 text-sm">
          お電話でのお問い合わせ：<span className="font-bold text-gray-600">03-XXXX-XXXX</span>（平日 10:00〜18:00）
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function LandingFooter() {
  return (
    <footer className="py-10 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TorchIcon size={28} />
            <div>
              <p className="font-black text-lg leading-tight" style={{ color: NAVY }}>Torch</p>
              <p className="text-xs text-gray-400">by 株式会社バディアス</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">機能</a>
            <a href="#impact" className="hover:text-gray-900 transition-colors">導入効果</a>
            <a href="#business" className="hover:text-gray-900 transition-colors">ビジネスモデル</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">料金</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">お問い合わせ</a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2025 株式会社バディアス. All rights reserved.</p>
          <p className="text-xs text-gray-400">ミッション：キャリア形成における障壁をなくす</p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   LANDING PAGE (main export)
══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="font-sans antialiased bg-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSection />
      <SolutionBanner />
      <FeaturesSection />
      <ImpactSection />
      <BusinessModelSection />
      <PricingSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
