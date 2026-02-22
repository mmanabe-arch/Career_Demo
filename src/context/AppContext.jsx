import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

// モック在校生プロフィール（レコメンドエンジン用）
export const defaultStudentProfile = {
  grade: '高2',
  targetUniversities: ['東京大学', '京都大学', '大阪大学'],
  targetIndustries: ['IT・テクノロジー', 'コンサルティング', '金融・銀行'],
  interests: ['プログラミング', 'AI', 'データ分析', 'ビジネス', '数学', '英語'],
  weakSubjects: ['国語', '社会'],
};

export function AppProvider({ children }) {
  const [role, setRole] = useState('student'); // 'student' | 'teacher' | 'alumni'
  const [studentProfile] = useState(defaultStudentProfile);

  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewTarget, setInterviewTarget] = useState(null);
  const [tutoringModalOpen, setTutoringModalOpen] = useState(false);
  const [tutoringTarget, setTutoringTarget] = useState(null);

  const openInterviewModal = (alumni) => {
    setInterviewTarget(alumni);
    setInterviewModalOpen(true);
  };
  const closeInterviewModal = () => {
    setInterviewModalOpen(false);
    setInterviewTarget(null);
  };

  const openTutoringModal = (alumni) => {
    setTutoringTarget(alumni);
    setTutoringModalOpen(true);
  };
  const closeTutoringModal = () => {
    setTutoringModalOpen(false);
    setTutoringTarget(null);
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      studentProfile,
      interviewModalOpen, interviewTarget,
      openInterviewModal, closeInterviewModal,
      tutoringModalOpen, tutoringTarget,
      openTutoringModal, closeTutoringModal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
