import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const roles = [
  { key: 'student', label: '在校生', icon: GraduationCap, color: 'text-blue-600' },
  { key: 'teacher', label: '先生', icon: BookOpen, color: 'text-purple-600' },
  { key: 'alumni', label: 'OB・OG', icon: Users, color: 'text-green-600' },
];

export default function Layout({ children }) {
  const { role, setRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-bold text-primary-700 text-lg hover:text-primary-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block">OB・OGネットワーク</span>
            </button>

            {/* Role Tabs */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              {roles.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleRoleChange(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    role === key
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:block">
                {roles.find(r => r.key === role)?.label}モード
              </span>
            </div>
          </div>

          {/* Sub Navigation */}
          <SubNav role={role} currentPath={location.pathname} navigate={navigate} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}

function SubNav({ role, currentPath, navigate }) {
  const studentNav = [
    { label: 'キャリア台帳', path: '/' },
    { label: 'チャット', path: '/chat' },
    { label: 'コンテンツ', path: '/contents' },
  ];
  const teacherNav = [
    { label: 'キャリア台帳', path: '/' },
    { label: '講演依頼', path: '/lecture-request' },
    { label: 'フィードバック管理', path: '/feedback' },
    { label: 'コンテンツ', path: '/contents' },
  ];
  const alumniNav = [
    { label: 'キャリア台帳', path: '/' },
    { label: 'コンテンツ', path: '/contents' },
  ];

  const navItems = role === 'student' ? studentNav : role === 'teacher' ? teacherNav : alumniNav;

  return (
    <div className="flex gap-1 overflow-x-auto pb-0">
      {navItems.map(({ label, path }) => {
        const isActive = path === '/' ? currentPath === '/' : currentPath.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
