import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import RoutineGenerator from "./pages/RoutineGenerator/RoutineGenerator";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder components for now
const StudentPortal = () => <div className="portal-page"><h1>🎓 Student Portal</h1><p>Welcome to your student dashboard!</p></div>;
const TeacherPortal = () => <div className="portal-page"><h1>👨‍🏫 Teacher Portal</h1><p>Welcome to your teacher dashboard!</p></div>;
const AdminPortal = () => <div className="portal-page"><h1>⚙️ Admin Panel</h1><p>Welcome to admin dashboard!</p></div>;

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generate-timetable" element={<RoutineGenerator />} />
        
        {/* Protected Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentPortal />
          </ProtectedRoute>
        } />
        
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherPortal />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPortal />
          </ProtectedRoute>
        } />
        
        {/* Other routes */}
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/features" element={<h1>Features Page</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;