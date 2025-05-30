import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Login from './pages/auth/Login.tsx';
import AdminLogin from './pages/auth/AdminLogin.tsx';
import StudentDashboard from './pages/student/StudentDashboard.tsx';
import TutorDashboard from './pages/tutor/TutorDashboard.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Layout from './components/Layout.tsx';
import Profile from './pages/student/Profile.tsx';
import Events from './pages/Events.tsx';
import LearningPlatform from './pages/student/LearningPlatform.tsx';
import Payment from './pages/Payment.tsx';
import Courses from './pages/student/Courses.tsx';
import CourseDetails from './pages/student/CourseDetails.tsx';
import StudentSessions from './pages/student/StudentSessions.tsx';
import Materials from './pages/tutor/Materials.tsx';
import Sessions from './pages/tutor/Sessions.tsx';
import TutorCourses from './pages/tutor/Courses.tsx';
import TutorCourseDetail from './pages/tutor/TutorCourseDetail.tsx';
import TutorAssignment from './pages/tutor/TutorAssignment.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';
import PaymentMonitoring from './pages/admin/PaymentMonitoring.tsx';
import PlatformLogsReports from './pages/admin/PlatformLogsReports.tsx';
import StudentRegistration from './pages/auth/StudentRegistration.tsx';
import { SnackbarProvider } from 'notistack';


import UsersManagement from './pages/admin/UsersManagement.tsx';
import CoursesManagement from './pages/admin/CoursesManagement.tsx';
import SessionsManagement from './pages/admin/SessionsManagement.tsx';
import PaymentsManagement from './pages/admin/PaymentsManagement.tsx';
import LogsManagement from './pages/admin/LogsManagement.tsx';
import Settings from './pages/admin/Settings.tsx';
import CoursePage from './pages/student/coursePage.tsx';
function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
       
          <Route path="/" element={
            <Layout>
              <LandingPage />
            </Layout>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/student" element={
            <PrivateRoute role="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId" element={
            <PrivateRoute role="student">
              <Layout>
                <CoursePage />
              </Layout>
            </PrivateRoute>
          } />
          

          <Route path="/profile" element={
            <PrivateRoute role="student">
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/materials/:courseId" element={<PrivateRoute role="tutor"><Layout><Materials /></Layout></PrivateRoute>} />
          <Route path="/tutor-events" element={<PrivateRoute role="tutor"><Layout><Events /></Layout></PrivateRoute>} />
          <Route path="/student-events" element={<PrivateRoute role="student"><Layout><Events /></Layout></PrivateRoute>} />
          <Route path="/admin-events" element={<PrivateRoute role="admin"><Layout><Events /></Layout></PrivateRoute>} />
          
          <Route path="/learning-platform" element={
            <PrivateRoute role="student">
              <Layout>
                <LearningPlatform />
              </Layout>
            </PrivateRoute>
          } /> 
          <Route path="/tutor" element={
            <PrivateRoute role="tutor">
              <Layout>
                <TutorDashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/tutor/assignments" element={
            <PrivateRoute role="tutor">
              <Layout>
                <TutorAssignment />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/admin/user" element={
            <PrivateRoute role="admin">
              <Layout>
                <UserManagement />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/admin/payment-monitoring" element={
            <PrivateRoute role="admin">
              <Layout>
                <PaymentMonitoring />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/admin/platform-logs-reports" element={
            <PrivateRoute role="admin">
              <Layout>
                <PlatformLogsReports />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/payment" element={
            <PrivateRoute role="student">
              <Layout>
                <Payment />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/student/courses" element={
            <PrivateRoute role="student">
              <Layout>
                <Courses />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/student/courses/:id" element={
            <PrivateRoute role="student">
              <Layout>
                <CourseDetails />
              </Layout>
            </PrivateRoute>
          } />

          
          <Route path="/student/sessions" element={
            <PrivateRoute role="student">
              <Layout>
                <StudentSessions />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/tutor/materials" element={
            <PrivateRoute role="tutor">
              <Layout>
                <Materials />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/tutor/sessions" element={
            <PrivateRoute role="tutor">
              <Layout>
                <Sessions />
              </Layout>
            </PrivateRoute>
          } />
          

        <Route path="/tutor/courses/:courseId" element={
          <PrivateRoute role="tutor">
            <Layout>
              <TutorCourseDetail />
            </Layout>
          </PrivateRoute>
        } />

          <Route path="/tutor/courses" element={
            <PrivateRoute role="tutor">
              <Layout>
                <TutorCourses />
              </Layout>
            </PrivateRoute>
          } />
          {/* Fallback */}

          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/admin/users/*" element={
            <PrivateRoute role="admin">
             
                <UsersManagement />
             
            </PrivateRoute>
          } />
          <Route path="/admin/courses/*" element={
            <PrivateRoute role="admin">
             
                <CoursesManagement />
           
            </PrivateRoute>
          } />
          <Route path="/admin/sessions/*" element={
              <PrivateRoute role="admin">
            
                <SessionsManagement />
             
            </PrivateRoute>
          } />
          <Route path="/admin/payments/*" element={
            <PrivateRoute role="admin">
                 <PaymentsManagement />
              
            </PrivateRoute>
          } />
          <Route path="/admin/logs/*" element={
            <PrivateRoute role="admin">
             
                <LogsManagement />
             
            </PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute role="admin">
            
                <Settings />
             
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App; 