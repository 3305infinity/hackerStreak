// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Navbar from '../components/Navbar';
// // import ContestCard from '../components/ContestCard';
// // import '../styles/AllContests.css';

// // function AllContests() {
// //   const [contests, setContests] = useState({});
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [activePlatform, setActivePlatform] = useState('all');
// //   const [contestType, setContestType] = useState('upcoming');
// //   const [bookmarks, setBookmarks] = useState(new Set());
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchContests = async () => {
// //       try {
// //         setIsLoading(true);
// //         const response = await fetch("http://localhost:5000/api/contests");
// //         const data = await response.json();
// //         setContests(data.contestsByPlatform || {});
// //       } catch (err) {
// //         setError(err.message);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     const fetchBookmarks = async () => {
// //       try {
// //         const response = await fetch("http://localhost:5000/api/bookmarks");
// //         const data = await response.json();
// //         setBookmarks(new Set(data.bookmarks));
// //       } catch (err) {
// //         console.error("Failed to fetch bookmarks:", err);
// //       }
// //     };

// //     fetchContests();
// //     fetchBookmarks();
// //   }, []);

// //   const toggleBookmark = async (contestId) => {
// //     try {
// //       const newBookmarks = new Set(bookmarks);
// //       if (newBookmarks.has(contestId)) {
// //         newBookmarks.delete(contestId);
// //         await fetch(`http://localhost:5000/api/bookmark/${contestId}`, {
// //           method: 'DELETE'
// //         });
// //       } else {
// //         newBookmarks.add(contestId);
// //         await fetch(`http://localhost:5000/api/bookmark/${contestId}`, {
// //           method: 'POST'
// //         });
// //       }
// //       setBookmarks(newBookmarks);
// //     } catch (err) {
// //       console.error("Failed to update bookmark:", err);
// //     }
// //   };

// //   const getFilteredContests = () => {
// //     if (activePlatform === 'all') {
// //       return Object.values(contests).reduce((acc, platform) => {
// //         if (platform[contestType]) {
// //           acc.push(...platform[contestType]);
// //         }
// //         return acc;
// //       }, []);
// //     }
// //     return contests[activePlatform]?.[contestType] || [];
// //   };

// //   const filteredContests = getFilteredContests();

// //   const platforms = [
// //     { id: 'all', name: 'All Platforms' },
// //     { id: 'Codeforces', name: 'Codeforces' },
// //     { id: 'LeetCode', name: 'LeetCode' },
// //     { id: 'AtCoder', name: 'AtCoder' }
// //   ];

// //   return (
// //     <div className="all-contests-container">
// //       <Navbar />
      
// //       <main className="all-contests-main">
// //         <div className="header-section">
// //           <h1 className="page-title">Coding Contests</h1>
// //           <p className="page-subtitle">
// //             Browse upcoming and past coding contests from various platforms
// //           </p>
// //         </div>

// //         <div className="controls-section">
// //           <div className="tabs-container">
// //             {platforms.map(platform => (
// //               <button
// //                 key={platform.id}
// //                 className={`platform-tab ${activePlatform === platform.id ? 'active' : ''}`}
// //                 onClick={() => setActivePlatform(platform.id)}
// //               >
// //                 {platform.name}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="type-toggle">
// //             <button
// //               className={`type-btn ${contestType === 'upcoming' ? 'active' : ''}`}
// //               onClick={() => setContestType('upcoming')}
// //             >
// //               Upcoming
// //             </button>
// //             <button
// //               className={`type-btn ${contestType === 'past' ? 'active' : ''}`}
// //               onClick={() => setContestType('past')}
// //             >
// //               Past
// //             </button>
// //           </div>
// //         </div>

// //         {isLoading ? (
// //           <div className="loading-state">
// //             <div className="spinner"></div>
// //             <p>Loading contests...</p>
// //           </div>
// //         ) : error ? (
// //           <div className="error-state">
// //             <p>Error loading contests: {error}</p>
// //             <button onClick={() => window.location.reload()}>Retry</button>
// //           </div>
// //         ) : filteredContests.length === 0 ? (
// //           <div className="empty-state">
// //             <p>No {contestType} contests found for {activePlatform === 'all' ? 'any platform' : activePlatform}.</p>
// //           </div>
// //         ) : (
// //           <div className="contests-grid">
// //             {filteredContests.map(contest => (
// //               <ContestCard
// //                 key={contest.id}
// //                 contest={contest}
// //                 isBookmarked={bookmarks.has(contest.id)}
// //                 onBookmarkToggle={toggleBookmark}
// //               />
// //             ))}
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // export default AllContests;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import ContestCard from '../components/ContestCard';
// import '../styles/AllContests.css';

// function AllContests() {
//   const [contests, setContests] = useState({ upcoming: [], past: [] });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activePlatform, setActivePlatform] = useState('all');
//   const [contestType, setContestType] = useState('upcoming');
//   const [bookmarks, setBookmarks] = useState(new Set());
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchContests = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch("http://localhost:5000/api/contests");
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         // The API returns { upcoming: [...], past: [...] }
//         setContests(data || { upcoming: [], past: [] });
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching contests:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchBookmarks = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/bookmarks");
//         if (response.ok) {
//           const data = await response.json();
//           setBookmarks(new Set(data.bookmarks || []));
//         }
//       } catch (err) {
//         console.error("Failed to fetch bookmarks:", err);
//       }
//     };

//     fetchContests();
//     fetchBookmarks();
//   }, []);

//   const toggleBookmark = async (contestId) => {
//     try {
//       const newBookmarks = new Set(bookmarks);
//       const method = newBookmarks.has(contestId) ? 'DELETE' : 'POST';
      
//       const response = await fetch(`http://localhost:5000/api/bookmark/${contestId}`, {
//         method,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         if (method === 'DELETE') {
//           newBookmarks.delete(contestId);
//         } else {
//           newBookmarks.add(contestId);
//         }
//         setBookmarks(newBookmarks);
//       } else {
//         throw new Error('Failed to update bookmark');
//       }
//     } catch (err) {
//       console.error("Failed to update bookmark:", err);
//     }
//   };

//   const getFilteredContests = () => {
//     const contestsToFilter = contestType === 'upcoming' 
//       ? contests.upcoming 
//       : contests.past;

//     if (activePlatform === 'all') {
//       return contestsToFilter;
//     }
//     return contestsToFilter.filter(contest => 
//       contest.platform.toLowerCase() === activePlatform.toLowerCase()
//     );
//   };

//   const filteredContests = getFilteredContests();

//   const platforms = [
//     { id: 'all', name: 'All Platforms' },
//     { id: 'codeforces', name: 'Codeforces' },
//     { id: 'leetcode', name: 'LeetCode' },
//     { id: 'atcoder', name: 'AtCoder' },
//     { id: 'codechef', name: 'CodeChef' }
//   ];

//   return (
//     <div className="all-contests-container">
//       <Navbar />
      
//       <main className="all-contests-main">
//         <div className="header-section">
//           <h1 className="page-title">Coding Contests</h1>
//           <p className="page-subtitle">
//             Browse upcoming and past coding contests from various platforms
//           </p>
//         </div>

//         <div className="controls-section">
//           <div className="tabs-container">
//             {platforms.map(platform => (
//               <button
//                 key={platform.id}
//                 className={`platform-tab ${activePlatform === platform.id ? 'active' : ''}`}
//                 onClick={() => setActivePlatform(platform.id)}
//               >
//                 {platform.name}
//               </button>
//             ))}
//           </div>

//           <div className="type-toggle">
//             <button
//               className={`type-btn ${contestType === 'upcoming' ? 'active' : ''}`}
//               onClick={() => setContestType('upcoming')}
//             >
//               Upcoming
//             </button>
//             <button
//               className={`type-btn ${contestType === 'past' ? 'active' : ''}`}
//               onClick={() => setContestType('past')}
//             >
//               Past
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading contests...</p>
//           </div>
//         ) : error ? (
//           <div className="error-state">
//             <p>Error loading contests: {error}</p>
//             <button onClick={() => window.location.reload()}>Retry</button>
//           </div>
//         ) : filteredContests.length === 0 ? (
//           <div className="empty-state">
//             <p>No {contestType} contests found {activePlatform !== 'all' ? `for ${platforms.find(p => p.id === activePlatform)?.name}` : ''}.</p>
//           </div>
//         ) : (
//           <div className="contests-grid">
//             {filteredContests.map(contest => (
//               <ContestCard
//                 key={contest.id}
//                 contest={contest}
//                 isBookmarked={bookmarks.has(contest.id)}
//                 onBookmarkToggle={toggleBookmark}
//                 onClick={() => navigate(`/contest/${contest.id}`)}
//               />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import '../styles/AllContests.css';

function AllContests() {
  const [contests, setContests] = useState({ upcoming: [], past: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePlatform, setActivePlatform] = useState('all');
  const [contestType, setContestType] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/contests");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContests(data || { upcoming: [], past: [] });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching contests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleBookmarkClick = (contestId) => {
    // Navigate to bookmark route instead of toggling here
    navigate(`/bookmark/${contestId}`);
  };

  const getFilteredContests = () => {
    const contestsToFilter = contestType === 'upcoming' 
      ? contests.upcoming 
      : contests.past;

    if (activePlatform === 'all') {
      return contestsToFilter;
    }
    return contestsToFilter.filter(contest => 
      contest.platform.toLowerCase() === activePlatform.toLowerCase()
    );
  };

  const filteredContests = getFilteredContests();

  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'codeforces', name: 'Codeforces' },
    { id: 'leetcode', name: 'LeetCode' },
    { id: 'atcoder', name: 'AtCoder' },
    { id: 'codechef', name: 'CodeChef' }
  ];

  return (
    <div className="all-contests-container">
      <main className="all-contests-main">
        <div className="header-section">
          <h1 className="page-title">Coding Contests</h1>
          <p className="page-subtitle">
            Browse upcoming and past coding contests from various platforms
          </p>
        </div>

        <div className="controls-section">
          <div className="tabs-container">
            {platforms.map(platform => (
              <button
                key={platform.id}
                className={`platform-tab ${activePlatform === platform.id ? 'active' : ''}`}
                onClick={() => setActivePlatform(platform.id)}
              >
                {platform.name}
              </button>
            ))}
          </div>

          <div className="type-toggle">
            <button
              className={`type-btn ${contestType === 'upcoming' ? 'active' : ''}`}
              onClick={() => setContestType('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`type-btn ${contestType === 'past' ? 'active' : ''}`}
              onClick={() => setContestType('past')}
            >
              Past
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading contests...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error loading contests: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="empty-state">
            <p>No {contestType} contests found {activePlatform !== 'all' ? `for ${platforms.find(p => p.id === activePlatform)?.name}` : ''}.</p>
          </div>
        ) : (
          <div className="contests-grid">
            {filteredContests.map(contest => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onBookmarkClick={() => handleBookmarkClick(contest.id)}
                onClick={() => navigate(`/contest/${contest.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllContests;