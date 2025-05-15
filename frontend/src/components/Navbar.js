// // import './cssofcompo.css'
// // import React, { useState, useEffect } from 'react';
// // import { FaHome, FaCalendarAlt, FaHistory, FaBookmark, FaTools, 
// //          FaChevronDown, FaSignInAlt, FaUserPlus, FaMoon, FaSun, 
// //          FaBell, FaYoutube, FaLink } from 'react-icons/fa';
// // const Navbar = () => {
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [activeDropdown, setActiveDropdown] = useState(null);
// //   const [isDarkTheme, setIsDarkTheme] = useState(false);
// //   const [isScrolled, setIsScrolled] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setIsScrolled(window.scrollY > 10);
// //     };

// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   const toggleMobileMenu = () => {
// //     setIsMobileMenuOpen(!isMobileMenuOpen);
// //   };

// //   const toggleDropdown = (dropdownName) => {
// //     setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
// //   };

// //   const toggleTheme = () => {
// //     setIsDarkTheme(!isDarkTheme);
// //     document.body.classList.toggle('dark-theme');
// //   };

// //   const closeMobileMenu = () => {
// //     setIsMobileMenuOpen(false);
// //     setActiveDropdown(null);
// //   };

// //   return (
// //     <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
// //       <div className="navbar-container">
// //         <a href="/" className="logo-link">
// //           <span className="logo-icon"></span>
// //           <span className="logo-text">HACKSTREAK</span>
// //         </a>

// //         <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
// //           <li className="nav-item">
// //             <a href="/" className="nav-link" onClick={closeMobileMenu}>
// //               <FaHome /> Home
// //             </a>
// //           </li>
// //           <li className="nav-item">
// //             <a href="/upcoming" className="nav-link" onClick={closeMobileMenu}>
// //               <FaCalendarAlt /> Upcoming
// //             </a>
// //           </li>
// //           <li className="nav-item">
// //             <a href="/past" className="nav-link" onClick={closeMobileMenu}>
// //               <FaHistory /> Past Contests
// //             </a>
// //           </li>
// //           <li className="nav-item">
// //             <a href="/bookmarks" className="nav-link" onClick={closeMobileMenu}>
// //               <FaBookmark /> Bookmarks
// //             </a>
// //           </li>
// //           <li className={`nav-item dropdown ${activeDropdown === 'tools' ? 'active' : ''}`}>
// //             <a 
// //               href="#" 
// //               className="nav-link" 
// //               onClick={(e) => {
// //                 e.preventDefault();
// //                 toggleDropdown('tools');
// //               }}
// //             >
// //               <FaTools /> Tools <FaChevronDown className="dropdown-arrow" />
// //             </a>
// //             <div className={`dropdown-content ${activeDropdown === 'tools' ? 'active' : ''}`}>
// //               <a href="/reminders" className="dropdown-link" onClick={closeMobileMenu}>
// //                 <FaBell /> Set Reminders
// //               </a>
// //               <a href="/solutions" className="dropdown-link" onClick={closeMobileMenu}>
// //                 <FaYoutube /> Contest Solutions
// //               </a>
// //               <a href="/submit-solution" className="dropdown-link" onClick={closeMobileMenu}>
// //                 <FaLink /> Submit Solution Link
// //               </a>
// //             </div>
// //           </li>
// //         </ul>

// //         <div className={`navbar-actions ${isMobileMenuOpen ? 'active' : ''}`}>
// //           <button className="btn btn-login">
// //             <a style={{textDecoration:'none',color:'white'}} href="/login">
// //             <FaSignInAlt /> Login</a>
// //           </button>
// //           <button className="btn btn-signup">
// //             <a style={{textDecoration:'none',color:'white'}}  href="/signup"><FaUserPlus /> Sign Up</a>
// //           </button>
// //           <div className="theme-toggle" onClick={toggleTheme}>
// //             {isDarkTheme ? <FaSun /> : <FaMoon />}
// //           </div>
// //         </div>

// //         <div 
// //           className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
// //           onClick={toggleMobileMenu}
// //         >
// //           <span className="bar"></span>
// //           <span className="bar"></span>
// //           <span className="bar"></span>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import './Navbar.css';

// // import './cssofcompo.css';
// import React, { useState, useEffect } from 'react';
// import { FaHome, FaCalendarAlt, FaHistory, FaBookmark, FaTools, 
//          FaChevronDown, FaSignInAlt, FaUserPlus, FaMoon, FaSun, 
//          FaBell, FaYoutube, FaLink, FaUserCircle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [isDarkTheme, setIsDarkTheme] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     // Check if user is logged in
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//     if (activeDropdown) setActiveDropdown(null);
//   };

//   const toggleDropdown = (dropdownName) => {
//     setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
//   };

