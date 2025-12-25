import './cssofcompo.css'
import './Navbar.css'
import React, { useState, useEffect } from 'react';
import { FaHome, FaCalendarAlt, FaHistory, FaBookmark, FaTools,
         FaChevronDown, FaSignInAlt, FaUserPlus, FaMoon, FaSun,
         FaBell, FaYoutube, FaLink, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check if user is logged in by verifying token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (activeDropdown) setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    closeMobileMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/login');
    closeMobileMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <span className="logo-icon"></span>
          <span className="logo-text">HACKSTREAK</span>
        </Link>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>
              <FaHome /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/upcoming" className="nav-link" onClick={closeMobileMenu}>
              <FaCalendarAlt /> Upcoming
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/past" className="nav-link" onClick={closeMobileMenu}>
              <FaHistory /> Past Contests
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/bookmark" className="nav-link" onClick={closeMobileMenu}>
              <FaBookmark /> Bookmarks
            </Link>
          </li>
          <li className={`nav-item dropdown ${activeDropdown === 'tools' ? 'active' : ''}`}>
            <button
              className="nav-link"
              onClick={() => toggleDropdown('tools')}
            >
              <FaTools /> Tools <FaChevronDown className="dropdown-arrow" />
            </button>
            <div className={`dropdown-content ${activeDropdown === 'tools' ? 'active' : ''}`}>
              <Link to="/solutions" className="dropdown-link" onClick={closeMobileMenu}>
                <FaYoutube /> Contest Solutions
              </Link>
              <Link to="/study-plan" className="dropdown-link" onClick={closeMobileMenu}>
                <FaBell /> Study Plan
              </Link>
              <Link to="/performance-predictor" className="dropdown-link" onClick={closeMobileMenu}>
                <FaLink /> Performance Predictor
              </Link>
              <Link to="/performance-analyzer" className="dropdown-link" onClick={closeMobileMenu}>
                <FaTools /> Performance Analyzer
              </Link>
            </div>
          </li>
        </ul>

        <div className={`navbar-actions ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </div>

          {isLoggedIn ? (
            <div className={`user-profile-dropdown ${activeDropdown === 'profile' ? 'active' : ''}`}>
              <button
                className="btn-profile"
                onClick={() => toggleDropdown('profile')}
              >
                <FaUserCircle className="profile-icon" />
              </button>
              <div className={`profile-dropdown-content ${activeDropdown === 'profile' ? 'active' : ''}`}>
                <Link to="/profile" className="dropdown-link" onClick={closeMobileMenu}>
                  <FaUserCircle /> My Profile
                </Link>
                <Link to="/addplatform" className="dropdown-link" onClick={closeMobileMenu}>
                  <FaTools /> Add Platform
                </Link>
                <button className="dropdown-link logout-btn" onClick={handleLogout}>
                  <FaSignInAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-login" onClick={closeMobileMenu}>
                <FaSignInAlt /> Login
              </Link>
              <Link to="/signup" className="btn btn-signup" onClick={closeMobileMenu}>
                <FaUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>

        <div
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
