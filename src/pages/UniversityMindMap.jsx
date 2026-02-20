import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, GraduationCap, Building2, Calendar, Users, ChevronRight, BookOpen } from 'lucide-react';
import { alumniList } from '../data/alumni';
import { useApp } from '../context/AppContext';

// 大学ごとの色設定
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

function getColor(university) {
  return UNIVERSITY_COLORS[university] || DEFAULT_COLOR;
}

// 放射状に均等配置する座標を計算
function getNodePositions(universities, cx, cy, rx, ry) {
  const n = universities.length;
  return universities.map((univ, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2; // 上から開始
    return {
      univ,
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
      angle,
    };
  });
}

// 接続線の制御点（ベジェ曲線）
function getCurvePath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export default function UniversityMindMap() {
  const navigate = useNavigate();
  const { role, openInterviewModal, openTutoringModal } = useApp();
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 540 });

  // レスポンシブ対応
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setSize({ w: width, h: Math.max(420, Math.min(width * 0.65, 600)) });
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
    // 人数順にソート
    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([univ, members]) => ({ univ, members }));
  }, []);

  const { w, h } = size;
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.min(w * 0.36, 210);
  const ry = Math.min(h * 0.38, 185);

  const nodePositions = useMemo(
    () => getNodePositions(universityGroups.map(g => g.univ), cx, cy, rx, ry),
    [universityGroups, cx, cy, rx, ry]
  );

  const handleSelect = useCallback((univ) => {
    setSelected(prev => prev === univ ? null : univ);
  }, []);

  const selectedMembers = useMemo(
    () => universityGroups.find(g => g.univ === selected)?.members ?? [],
    [selected, universityGroups]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">進学マップ</h1>
        <p className="text-gray-500 text-sm mt-1">
          大学ノードをクリックすると、その大学に進学した先輩の一覧が表示されます
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
                style={{ height: h, maxHeight: 600 }}
              >
                {/* 接続線 */}
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
                      opacity={selected && !isSelected ? 0.35 : 1}
                      style={{ transition: 'all 0.25s' }}
                    />
                  );
                })}

                {/* センターノード */}
                <g>
                  <circle cx={cx} cy={cy} r={44} fill="#15803d" />
                  <circle cx={cx} cy={cy} r={44} fill="none" stroke="#86efac" strokeWidth={3} />
                  <GraduationCap
                    x={cx - 13} y={cy - 20}
                    width={26} height={26}
                    color="white"
                  />
                  <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">
                    本校
                  </text>
                  <text x={cx} y={cy + 27} textAnchor="middle" fill="#bbf7d0" fontSize={9.5}>
                    {alumniList.length}名
                  </text>
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
                      opacity={selected && !isSelected ? 0.4 : 1}
                    >
                      {/* 選択時の光彩 */}
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
                      {/* 大学名 */}
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
                      {/* 人数バッジ */}
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

        {/* 右パネル：選択した大学の先輩一覧 */}
        <div className={`xl:w-80 transition-all duration-300 ${selected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col" style={{ minHeight: 300 }}>
            {selected && (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">{selected}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <Users className="w-3.5 h-3.5 inline mr-1" />
                      {selectedMembers.length}名が進学
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {selectedMembers.map(alumni => {
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
              </>
            )}
            {!selected && (
              <div className="flex-1 flex items-center justify-center text-gray-300">
                <div className="text-center p-6">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">大学ノードをクリックしてください</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* モバイル: 選択時の下パネル */}
      {selected && (
        <div className="xl:hidden mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">{selected}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{selectedMembers.length}名が進学</p>
            </div>
            <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedMembers.map(alumni => {
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
        </div>
      )}
    </div>
  );
}