//   const toggleTheme = () => {
//     setIsDarkTheme(!isDarkTheme);
//     document.body.classList.toggle('dark-theme');
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   const handleProfileClick = () => {
//     navigate('/profile');
//     closeMobileMenu();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userEmail');
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   return (
//     <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
//       <div className="navbar-container">
//         <a href="/" className="logo-link">
//           <span className="logo-icon"></span>
//           <span className="logo-text">HACKSTREAK</span>
//         </a>

//         <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
//           <li className="nav-item">
//             <a href="/" className="nav-link" onClick={closeMobileMenu}>
//               <FaHome /> Home
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="/upcoming" className="nav-link" onClick={closeMobileMenu}>
//               <FaCalendarAlt /> Upcoming
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="/past" className="nav-link" onClick={closeMobileMenu}>
//               <FaHistory /> Past Contests
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="/bookmarks" className="nav-link" onClick={closeMobileMenu}>
//               <FaBookmark /> Bookmarks
//             </a>
//           </li>
//           <li className={`nav-item dropdown ${activeDropdown === 'tools' ? 'active' : ''}`}>
//             <a 
//               href="#" 
//               className="nav-link" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 toggleDropdown('tools');
//               }}
//             >
//               <FaTools /> Tools <FaChevronDown className="dropdown-arrow" />
//             </a>
//             <div className={`dropdown-content ${activeDropdown === 'tools' ? 'active' : ''}`}>
//               <a href="/reminders" className="dropdown-link" onClick={closeMobileMenu}>
//                 <FaBell /> Set Reminders
//               </a>
//               <a href="/solutions" className="dropdown-link" onClick={closeMobileMenu}>
//                 <FaYoutube /> Contest Solutions
//               </a>
//               <a href="/submit-solution" className="dropdown-link" onClick={closeMobileMenu}>
//                 <FaLink /> Submit Solution Link
//               </a>
//             </div>
//           </li>
//         </ul>

//         <div className={`navbar-actions ${isMobileMenuOpen ? 'active' : ''}`}>
//           <div className="theme-toggle" onClick={toggleTheme}>
//             {isDarkTheme ? <FaSun /> : <FaMoon />}
//           </div>
          
//           {isLoggedIn ? (
//             <div className={`user-profile-dropdown ${activeDropdown === 'profile' ? 'active' : ''}`}>
//               <button 
//                 className="btn-profile"
//                 onClick={() => toggleDropdown('profile')}
//               >
//                 <FaUserCircle className="profile-icon" />
//               </button>
//               <div className={`profile-dropdown-content ${activeDropdown === 'profile' ? 'active' : ''}`}>
//                 <a href="/profile" className="dropdown-link" onClick={closeMobileMenu}>
//                   <FaUserCircle /> My Profile
//                 </a>
//                 <a href="/settings" className="dropdown-link" onClick={closeMobileMenu}>
//                   <FaTools /> Settings
//                 </a>
//                 <button className="dropdown-link logout-btn" onClick={handleLogout}>
//                   <FaSignInAlt /> Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <a href="/login" className="btn btn-login">
//                 <FaSignInAlt /> Login
//               </a>
//               <a href="/signup" className="btn btn-signup">
//                 <FaUserPlus /> Sign Up
//               </a>
//             </>
//           )}
//         </div>

//         <div 
//           className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
//           onClick={toggleMobileMenu}
//         >
//           <span className="bar"></span>
//           <span className="bar"></span>
//           <span className="bar"></span>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import './cssofcompo.css'
// import './Navbar.css';
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
        <a href="/" className="logo-link">
          <span className="logo-icon"></span>
          <span className="logo-text">HACKSTREAK</span>
        </a>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="/" className="nav-link" onClick={closeMobileMenu}>
              <FaHome /> Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/upcoming" className="nav-link" onClick={closeMobileMenu}>
              <FaCalendarAlt /> Upcoming
            </a>
          </li>
          <li className="nav-item">
            <a href="/past" className="nav-link" onClick={closeMobileMenu}>
              <FaHistory /> Past Contests
            </a>
          </li>
          <li className="nav-item">
            <Link

             to="/bookmark" className="nav-link" onClick={closeMobileMenu}>
              <FaBookmark /> Bookmarks
            </Link>
          </li>
          <li className={`nav-item dropdown ${activeDropdown === 'tools' ? 'active' : ''}`}>
            <a 
              href="#" 
              className="nav-link" 
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('tools');
              }}
            >
              <FaTools /> Tools <FaChevronDown className="dropdown-arrow" />
            </a>
            <div className={`dropdown-content ${activeDropdown === 'tools' ? 'active' : ''}`}>
              <a href="/reminders" className="dropdown-link" onClick={closeMobileMenu}>
                <FaBell /> Set Reminders
              </a>
              <a href="/solutions" className="dropdown-link" onClick={closeMobileMenu}>
                <FaYoutube /> Contest Solutions
              </a>
              <a href="/submit-solution" className="dropdown-link" onClick={closeMobileMenu}>
                <FaLink /> Submit Solution Link
              </a>
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
                <a href="/profile" className="dropdown-link" onClick={closeMobileMenu}>
                  <FaUserCircle /> My Profile
                </a>
                <a href="/settings" className="dropdown-link" onClick={closeMobileMenu}>
                  <FaTools /> Settings
                </a>
                <button className="dropdown-link logout-btn" onClick={handleLogout}>
                  <FaSignInAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <a href="/login" className="btn btn-login" onClick={closeMobileMenu}>
                <FaSignInAlt /> Login
              </a>
              <a href="/signup" className="btn btn-signup" onClick={closeMobileMenu}>
                <FaUserPlus /> Sign Up
              </a>
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