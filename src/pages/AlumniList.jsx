import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Building2, GraduationCap, Calendar, X, BookOpen, Users, Briefcase } from 'lucide-react';
import { alumniList, industryList, universityList } from '../data/alumni';
import { useApp } from '../context/AppContext';

const dataLevelBadge = {
  full:    { label: '詳細', color: 'bg-primary-100 text-primary-700' },
  medium:  { label: '標準', color: 'bg-blue-100 text-blue-700' },
  minimal: { label: '基本', color: 'bg-gray-100 text-gray-500' },
};

export default function AlumniList() {
  const navigate = useNavigate();
  const { role, openInterviewModal, openTutoringModal } = useApp();

  // ステータスタブ
  const [statusTab, setStatusTab] = useState('all'); // 'all' | 'working' | 'university'

  // フィルタ
  const [search, setSearch]               = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterMentor, setFilterMentor]   = useState(false);
  const [filterTutor, setFilterTutor]     = useState(false);
  const [showFilter, setShowFilter]       = useState(false);

  const filtered = useMemo(() => {
    return alumniList.filter(a => {
      // ステータスタブ
      if (statusTab === 'working' && a.status !== 'working') return false;
      if (statusTab === 'university' && a.status !== 'university') return false;

      // テキスト検索
      const q = search.toLowerCase();
      if (q) {
        const hit =
          a.name.includes(search) ||
          a.nameKana.includes(q) ||
          a.currentCompany.toLowerCase().includes(q) ||
          a.currentRole.toLowerCase().includes(q) ||
          a.university.toLowerCase().includes(q) ||
          a.faculty.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q)) ||
          (a.tutorSubjects ?? []).some(s => s.includes(q));
        if (!hit) return false;
      }

      if (filterIndustry   && a.industry !== filterIndustry)   return false;
      if (filterUniversity && a.university !== filterUniversity) return false;
      if (filterMentor && !a.canMentor)  return false;
      if (filterTutor  && !a.canTutor)   return false;

      return true;
    });
  }, [search, filterIndustry, filterUniversity, filterMentor, filterTutor, statusTab]);

  const hasFilter = filterIndustry || filterUniversity || filterMentor || filterTutor;

  const resetFilters = () => {
    setFilterIndustry('');
    setFilterUniversity('');
    setFilterMentor(false);
    setFilterTutor(false);
  };

  const workingCount    = alumniList.filter(a => a.status === 'working').length;
  const universityCount = alumniList.filter(a => a.status === 'university').length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">キャリア台帳</h1>
        <p className="text-gray-500 text-sm mt-1">OB・OG {alumniList.length}名のキャリア情報</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all',        label: 'すべて',   count: alumniList.length,  icon: Users },
          { key: 'working',    label: '社会人',   count: workingCount,       icon: Briefcase },
          { key: 'university', label: '大学生',   count: universityCount,    icon: GraduationCap },
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
              placeholder="名前・企業・大学・職種・科目で検索..."
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
            {hasFilter && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
          </button>
        </div>

        {showFilter && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">業界</label>
                <select
                  value={filterIndustry}
                  onChange={e => setFilterIndustry(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">すべての業界</option>
                  {industryList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">大学</label>
                <select
                  value={filterUniversity}
                  onChange={e => setFilterUniversity(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">すべての大学</option>
                  {universityList.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterMentor}
                  onChange={e => setFilterMentor(e.target.checked)}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-gray-700">面談可のみ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterTutor}
                  onChange={e => setFilterTutor(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm text-gray-700">家庭教師可のみ</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
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
            <button onClick={() => { setSearch(''); resetFilters(); setStatusTab('all'); }}
              className="mt-3 text-sm text-primary-600 hover:underline">
              すべてクリア
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AlumniCard({ alumni, role, onView, onInterview, onTutoring }) {
  const badge = dataLevelBadge[alumni.dataLevel];
  const isUniversity = alumni.status === 'university';

  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col ${
      isUniversity ? 'border-amber-100' : 'border-gray-100'
    }`}>
      {/* Avatar & Name */}
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

      {/* Info */}
      <div className="space-y-2 flex-1">
        <div className="flex items-start gap-2">
          {isUniversity ? <GraduationCap className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" /> : <Building2 className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />}
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
            <p className="text-xs text-gray-600">
              指導科目: {alumni.tutorSubjects.join('・')}
            </p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <p className="text-xs text-gray-500">{alumni.location}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {alumni.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={onView}
          className={`flex-1 text-xs font-medium py-2 rounded-lg text-white transition-colors ${
            isUniversity
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-primary-600 hover:bg-primary-700'
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
