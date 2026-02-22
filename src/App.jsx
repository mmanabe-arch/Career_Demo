import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import InterviewModal from './components/InterviewModal';
import TutoringModal from './components/TutoringModal';
import AlumniList from './pages/AlumniList';
import AlumniDetail from './pages/AlumniDetail';
import Chat from './pages/Chat';
import LectureRequest from './pages/LectureRequest';
import Feedback from './pages/Feedback';
import Contents from './pages/Contents';
import UniversityMindMap from './pages/UniversityMindMap';
import TutorHub from './pages/TutorHub';
import GoalManagement from './pages/GoalManagement';
import AlumniChat from './pages/AlumniChat';
import StudentList from './pages/StudentList';
import { useApp } from './context/AppContext';

function AppRoutes() {
  const { role } = useApp();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AlumniList />} />
        <Route path="/alumni/:id" element={<AlumniDetail />} />
        <Route path="/university-map" element={<UniversityMindMap />} />
        {role === 'student' && (
          <>
            <Route path="/goals" element={<GoalManagement />} />
            <Route path="/chat" element={<Chat />} />
          </>
        )}
        {role === 'teacher' && (
          <>
            <Route path="/lecture-request" element={<LectureRequest />} />
            <Route path="/feedback" element={<Feedback />} />
          </>
        )}
        {role === 'alumni' && (
          <>
            <Route path="/tutor" element={<TutorHub />} />
            <Route path="/alumni-chat" element={<AlumniChat />} />
            <Route path="/students" element={<StudentList />} />
          </>
        )}
        <Route path="/contents" element={<Contents />} />
        <Route path="*" element={<AlumniList />} />
      </Routes>
      <InterviewModal />
      <TutoringModal />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
