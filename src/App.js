import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';
import SignUP from './pages/SignUp';
import Navigation from './components/navigation';
import Lost from './pages/Lost';
import Found from './pages/Found';
import ReportLostItem from './pages/ReportLostItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-up" element={<SignUP />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/found" element={<Found />} />
      </Routes>
    </Router>
  );
}

export default App;