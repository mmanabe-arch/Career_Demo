import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, GraduationCap, Building2, Calendar, Users, ChevronRight, ChevronLeft, BookOpen, Briefcase } from 'lucide-react';
import { alumniList } from '../data/alumni';
import { useApp } from '../context/AppContext';

// ===== 大学ごとの色設定 =====
const UNIVERSITY_COLORS = {
  '京都大学':     { bg: '#7c3aed', light: '#ede9fe', text: '#5b21b6' },
  '大阪大学':     { bg: '#2563eb', light: '#dbeafe', text: '#1d4ed8' },
  '慶應義塾大学': { bg: '#0891b2', light: '#cffafe', text: '#0e7490' },
  '神戸大学':     { bg: '#059669', light: '#d1fae5', text: '#047857' },
  '東北大学':     { bg: '#d97706', light: '#fef3c7', text: '#b45309' },
  '早稲田大学':   { bg: '#dc2626', light: '#fee2e2', text: '#b91c1c' },
  '東京大学':     { bg: '#7c3aed', light: '#ede9fe', text: '#6d28d9' },
  '一橋大学':     { bg: '#0f766e', light: '#ccfbf1', text: '#0d6e65' },
};
const DEFAULT_COLOR = { bg: '#6b7280', light: '#f3f4f6', text: '#4b5563' };

// ===== 業界カテゴリーの色設定 =====
const INDUSTRY_COLORS = {
  'IT・テクノロジー':     { bg: '#0284c7', light: '#e0f2fe', text: '#0369a1' },
  '金融・銀行':           { bg: '#0891b2', light: '#cffafe', text: '#0e7490' },
  '医療・ヘルスケア':     { bg: '#059669', light: '#d1fae5', text: '#047857' },
  '法律・コンサルティング': { bg: '#7c3aed', light: '#ede9fe', text: '#5b21b6' },
  'コンサルティング':     { bg: '#8b5cf6', light: '#f5f3ff', text: '#6d28d9' },
  'メーカー・製造':       { bg: '#dc2626', light: '#fee2e2', text: '#b91c1c' },
  'メディア・広告':       { bg: '#db2777', light: '#fce7f3', text: '#9d174d' },
  '教育':                 { bg: '#d97706', light: '#fef3c7', text: '#b45309' },
  '公務員・行政':         { bg: '#6b7280', light: '#f3f4f6', text: '#374151' },
  '大学在学中':           { bg: '#f59e0b', light: '#fef3c7', text: '#92400e' },
  'その他':               { bg: '#9ca3af', light: '#f9fafb', text: '#4b5563' },
};

function getColor(university) {
  return UNIVERSITY_COLORS[university] || DEFAULT_COLOR;
}
function getIndustryColor(industry) {
  return INDUSTRY_COLORS[industry] || DEFAULT_COLOR;
}

// SVG ノード表示用の短い業界ラベル
function shortInd(ind) {
  if (ind.includes('・')) return ind.split('・')[0].slice(0, 4);
  return ind.slice(0, 4);
}

// 放射状に均等配置する座標を計算
function getNodePositions(universities, cx, cy, rx, ry) {
  const n = universities.length;
  return universities.map((univ, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { univ, x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle), angle };
  });
}

// 接続線の制御点（ベジェ曲線）
function getCurvePath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

// 業界サブノードを大学ノードから扇形に展開する座標を計算
function getIndustryPositions(univX, univY, cx, cy, n) {
  if (n === 0) return [];
  const baseAngle = Math.atan2(univY - cy, univX - cx); // 中心→大学の方向（外向き）
  const spread = n === 1 ? 0 : Math.min(Math.PI * 1.1, (n - 1) * (Math.PI / 3.2));
  const dist = 92;
  return Array.from({ length: n }, (_, i) => {
    const angle = n === 1 ? baseAngle : (baseAngle - spread / 2) + i * (spread / (n - 1));
    return { x: univX + dist * Math.cos(angle), y: univY + dist * Math.sin(angle) };
  });
}

