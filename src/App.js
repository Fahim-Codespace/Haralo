import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';
import SignUP from './pages/SignUp';
import Login from './pages/Login';
import Navigation from './components/navigation';
import Lost from './pages/Lost';
import Found from './pages/Found';
import ReportLostItem from './pages/ReportLostItem';
import ReportFoundItem from './pages/ReportFoundItem';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-up" element={<SignUP />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/lost" element={
          <ProtectedRoute>
            <Lost />
          </ProtectedRoute>
        } />
        <Route path="/found" element={
          <ProtectedRoute>
            <Found />
          </ProtectedRoute>
        } />
        <Route path="/report-lost-item" element={
          <ProtectedRoute>
            <ReportLostItem />
          </ProtectedRoute>
        } />
        <Route path="/report-found" element={
          <ProtectedRoute>
            <ReportFoundItem />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;