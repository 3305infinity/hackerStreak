// // import React, { useEffect, useState } from 'react';
// // import Navbar from './Navbar';
// // import './cssofcompo.css';
// // import UpcomingContestCard from './UpcomingContestCard';

// // function Home() {
// //   const [contests, setContests] = useState([]);

// //   useEffect(() => {
// //     const fetchContests = async () => {
// //       try {
// //         const response = await fetch("http://localhost:5000/api/contests"); // Backend API
// //         const data = await response.json();

// //         console.log("Fetched data:", data);

// //         if (data.upcoming) {
// //           // Convert the upcoming object into an array (excluding null values)
// //           const upcomingArray = Object.values(data.upcoming).filter(contest => contest !== null);

// //           setContests(upcomingArray);
// //           console.log("Upcoming contests:", upcomingArray);
// //         } else {
// //           setContests([]);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching contests:", error);
// //       }
// //     };

// //     fetchContests();
// //   }, []);

// //   return (
// //     <>
// //       {/* <Navbar /> */}
// //       <div className="mx-auto p-5">
// //         <h1 className="text-2xl font-bold mb-4">🔥 Get Ready for the Next Big Challenge!
// //         </h1>
// //         <p>Stay ahead with the latest coding contests.</p>
// //         <div className="grid md:grid-cols-2 gap-6">
// //           {contests.length > 0 ? (
// //             contests.map(contest => (
// //               <UpcomingContestCard key={contest.id} contest={contest} />
// //             ))
// //           ) : (
// //             <p>No contests available. Try again later.</p>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }
// // export default Home;


// import React, { useEffect, useState } from 'react';
// import Navbar from './Navbar';
// import ContestCard from './UpcomingContestCard';
// import './Home.css';

// function Home() {
//   const [contests, setContests] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState('all');

//   useEffect(() => {
//     const fetchContests = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch("http://localhost:5000/api/contests");
//         const data = await response.json();

//         if (data.upcoming) {
//           const upcomingArray = Object.values(data.upcoming)
//             .filter(contest => contest !== null)
//             .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          
//           setContests(upcomingArray);
//         }
//       } catch (error) {
//         console.error("Error fetching contests:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchContests();
//   }, []);

//   const filteredContests = activeFilter === 'all' 
//     ? contests 
//     : contests.filter(contest => contest.platform === activeFilter);

//   return (
//     <div className="home-container">
//       <Navbar />
      
//       <main className="home-main">
//         <section className="hero-section">
//           <div className="hero-content">
//             <h1 className="hero-title">
//               <span className="hero-highlight">Code.</span> Compete. <span className="hero-highlight">Conquer.</span>
//             </h1>
//             <p className="hero-subtitle">
//               Never miss another coding contest. Get personalized reminders and track your progress.
//             </p>
//             <div className="hero-actions">
//               <button className="btn-primary">
//                 Explore Contests
//               </button>
//               <button className="btn-secondary">
//                 How It Works
//               </button>
//             </div>
//           </div>
//           <div className="hero-illustration">
//             <div className="code-snippet"></div>
//           </div>
//         </section>

//         <section className="contests-section">
//           <div className="section-header">
//             <h2 className="section-title">
//               <span className="title-icon">⚡</span>
//               Upcoming Battles
//             </h2>
//             <div className="filter-tabs">
//               <button 
//                 className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
//                 onClick={() => setActiveFilter('all')}
//               >
//                 All Platforms
//               </button>
//               <button 
//                 className={`filter-tab ${activeFilter === 'Codeforces' ? 'active' : ''}`}
//                 onClick={() => setActiveFilter('Codeforces')}
//               >
//                 Codeforces
//               </button>
//               {/* <button 
//                 className={`filter-tab ${activeFilter === 'AtCoder' ? 'active' : ''}`}
//                 onClick={() => setActiveFilter('AtCoder')}
//               >
//                 AtCoder
//               </button> */}
//               <button 
//                 className={`filter-tab ${activeFilter === 'LeetCode' ? 'active' : ''}`}
//                 onClick={() => setActiveFilter('LeetCode')}
//               >
//                 LeetCode
//               </button>
//               <button 
//                 className={`filter-tab ${activeFilter === 'CodeChef' ? 'active' : ''}`}
//                 onClick={() => setActiveFilter('CodeChef')}
//               >
//                 CodeChef
//               </button>
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="loading-state">
//               <div className="loading-spinner"></div>
//               <p>Loading contests...</p>
//             </div>
//           ) : filteredContests.length > 0 ? (
//             <div className="contest-grid">
//               {filteredContests.slice(0, 2).map(contest => (
//                 <ContestCard key={contest.id} contest={contest} />
//               ))}
//             </div>
//           ) : (
//             <div className="empty-state">
//               <div className="empty-icon">📅</div>
//               <h3>No contests available</h3>
//               <p>Check back later for upcoming coding challenges</p>
//             </div>
//           )}

