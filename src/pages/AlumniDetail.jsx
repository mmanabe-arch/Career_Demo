import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, GraduationCap, MapPin, Calendar,
  MessageCircle, BookOpen, Briefcase, ChevronRight
} from 'lucide-react';
import { alumniList } from '../data/alumni';
import { useApp } from '../context/AppContext';

const subjectLabels = { japanese: '国語', math: '数学', english: '英語', science: '理科', social: '社会' };
const subjectColors = {
  japanese: { high: '#16a34a', mid: '#86efac', low: '#dcfce7' },
  math:     { high: '#2563eb', mid: '#93c5fd', low: '#dbeafe' },
  english:  { high: '#9333ea', mid: '#d8b4fe', low: '#f3e8ff' },
  science:  { high: '#ea580c', mid: '#fdba74', low: '#ffedd5' },
  social:   { high: '#ca8a04', mid: '#fde047', low: '#fefce8' },
};

function getHeatColor(score, subject) {
  const c = subjectColors[subject];
  if (score >= 75) return c.high;
  if (score >= 65) return c.mid;
  return c.low;
};

function getTextColor(score) {
  return score >= 75 ? 'text-white' : score >= 65 ? 'text-gray-700' : 'text-gray-500';
}

export default function AlumniDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, openInterviewModal } = useApp();
  const [activeTab, setActiveTab] = useState('school');

  const alumni = alumniList.find(a => a.id === Number(id));

  if (!alumni) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">OB・OGが見つかりません</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">一覧に戻る</button>
      </div>
    );
  }

  const tabs = [
    { key: 'school', label: '在校時代', icon: BookOpen, available: !!alumni.schoolDays },
    { key: 'university', label: '大学時代', icon: GraduationCap, available: !!alumni.universityDays },
    { key: 'career', label: '社会人キャリア', icon: Briefcase, available: true },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        一覧に戻る
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shrink-0">
            {alumni.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{alumni.name}</h1>
              <span className="text-sm text-gray-400">{alumni.nameKana}</span>
              <span className="badge bg-primary-100 text-primary-700">{alumni.graduationYear}年卒</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{alumni.currentRole}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{alumni.currentCompany}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span>{alumni.university} {alumni.faculty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{alumni.location}</span>
              </div>
            </div>
            {alumni.bio && (
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{alumni.bio}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {alumni.tags.map(tag => (
                <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
              ))}
            </div>
          </div>
          {role === 'student' && alumni.canMentor && (
            <button
              onClick={() => openInterviewModal(alumni)}
              className="flex items-center gap-2 btn-primary shrink-0"
            >
              <Calendar className="w-4 h-4" />
              面談を申し込む
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(({ key, label, icon: Icon, available }) => (
            <button
              key={key}
              onClick={() => available && setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors flex-1 justify-center ${
                !available ? 'text-gray-300 cursor-not-allowed' :
                activeTab === key
                  ? 'border-primary-600 text-primary-700 bg-primary-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'school' && <SchoolTab alumni={alumni} />}
          {activeTab === 'university' && <UniversityTab alumni={alumni} />}
          {activeTab === 'career' && <CareerTab alumni={alumni} />}
        </div>
      </div>
    </div>
  );
}

function SchoolTab({ alumni }) {
  if (!alumni.schoolDays) {
    return <EmptyState message="在校時代のデータがありません" />;
  }
  const { clubs, testimonial, mockExamResults } = alumni.schoolDays;
  const subjects = ['japanese', 'math', 'english', 'science', 'social'];

  return (
    <div className="space-y-8">
      {clubs && clubs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">部活・活動</h3>
          <div className="flex flex-wrap gap-2">
            {clubs.map(c => (
              <span key={c} className="badge bg-green-100 text-green-700 text-sm">{c}</span>
            ))}
          </div>
        </div>
      )}

      {testimonial && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">在校時代の体験談</h3>
          <div className="bg-gray-50 rounded-xl p-5">
            {testimonial.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">{para}</p>
            ))}
          </div>
        </div>
      )}

      {mockExamResults && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">模試判定推移（偏差値ヒートマップ）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left pr-3 py-2 text-gray-500 font-medium w-24">時期</th>
                  {subjects.map(s => (
                    <th key={s} className="px-2 py-2 text-gray-500 font-medium text-center">
                      {subjectLabels[s]}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-gray-500 font-medium text-center">総合</th>
                </tr>
              </thead>
              <tbody>
                {mockExamResults.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="pr-3 py-1.5 text-gray-600 text-xs whitespace-nowrap">{row.month}</td>
                    {subjects.map(s => (
                      <td key={s} className="px-1 py-1">
                        <div
                          className={`rounded text-center py-1 font-semibold text-xs ${getTextColor(row[s])}`}
                          style={{ backgroundColor: getHeatColor(row[s], s) }}
                        >
                          {row[s]}
                        </div>
                      </td>
                    ))}
                    <td className="px-1 py-1">
                      <div
                        className={`rounded text-center py-1 font-bold text-xs ${getTextColor(row.total)}`}
                        style={{ backgroundColor: getHeatColor(row.total, 'japanese') }}
                      >
                        {row.total}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#16a34a' }} />
              <span>75以上</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#86efac' }} />
              <span>65〜74</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dcfce7' }} />
              <span>64以下</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UniversityTab({ alumni }) {
  if (!alumni.universityDays) {
    return <EmptyState message="大学時代のデータがありません" />;
  }
  const { research, activities, testimony } = alumni.universityDays;
  return (
    <div className="space-y-6">
      {research && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">研究・専攻</h3>
          <p className="text-sm text-gray-700 bg-blue-50 rounded-xl p-4">{research}</p>
        </div>
      )}
      {activities && activities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">課外活動</h3>
          <div className="flex flex-wrap gap-2">
            {activities.map(a => (
              <span key={a} className="badge bg-blue-100 text-blue-700 text-sm">{a}</span>
            ))}
          </div>
        </div>
      )}
      {testimony && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">大学時代を振り返って</h3>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{testimony}</p>
        </div>
      )}
    </div>
  );
}

function CareerTab({ alumni }) {
  if (!alumni.career || alumni.career.length === 0) {
    return <EmptyState message="職歴データがありません" />;
  }
  return (
    <div>
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
        <div className="space-y-6">
          {alumni.career.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow" />
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                    {item.year}年〜
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mt-1">{item.role}</h4>
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />{item.company}
                </p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
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
