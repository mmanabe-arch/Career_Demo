import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, MapPin, Building2, GraduationCap, Calendar,
  X, BookOpen, Users, Briefcase, Star, Lock, ChevronRight,
} from 'lucide-react';
import {
  alumniList, industryList, universityList, graduationYears, locationList,
} from '../data/alumni';
import { useApp } from '../context/AppContext';

const dataLevelBadge = {
  full:    { label: '詳細', color: 'bg-primary-100 text-primary-700' },
  medium:  { label: '標準', color: 'bg-blue-100 text-blue-700' },
  minimal: { label: '基本', color: 'bg-gray-100 text-gray-500' },
};

// ==================== Recommendation Engine ====================

function scoreAlumni(alumni, profile) {
  if (alumni.status !== 'working') return { score: 0, reasons: [] };
  let score = 0;
  const reasons = [];

  if (profile.targetUniversities?.includes(alumni.university)) {
    score += 10;
    reasons.push(`${alumni.university}出身`);
  }
  if (profile.targetIndustries?.includes(alumni.industry)) {
    score += 8;
    reasons.push('目標業界');
  }
  const tagHits = alumni.tags.filter(t =>
    profile.interests?.some(i => t.includes(i) || i.includes(t))
  );
  if (tagHits.length) {
    score += tagHits.length * 3;
    reasons.push('興味が一致');
  }
  if (alumni.canMentor) { score += 4; reasons.push('面談可能'); }
  if (alumni.dataLevel === 'full') score += 2;
  return { score, reasons };
}

