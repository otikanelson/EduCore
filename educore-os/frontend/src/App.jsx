import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import PortalConnect from './pages/PortalConnect';
import UserLogin from './pages/UserLogin';
import DirectLogin from './pages/DirectLogin';
import Pricing from './pages/Pricing';
import Unauthorized from './pages/Unauthorized';

// Protected pages
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import ResultApproval from './pages/ResultApproval';
import TeacherLedger from './pages/TeacherLedger';
import ExamHall from './pages/ExamHall';
import ParentDashboard from './pages/ParentDashboard';
import ReportCard from './pages/ReportCard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PortalConnect />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/direct" element={<DirectLogin />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes - Admin Only */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/approvals" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'hod']}>
              <ResultApproval />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes - Teacher/HOD */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRoles={['teacher', 'hod', 'admin']}>
              <TeacherLedger />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes - Student */}
        <Route 
          path="/exam" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ExamHall />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes - Parent */}
        <Route 
          path="/parent" 
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/report-card" 
          element={
            <ProtectedRoute allowedRoles={['parent', 'admin']}>
              <ReportCard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
