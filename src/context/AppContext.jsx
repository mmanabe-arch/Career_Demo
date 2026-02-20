import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('student'); // 'student' | 'teacher' | 'alumni'
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