export default function UniversityMindMap() {
  const navigate = useNavigate();
  const { role, openInterviewModal, openTutoringModal } = useApp();
  const [selected, setSelected] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 540 });

  // 大学が変わったら業界選択をリセット
  useEffect(() => {
    setSelectedIndustry(null);
  }, [selected]);

  // レスポンシブ対応
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setSize({ w: width, h: Math.max(460, Math.min(width * 0.68, 640)) });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 大学ごとに集計
  const universityGroups = useMemo(() => {
    const map = {};
    alumniList.forEach(a => {
      if (!map[a.university]) map[a.university] = [];
      map[a.university].push(a);
    });
    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([univ, members]) => ({ univ, members }));
  }, []);

  const { w, h } = size;
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.min(w * 0.34, 200);
  const ry = Math.min(h * 0.36, 175);

  const nodePositions = useMemo(
    () => getNodePositions(universityGroups.map(g => g.univ), cx, cy, rx, ry),
    [universityGroups, cx, cy, rx, ry]
  );

  const handleSelect = useCallback((univ) => {
    setSelected(prev => prev === univ ? null : univ);
  }, []);

  // 選択大学の全メンバー
  const selectedMembers = useMemo(
    () => universityGroups.find(g => g.univ === selected)?.members ?? [],
    [selected, universityGroups]
  );

  // 業界カテゴリーごとに集計
  const industryGroups = useMemo(() => {
    if (!selected) return [];
    const map = {};
    selectedMembers.forEach(a => {
      const ind = a.industry || (a.status === 'university' ? '大学在学中' : 'その他');
      if (!map[ind]) map[ind] = [];
      map[ind].push(a);
    });
    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([ind, members]) => ({ ind, members }));
  }, [selected, selectedMembers]);

  // 業界で絞り込んだメンバー
  const displayedMembers = useMemo(() => {
    if (!selectedIndustry) return [];
    return selectedMembers.filter(a => {
      const ind = a.industry || (a.status === 'university' ? '大学在学中' : 'その他');
      return ind === selectedIndustry;
    });
  }, [selectedIndustry, selectedMembers]);

  // SVG上の業界サブノード座標
  const industryPositions = useMemo(() => {
    if (!selected) return [];
    const univNode = nodePositions.find(p => p.univ === selected);
    if (!univNode) return [];
    const positions = getIndustryPositions(univNode.x, univNode.y, cx, cy, industryGroups.length);
    return industryGroups.map((g, i) => ({ ...g, ...positions[i] }));
  }, [selected, industryGroups, nodePositions, cx, cy]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">進学マップ</h1>
        <p className="text-gray-500 text-sm mt-1">
          大学ノードをクリックすると就職先カテゴリーが展開されます。カテゴリーをクリックすると先輩一覧が表示されます
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Mind Map */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5">
            <div ref={containerRef} className="w-full">
              <svg
                width={w}
                height={h}
                viewBox={`0 0 ${w} ${h}`}
                className="w-full"
                style={{ height: h, maxHeight: 640 }}
              >
                {/* 大学ノード→センターの接続線 */}
                {nodePositions.map(({ univ, x, y }) => {
                  const color = getColor(univ);
                  const isSelected = selected === univ;
                  return (
                    <path
                      key={`line-${univ}`}
                      d={getCurvePath(cx, cy, x, y)}
                      stroke={isSelected ? color.bg : '#e5e7eb'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      fill="none"
                      strokeDasharray={isSelected ? 'none' : '4 3'}
                      opacity={selected && !isSelected ? 0.25 : 1}
                      style={{ transition: 'all 0.25s' }}
                    />
                  );
                })}

                {/* 業界サブノードの接続線 */}
                {selected && industryPositions.map(({ ind, x, y }) => {
                  const univNode = nodePositions.find(p => p.univ === selected);
                  const color = getIndustryColor(ind);
                  const isSelInd = selectedIndustry === ind;
                  return (
                    <line
                      key={`ind-line-${ind}`}
                      x1={univNode.x} y1={univNode.y}
                      x2={x} y2={y}
                      stroke={isSelInd ? color.bg : '#d1d5db'}
                      strokeWidth={isSelInd ? 2.5 : 1.5}
                      strokeDasharray={isSelInd ? 'none' : '3 2'}
                      style={{ transition: 'all 0.2s' }}
                    />
                  );
                })}

                {/* センターノード */}
                <g>
                  <circle cx={cx} cy={cy} r={44} fill="#15803d" />
                  <circle cx={cx} cy={cy} r={44} fill="none" stroke="#86efac" strokeWidth={3} />
                  <GraduationCap x={cx - 13} y={cy - 20} width={26} height={26} color="white" />
                  <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">本校</text>
                  <text x={cx} y={cy + 27} textAnchor="middle" fill="#bbf7d0" fontSize={9.5}>{alumniList.length}名</text>
                </g>

                {/* 大学ノード */}
                {nodePositions.map(({ univ, x, y }) => {
                  const group = universityGroups.find(g => g.univ === univ);
                  const count = group?.members.length ?? 0;
                  const color = getColor(univ);
                  const isSelected = selected === univ;
                  const nodeR = Math.max(34, Math.min(26 + count * 3.5, 52));
                  const labelLines = univ.length > 5
                    ? [univ.slice(0, univ.includes('大学') ? univ.indexOf('大学') : 4), univ.slice(univ.includes('大学') ? univ.indexOf('大学') : 4)]
                    : [univ];

                  return (
                    <g
                      key={univ}
                      onClick={() => handleSelect(univ)}
                      style={{ cursor: 'pointer' }}
                      opacity={selected && !isSelected ? 0.3 : 1}
                    >
                      {isSelected && (
                        <circle cx={x} cy={y} r={nodeR + 8} fill={color.light} opacity={0.8} />
                      )}
                      <circle
                        cx={x} cy={y} r={nodeR}
                        fill={isSelected ? color.bg : 'white'}
                        stroke={color.bg}
                        strokeWidth={isSelected ? 0 : 2}
                        style={{ transition: 'all 0.2s', filter: isSelected ? `drop-shadow(0 3px 8px ${color.bg}55)` : 'none' }}
                      />
                      {labelLines.map((line, li) => (
                        <text
                          key={li}
                          x={x}
                          y={y - (labelLines.length === 2 ? 7 : 5) + li * 14}
                          textAnchor="middle"
                          fill={isSelected ? 'white' : color.text}
                          fontSize={labelLines.length === 2 ? 9 : 10}
                          fontWeight="bold"
                        >
                          {line}
                        </text>
                      ))}
                      <text
                        x={x}
                        y={y + (labelLines.length === 2 ? 13 : 11)}
                        textAnchor="middle"
                        fill={isSelected ? '#bbf7d0' : '#6b7280'}
                        fontSize={9}
                      >
                        {count}名
                      </text>
                    </g>
                  );
                })}

                {/* 業界サブノード（大学選択時に展開） */}
                {selected && industryPositions.map(({ ind, x, y, members }) => {
                  const color = getIndustryColor(ind);
                  const isSelInd = selectedIndustry === ind;
                  const nodeR = 22;
                  const short = shortInd(ind);
                  return (
                    <g
                      key={`ind-${ind}`}
                      onClick={() => setSelectedIndustry(prev => prev === ind ? null : ind)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isSelInd && (
                        <circle cx={x} cy={y} r={nodeR + 7} fill={color.light} opacity={0.9} />
                      )}
                      <circle
                        cx={x} cy={y} r={nodeR}
                        fill={isSelInd ? color.bg : 'white'}
                        stroke={color.bg}
                        strokeWidth={isSelInd ? 0 : 2}
                        style={{
                          transition: 'all 0.2s',
                          filter: isSelInd ? `drop-shadow(0 2px 6px ${color.bg}66)` : 'none'
                        }}
                      />
                      <text
                        x={x} y={y - 4}
                        textAnchor="middle"
                        fill={isSelInd ? 'white' : color.text}
                        fontSize={7.5}
                        fontWeight="bold"
                      >
                        {short}
                      </text>
                      <text
                        x={x} y={y + 7}
                        textAnchor="middle"
                        fill={isSelInd ? '#dde' : '#9ca3af'}
                        fontSize={7}
                      >
                        {members.length}名
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 凡例 */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {universityGroups.map(({ univ, members }) => {
                const color = getColor(univ);
                const isSelected = selected === univ;
                return (
                  <button
                    key={univ}
                    onClick={() => handleSelect(univ)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                    style={{
                      background: isSelected ? color.bg : color.light,
                      color: isSelected ? 'white' : color.text,
                      borderColor: color.bg,
                      opacity: selected && !isSelected ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: isSelected ? 'white' : color.bg }}
                    />
                    {univ} ({members.length})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右パネル */}
        <div className={`xl:w-80 transition-all duration-300 ${selected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col" style={{ minHeight: 320 }}>

            {/* パネルヘッダー */}
            {selected && (
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {selectedIndustry && (
                      <button
                        onClick={() => setSelectedIndustry(null)}
                        className="p-1 hover:bg-gray-100 rounded-lg shrink-0 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                    <div className="min-w-0">
                      {selectedIndustry && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                          <span className="truncate max-w-[80px]">{selected}</span>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          <span className="truncate">{selectedIndustry}</span>
                        </div>
                      )}
                      <h2 className="font-bold text-gray-900 text-base truncate">
                        {selectedIndustry ? selectedIndustry : selected}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {selectedIndustry
                          ? `${displayedMembers.length}名`
                          : `${selectedMembers.length}名が進学`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            {/* パネルボディ */}
            <div className="flex-1 overflow-y-auto">

              {/* 空状態 */}
              {!selected && (
                <div className="flex-1 flex items-center justify-center text-gray-300 h-full">
                  <div className="text-center p-6">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">大学ノードをクリックしてください</p>
                  </div>
                </div>
              )}

              {/* 業界カテゴリー一覧 */}
              {selected && !selectedIndustry && (
                <div className="p-3 space-y-2">
                  <p className="text-xs text-gray-400 px-1 mb-2 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    就職先カテゴリー（クリックで絞り込み）
                  </p>
                  {industryGroups.map(({ ind, members }) => {
                    const color = getIndustryColor(ind);
                    return (
                      <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        className="w-full p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: color.bg }}
                            />
                            <span className="text-sm font-semibold text-gray-800">{ind}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: color.light, color: color.text }}
                            >
                              {members.length}名
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {members.slice(0, 3).map(a => (
                            <span
                              key={a.id}
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ background: color.light, color: color.text }}
                            >
                              {a.name}
                            </span>
                          ))}
                          {members.length > 3 && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
                              +{members.length - 3}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 業界で絞り込んだ先輩一覧 */}
              {selected && selectedIndustry && (
                <div className="p-3 space-y-2">
                  {displayedMembers.map(alumni => {
                    const color = getColor(selected);
                    return (
                      <div
                        key={alumni.id}
                        className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
                        onClick={() => navigate(`/alumni/${alumni.id}`)}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: color.bg }}
                          >
                            {alumni.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 truncate">{alumni.name}</p>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{alumni.faculty}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Building2 className="w-3 h-3 text-gray-300 shrink-0" />
                              <p className="text-xs text-gray-500 truncate">{alumni.currentRole}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {alumni.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ background: color.light, color: color.text }}
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            {alumni.graduationYear}年卒
                          </span>
                        </div>
                        {role === 'student' && alumni.status !== 'university' && alumni.canMentor && (
                          <button
                            onClick={e => { e.stopPropagation(); openInterviewModal(alumni); }}
                            className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                            style={{ borderColor: color.bg, color: color.text }}
                          >
                            <Calendar className="w-3 h-3" />
                            面談を申し込む
                          </button>
                        )}
                        {role === 'student' && alumni.status === 'university' && alumni.canTutor && (
                          <button
                            onClick={e => { e.stopPropagation(); openTutoringModal(alumni); }}
                            className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            家庭教師を申し込む
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* モバイル: 選択時の下パネル */}
      {selected && (
        <div className="xl:hidden mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* ヘッダー */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              {selectedIndustry && (
                <button
                  onClick={() => setSelectedIndustry(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
              )}
              <div className="min-w-0">
                {selectedIndustry && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                    <span className="truncate max-w-[80px]">{selected}</span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span className="truncate">{selectedIndustry}</span>
                  </div>
                )}
                <h2 className="font-bold text-gray-900 truncate">
                  {selectedIndustry ? selectedIndustry : selected}
                </h2>
                <p className="text-xs text-gray-400">
                  {selectedIndustry ? `${displayedMembers.length}名` : `${selectedMembers.length}名が進学`}
                </p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg shrink-0">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* 業界カテゴリー一覧（モバイル） */}
          {!selectedIndustry && (
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {industryGroups.map(({ ind, members }) => {
                const color = getIndustryColor(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className="p-3 rounded-xl border border-gray-100 text-left hover:shadow-sm transition-all"
                    style={{ borderLeftColor: color.bg, borderLeftWidth: 3 }}
                  >
                    <p className="text-xs font-bold text-gray-800 mb-1 leading-tight">{ind}</p>
                    <p className="text-xs font-bold" style={{ color: color.bg }}>{members.length}名</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {members.slice(0, 2).map(a => a.name).join('・')}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* 先輩一覧（モバイル） */}
          {selectedIndustry && (
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displayedMembers.map(alumni => {
                const color = getColor(selected);
                return (
                  <div
                    key={alumni.id}
                    className="p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate(`/alumni/${alumni.id}`)}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: color.bg }}
                      >
                        {alumni.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{alumni.name}</p>
                        <p className="text-xs text-gray-500 truncate">{alumni.faculty} · {alumni.graduationYear}年卒</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 truncate">{alumni.currentRole} / {alumni.currentCompany}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
