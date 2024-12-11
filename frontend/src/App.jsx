import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import StudentsPage from '../pages/StudentsPage';
import StudyGroupsPage from '../pages/StudyGroupsPage';
import ReportPage from '../pages/ReportPage';
import RoomPage from '../pages/RoomPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/study-groups" element={<StudyGroupsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}