//           {contests.length > 2 && (
//             <div className="view-all-container">
//               <button className="view-all-btn">
//                 View All Upcoming Contests →
//               </button>
//             </div>
//           )}
//         </section>

//         <section className="features-section">
//           <h2 className="section-title">Why Choose HackStreak?</h2>
//           <div className="features-grid">
//             <div className="feature-card">
//               <div className="feature-icon">⏰</div>
//               <h3>Smart Reminders</h3>
//               <p>Never miss a contest with customizable email and SMS notifications</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">📊</div>
//               <h3>Performance Tracking</h3>
//               <p>Analyze your contest history and improve your skills</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">🎯</div>
//               <h3>Personalized Recommendations</h3>
//               <p>Get contests tailored to your skill level and interests</p>
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="home-footer">
//         <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }
// 
// export default Home;








import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import ContestCard from './UpcomingContestCard';
import './Home.css';
import { BookmarkContext } from '../context/BookmarkContext.js';
import { Link } from 'react-router-dom';
function Home() {
  
  const { bookmarkedContests, toggleBookmark } = useContext(BookmarkContext);
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/contests");
        const data = await response.json();

        if (data.upcoming) {
          const upcomingArray = Object.values(data.upcoming)
            .filter(contest => contest !== null)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          
          setContests(upcomingArray);
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = activeFilter === 'all' 
    ? contests 
    : contests.filter(contest => contest.platform === activeFilter);

  return (
    <div className="home-container">
      <Navbar />
      
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-highlight">Code.</span> Compete. <span className="hero-highlight">Conquer.</span>
            </h1>
            <p className="hero-subtitle">
              Never miss another coding contest. Get personalized reminders and track your progress.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">
                <Link to='/allcontests' style={{textDecoration:'none',color:'white'}}>
                Explore Contests
                </Link>
              </button>
              <button className="btn-secondary">
                How It Works
              </button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="code-snippet"></div>
          </div>
        </section>

        <section className="contests-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Upcoming Battles
            </h2>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Platforms
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'Codeforces' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Codeforces')}
              >
                Codeforces
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'LeetCode' ? 'active' : ''}`}
                onClick={() => setActiveFilter('LeetCode')}
              >
                LeetCode
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'CodeChef' ? 'active' : ''}`}
                onClick={() => setActiveFilter('CodeChef')}
              >
                CodeChef
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'AtCoder' ? 'active' : ''}`}
                onClick={() => setActiveFilter('AtCoder')}
              >
                AtCoder
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading contests...</p>
            </div>
          ) : filteredContests.length > 0 ? (
            <div className="contest-grid">
              {filteredContests.slice(0, 2).map(contest => (
                <ContestCard key={contest.id} contest={contest}
                isBookmarked={bookmarkedContests.some(c => c.id === contest.id)}
                onBookmarkToggle={toggleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No contests available</h3>
              <p>Check back later for upcoming coding challenges</p>
            </div>
          )}

          {contests.length > 0 && (
            <div className="view-all-container">
              <button className="view-all-btn">
              <Link to='/allcontests' style={{textDecoration:'none',color:'white'}}>
                  View All Upcoming Contests →
                </Link>
              </button>
            </div>
          )}
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Choose HackStreak?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Smart Reminders</h3>
              <p>Never miss a contest with customizable email and SMS notifications</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance Tracking</h3>
              <p>Analyze your contest history and improve your skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Recommendations</h3>
              <p>Get contests tailored to your skill level and interests</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;