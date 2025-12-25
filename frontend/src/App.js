import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookmarkProvider } from './context/BookmarkContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './components/Profile';
import UpcomingContests from './pages/UpcomingContests';
import PastContests from './pages/PastContests';
import Solutions from './pages/Solutions';
import StudyPlan from './pages/StudyPlan';
import PerformanceAnalyzer from './pages/PerformanceAnalyzer';
import PerformancePredictor from './pages/PerformancePredictor';
import Bookmark from './pages/Bookmark';
import AddPlatform from './components/AddPlatform';
import './App.css';

function App() {
  return (
    <BookmarkProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upcoming" element={<UpcomingContests />} />
            <Route path="/past" element={<PastContests />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/performance-analyzer" element={<PerformanceAnalyzer />} />
            <Route path="/performance-predictor" element={<PerformancePredictor />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/addplatform" element={<AddPlatform />} />
          </Routes>
        </div>
      </Router>
    </BookmarkProvider>
  );
}

export default App;
