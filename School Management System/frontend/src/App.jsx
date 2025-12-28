import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import TeacherLogin from "./pages/Login/TeacherLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import RoutineGenerator from "./pages/RoutineGenerator/RoutineGenerator";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentPanel/StudentPanel";
import TeacherPanel from "./pages/TeacherPanel/TeacherPanel";
import About from "./pages/About";
import FeaturesPage from "./pages/Features";
import Contact from "./pages/Contact";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacherlogin" element={<TeacherLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/generate-timetable" element={<RoutineGenerator />} />
        
        {/* Protected Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherPanel />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        {/* Other routes */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;