function RecommendedSection({ profile, onView, onInterview }) {
  const recommended = useMemo(() => {
    return alumniList
      .map(a => ({ ...a, ...scoreAlumni(a, profile) }))
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [profile]);

  if (!recommended.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <h2 className="font-bold text-gray-900">あなたへのおすすめOBOG</h2>
        <span className="text-xs text-gray-400">（目標・興味に基づく）</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recommended.map(alumni => (
          <div
            key={alumni.id}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => onView(`/alumni/${alumni.id}`)}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                {alumni.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{alumni.name}</p>
                <p className="text-xs text-gray-500 truncate">{alumni.university}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 truncate mb-2.5">{alumni.currentRole}</p>
            <div className="flex flex-wrap gap-1">
              {alumni.reasons.slice(0, 2).map(r => (
                <span key={r} className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{r}</span>
              ))}
              {alumni.canMentor && (
                <span className="text-xs bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded-full">面談可</span>
              )}
            </div>
            <button
              className="mt-3 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
              onClick={e => { e.stopPropagation(); onInterview(alumni); }}
            >
              <Calendar className="w-3 h-3" />
              面談を申し込む
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Main Component ====================

export default function AlumniList() {
  const navigate = useNavigate();
  const { role, openInterviewModal, openTutoringModal, studentProfile } = useApp();

  const [statusTab, setStatusTab] = useState('all');
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterMentor, setFilterMentor] = useState(false);
  const [filterTutor, setFilterTutor] = useState(false);
  const [filterLecture, setFilterLecture] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Derive tag list from all alumni
  const tagList = useMemo(() => {
    const all = new Set();
    alumniList.forEach(a => a.tags.forEach(t => all.add(t)));
    return [...all].sort();
  }, []);

  const filtered = useMemo(() => {
    return alumniList.filter(a => {
      if (statusTab === 'working' && a.status !== 'working') return false;
      if (statusTab === 'university' && a.status !== 'university') return false;

      const q = search.toLowerCase();
      if (q) {
        const hit =
          a.name.includes(search) ||
          a.nameKana.includes(q) ||
          a.currentCompany.toLowerCase().includes(q) ||
          a.currentRole.toLowerCase().includes(q) ||
          a.university.toLowerCase().includes(q) ||
          a.faculty.toLowerCase().includes(q) ||
          a.industry?.toLowerCase().includes(q) ||
          a.location.includes(q) ||
          String(a.graduationYear).includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q)) ||
          (a.tutorSubjects ?? []).some(s => s.includes(q));
        if (!hit) return false;
      }

      if (filterIndustry && a.industry !== filterIndustry) return false;
      if (filterUniversity && a.university !== filterUniversity) return false;
      if (filterLocation && a.location !== filterLocation) return false;
      if (filterTag && !a.tags.includes(filterTag)) return false;
      if (filterYear && String(a.graduationYear) !== filterYear) return false;
      if (filterMentor && !a.canMentor) return false;
      if (filterTutor && !a.canTutor) return false;
      if (filterLecture && !a.canLecture) return false;

      return true;
    });
  }, [search, filterIndustry, filterUniversity, filterLocation, filterTag, filterYear, filterMentor, filterTutor, filterLecture, statusTab]);

  const hasFilter = filterIndustry || filterUniversity || filterLocation || filterTag || filterYear || filterMentor || filterTutor || filterLecture;

  const resetFilters = () => {
    setFilterIndustry(''); setFilterUniversity(''); setFilterLocation('');
    setFilterTag(''); setFilterYear('');
    setFilterMentor(false); setFilterTutor(false); setFilterLecture(false);
  };

  const workingCount    = alumniList.filter(a => a.status === 'working').length;
  const universityCount = alumniList.filter(a => a.status === 'university').length;

  // Active filter count badge
  const activeFilterCount = [filterIndustry, filterUniversity, filterLocation, filterTag, filterYear]
    .filter(Boolean).length + [filterMentor, filterTutor, filterLecture].filter(Boolean).length;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">キャリア台帳</h1>
        <p className="text-gray-500 text-sm mt-1">OB・OG {alumniList.length}名のキャリア情報</p>
      </div>

      {/* Recommendation (student only) */}
      {role === 'student' && (
        <RecommendedSection
          profile={studentProfile}
          onView={(path) => navigate(path)}
          onInterview={openInterviewModal}
        />
      )}

      {/* OBOG viewing restriction notice */}
      {role === 'alumni' && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">個人情報保護モード</p>
            <p className="text-amber-700 text-xs mt-0.5">OB・OGが登録した詳細情報（経歴・体験談・連絡先）は、個人情報保護の観点から他のOB・OGには表示されません。</p>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all',        label: 'すべて',  count: alumniList.length,  icon: Users },
          { key: 'working',    label: '社会人',  count: workingCount,       icon: Briefcase },
          { key: 'university', label: '大学生',  count: universityCount,    icon: GraduationCap },
        ].map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setStatusTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              statusTab === key
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              statusTab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="名前・企業・大学・職種・業界・地域・年次・タグで検索..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors shrink-0 ${
              hasFilter
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">絞り込み</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary-500 text-white text-xs font-bold shrink-0">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilter && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            {/* Row 1: Industry / University */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">業界</label>
                <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">すべての業界</option>
                  {industryList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">進学大学</label>
                <select value={filterUniversity} onChange={e => setFilterUniversity(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">すべての大学</option>
                  {universityList.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            {/* Row 2: Location / Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">勤務地</label>
                <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">すべての地域</option>
                  {locationList.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">卒業年</label>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">すべての年度</option>
                  {graduationYears.map(y => <option key={y} value={String(y)}>{y}年卒</option>)}
                </select>
              </div>
            </div>
            {/* Row 3: Tag */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">タグ</label>
              <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                <option value="">すべてのタグ</option>
                {tagList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: '面談可のみ',     checked: filterMentor,  onChange: setFilterMentor,  accent: 'accent-primary-600' },
                { label: '家庭教師可のみ', checked: filterTutor,   onChange: setFilterTutor,   accent: 'accent-amber-500' },
                { label: '講演可のみ',     checked: filterLecture, onChange: setFilterLecture, accent: 'accent-blue-500' },
              ].map(({ label, checked, onChange, accent }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
                    className={`w-4 h-4 ${accent}`} />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{filtered.length}</span>件表示
        </p>
        {hasFilter && (
          <button onClick={resetFilters} className="text-xs text-primary-600 hover:underline">
            絞り込みをリセット
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(alumni => (
          <AlumniCard
            key={alumni.id}
            alumni={alumni}
            role={role}
            onView={() => navigate(`/alumni/${alumni.id}`)}
            onInterview={() => openInterviewModal(alumni)}
            onTutoring={() => openTutoringModal(alumni)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>検索結果がありません</p>
            <button
              onClick={() => { setSearch(''); resetFilters(); setStatusTab('all'); }}
              className="mt-3 text-sm text-primary-600 hover:underline"
            >
              すべてクリア
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Alumni Card ====================

function AlumniCard({ alumni, role, onView, onInterview, onTutoring }) {
  const badge = dataLevelBadge[alumni.dataLevel];
  const isUniversity = alumni.status === 'university';
  const isAlumniRole = role === 'alumni';

  // OBOG同士の閲覧制限
  if (isAlumniRole) {
    return (
      <div className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col ${
        isUniversity ? 'border-amber-100' : 'border-gray-100'
      }`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-gray-900 text-sm">{alumni.name}</h3>
              {isUniversity && <span className="badge text-xs bg-amber-100 text-amber-700 shrink-0">大学生</span>}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{alumni.university} {alumni.graduationYear}年卒</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {alumni.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>個人情報保護のため詳細は非公開</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col ${
      isUniversity ? 'border-amber-100' : 'border-gray-100'
    }`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${
          isUniversity
            ? 'bg-gradient-to-br from-amber-400 to-amber-600'
            : 'bg-gradient-to-br from-primary-400 to-primary-600'
        }`}>
          {alumni.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm truncate">{alumni.name}</h3>
            {isUniversity && (
              <span className="badge text-xs bg-amber-100 text-amber-700 shrink-0">大学生</span>
            )}
            <span className={`badge text-xs shrink-0 ${badge.color}`}>{badge.label}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{alumni.nameKana}</p>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <div className="flex items-start gap-2">
          {isUniversity
            ? <GraduationCap className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            : <Building2 className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />}
          <div>
            <p className="text-xs font-medium text-gray-800 leading-snug">{alumni.currentRole}</p>
            <p className="text-xs text-gray-500">{isUniversity ? alumni.university : alumni.currentCompany}</p>
          </div>
        </div>
        {!isUniversity && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <p className="text-xs text-gray-600">{alumni.university} {alumni.faculty}</p>
          </div>
        )}
        {isUniversity && alumni.tutorSubjects?.length > 0 && (
          <div className="flex items-start gap-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600">指導科目: {alumni.tutorSubjects.join('・')}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <p className="text-xs text-gray-500">{alumni.location}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {alumni.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={onView}
          className={`flex-1 text-xs font-medium py-2 rounded-lg text-white transition-colors ${
            isUniversity ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          詳細を見る
        </button>
        {role === 'student' && !isUniversity && alumni.canMentor && (
          <button
            onClick={onInterview}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            面談
          </button>
        )}
        {role === 'student' && isUniversity && alumni.canTutor && (
          <button
            onClick={onTutoring}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            家庭教師
          </button>
        )}
      </div>
    </div>
  );
}
