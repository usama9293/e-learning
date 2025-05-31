import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

// Layout and Route Protection
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import StudentRegistration from './pages/auth/StudentRegistration.tsx';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import Profile from './pages/student/Profile';
import LearningPlatform from './pages/student/LearningPlatform.tsx';
import Payment from './pages/Payment';
import Courses from './pages/student/Courses';
import CourseDetails from './pages/student/CourseDetails';
import CoursePage from './pages/student/coursePage.tsx';
import StudentSessions from './pages/student/StudentSessions';

// Tutor Pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import Materials from './pages/tutor/Materials';
import Sessions from './pages/tutor/Sessions';
import TutorCourses from './pages/tutor/Courses';
import TutorCourseDetail from './pages/tutor/TutorCourseDetail';
import TutorAssignment from './pages/tutor/TutorAssignment';
import TutorCoursePage from './pages/tutor/TutorCoursePage.tsx';
import TutorProfile from './pages/tutor/TutorProfile.tsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PaymentMonitoring from './pages/admin/PaymentMonitoring';
import PlatformLogsReports from './pages/admin/PlatformLogsReports';
import UsersManagement from './pages/admin/UsersManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import SessionsManagement from './pages/admin/SessionsManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import LogsManagement from './pages/admin/LogsManagement';
import Settings from './pages/admin/Settings';

// Shared Pages
import Events from './pages/Events';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/register" element={<StudentRegistration />} />

          {/* Student Routes */}
          <Route element={<PrivateRoute role="student">
            <Route path="/student" element={<Layout><StudentDashboard /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/learning-platform" element={<Layout><CoursePage /></Layout>} />
            <Route path="/student/courses" element={<Layout><Courses /></Layout>} />
            <Route path="/course/:courseId" element={<Layout><CoursePage  /></Layout>} />
            <Route path="/student-events" element={<Layout><Events /></Layout>} />
          </PrivateRoute>} />

          {/* Tutor Routes */}
          <Route element={<PrivateRoute role="tutor">
            <Route path="/tutor" element={<Layout><TutorDashboard /></Layout>} />
            <Route path="/tutor/assignments" element={<Layout><TutorAssignment /></Layout>} />
            <Route path="/tutor/materials" element={<Layout><Materials /></Layout>} />
            <Route path="/materials/:courseId" element={<Layout><Materials /></Layout>} />
            <Route path="/tutor/sessions" element={<Layout><Sessions /></Layout>} />
            <Route path="/tutor/courses" element={<Layout><TutorCourses /></Layout>} />
            <Route path="/tutor-course/:courseId" element={<Layout><TutorCoursePage  /></Layout>} />
            <Route path="/tutor/courses/:courseId" element={<Layout><TutorCourseDetail /></Layout>} />
            <Route path="/tutor-events" element={<Layout><Events /></Layout>} />
            <Route path="/tutor/profile" element={<Layout><TutorProfile /></Layout>} />
          </PrivateRoute>} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute role="admin">
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/user" element={<Layout><UserManagement /></Layout>} />
            <Route path="/admin/payment-monitoring" element={<Layout><PaymentMonitoring /></Layout>} />
            <Route path="/admin/platform-logs-reports" element={<Layout><PlatformLogsReports /></Layout>} />
            <Route path="/admin/users/*" element={<UsersManagement />} />
            <Route path="/admin/courses/*" element={<CoursesManagement />} />
            <Route path="/admin/sessions/*" element={<SessionsManagement />} />
            <Route path="/admin/payments/*" element={<PaymentsManagement />} />
            <Route path="/admin/logs/*" element={<LogsManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin-events" element={<Layout><Events /></Layout>} />
          </PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
