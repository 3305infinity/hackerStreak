// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { FaGithub, FaLinkedin, FaGlobe, FaCodepen, FaMedal, FaCode, FaCalendarAlt, FaStar } from 'react-icons/fa';
// // import { SiLeetcode, SiCodeforces, SiCodechef, SiHackerrank, SiHackerearth, SiGeeksforgeeks } from 'react-icons/si';
// // import './Profile.css';

// // const ProfilePage = () => {
// //   const [user, setUser] = useState(null);
// //   const [platforms, setPlatforms] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [activeTab, setActiveTab] = useState('overview');

// // //   useEffect(() => {
// // //     const fetchUserData = async () => {
// // //       try {
// // //         setLoading(true);

// // // // After (add full URL in development)
// // // // Fetch user profile data
// // // const userResponse = await axios.get('http://localhost:5000/api/user/profile');
// // // // const userResponse = await axios.get('/api/user/profile');
// // // setUser(userResponse.data);
// // // // Fetch user's platforms
// // // const platformsResponse = await axios.get('http://localhost:5000/api/user/platforms');
// // //         // const platformsResponse = await axios.get('/api/user/platforms');
// // //         setPlatforms(platformsResponse.data);
        
// // //         setLoading(false);
// // //       } catch (err) {
// // //         setError('Failed to load profile data');
// // //         setLoading(false);
// // //         console.error('Error fetching profile data:', err);
// // //       }
// // //     };

// // //     fetchUserData();
// // //   }, []);

// // useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
// //         // Get token from localStorage
// //         const token = localStorage.getItem('token');
// //         if (!token) {
// //           throw new Error('No authentication token found');
// //         }
// //         // Create config with auth header
// //         const config = {
// //           headers: {
// //             'x-auth-token': token
// //           }
// //         };
// //         // Make parallel requests for user and platforms
// //         const [userResponse, platformsResponse] = await Promise.all([
// //           axios.get('http://localhost:5000/api/user/profile', config),
// //           axios.get('http://localhost:5000/api/user/platforms', config)
// //         ]);
// //         setUser(userResponse.data);
// //         setPlatforms(platformsResponse.data);
// //       } catch (err) {
// //         setError(err.response?.data?.error || 'Failed to load profile data');
// //         console.error('Error fetching profile data:', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchUserData();
// //   }, []);
// //   const refreshPlatformData = async () => {
// //     try {
// //       setRefreshing(true);
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         throw new Error('No authentication token found');
// //       }
// //       const config = {
// //         headers: {
// //           'x-auth-token': token
// //         }
// //       };
// //       // Call the backend endpoint to refresh platform data
// //       const response = await axios.post(
// //         'http://localhost:5000/api/platforms/update',
// //         {},
// //         config
// //       );
// //       setPlatforms(response.data.platforms);
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Failed to refresh platform data');
// //       console.error('Error refreshing platform data:', err);
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   // Get platform icon based on platform name
// //   const getPlatformIcon = (platform) => {
// //     switch (platform) {
// //       case 'LeetCode':
// //         return <SiLeetcode />;
// //       case 'Codeforces':
// //         return <SiCodeforces />;
// //       case 'CodeChef':
// //         return <SiCodechef />;
// //       case 'HackerRank':
// //         return <SiHackerrank />;
// //       case 'HackerEarth':
// //         return <SiHackerearth />;
// //       case 'GeeksForGeeks':
// //         return <SiGeeksforgeeks />;
// //       default:
// //         return <FaCode />;
// //     }
// //   };

// //   // Calculate total solved problems across all platforms
// //   const totalSolvedProblems = platforms.reduce((total, platform) => {
// //     return total + (platform.solvedProblems || 0);
// //   }, 0);

// //   // Generate activity heat map data
// //   // This would typically come from your API
// //   const generateActivityData = () => {
// //     const today = new Date();
// //     const activityData = [];
    
// //     // Generate 365 days of fake data
// //     for (let i = 364; i >= 0; i--) {
// //       const date = new Date(today);
// //       date.setDate(today.getDate() - i);
// //       // Random number of problems solved (0-12)
// //       const problemsSolved = Math.floor(Math.random() * 13);
// //       activityData.push({
// //         date: date.toISOString().split('T')[0],
// //         count: problemsSolved
// //       });
// //     }
    
// //     return activityData;
// //   };

// //   const activityData = generateActivityData();

// //   // Get color based on number of problems solved
// //   const getActivityColor = (count) => {
// //     if (count === 0) return ''; // Empty cell
// //     if (count <= 3) return 'activity-level-1';
// //     if (count <= 5) return 'activity-level-2';
// //     if (count <= 10) return 'activity-level-3';
// //     return 'activity-level-4';
// //   };
// //   // Create calendar grid for activity heatmap
// //   const renderActivityHeatmap = () => {
// //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// //     const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// //     // Group activity data by week
// //     const weeks = [];
// //     let currentWeek = [];
// //     // First, fill in any missing days at the beginning
// //     const firstDate = new Date(activityData[0].date);
// //     const dayOfWeek = firstDate.getDay();
// //     for (let i = 0; i < dayOfWeek; i++) {
// //       currentWeek.push({ empty: true });
// //     }
    
// //     // Now add the actual data
// //     activityData.forEach((day, index) => {
// //       const date = new Date(day.date);
// //       currentWeek.push({
// //         date: day.date,
// //         count: day.count,
// //         color: getActivityColor(day.count)
// //       });
      
// //       if (date.getDay() === 6 || index === activityData.length - 1) {
// //         // Fill in any missing days at the end of the last week
// //         if (index === activityData.length - 1 && date.getDay() !== 6) {
// //           for (let i = date.getDay() + 1; i <= 6; i++) {
// //             currentWeek.push({ empty: true });
// //           }
// //         }
        
// //         weeks.push([...currentWeek]);
// //         currentWeek = [];
// //       }
// //     });
    
// //     // Create month labels
// //     const monthLabels = [];
// //     let currentMonth = -1;
    
// //     activityData.forEach((day, index) => {
// //       const date = new Date(day.date);
// //       const month = date.getMonth();
      
// //       if (month !== currentMonth && date.getDate() <= 7) {
// //         monthLabels.push({
// //           month: months[month],
// //           index: Math.floor(index / 7)
// //         });
// //         currentMonth = month;
// //       }
// //     });
    
// //     return (
// //       <div className="activity-heatmap-container">
// //         <div className="heatmap-header">
// //           <h3>Coding Activity</h3>
// //           <div className="heatmap-legend">
// //             <span>Less</span>
// //             <div className="legend-cells">
// //               <div className="legend-cell"></div>
// //               <div className="legend-cell activity-level-1"></div>
// //               <div className="legend-cell activity-level-2"></div>
// //               <div className="legend-cell activity-level-3"></div>
// //               <div className="legend-cell activity-level-4"></div>
// //             </div>
// //             <span>More</span>
// //           </div>
// //         </div>
        
// //         <div className="activity-heatmap">
// //           <div className="weekday-labels">
// //             {weekdays.map((day, index) => (
// //               index % 2 === 0 && <div key={day} className="weekday-label">{day}</div>
// //             ))}
// //           </div>
          
// //           <div className="heatmap-grid">
// //             <div className="month-labels">
// //               {monthLabels.map((label, i) => (
// //                 <div 
// //                   key={i} 
// //                   className="month-label" 
// //                   style={{ gridColumn: label.index + 1 }}
// //                 >
// //                   {label.month}
// //                 </div>
// //               ))}
// //             </div>
            
// //             <div className="heatmap-weeks">
// //               {weeks.map((week, weekIndex) => (
// //                 <div key={weekIndex} className="heatmap-week">
// //                   {week.map((day, dayIndex) => (
// //                     <div 
// //                       key={`${weekIndex}-${dayIndex}`} 
// //                       className={`heatmap-day ${day.color || ''} ${day.empty ? 'empty-day' : ''}`}
// //                       title={day.empty ? '' : `${day.date}: ${day.count} problems`}
// //                     ></div>
// //                   ))}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const renderStatCards = () => {
// //     // Calculate streak
// //     const streakDays = activityData
// //       .reverse()
// //       .reduce((streak, day) => {
// //         if (day.count > 0) {
// //           return streak + 1;
// //         }
// //         return 0;
// //       }, 0);
    
// //     // Calculate max solved in a day
// //     const maxSolved = Math.max(...activityData.map(day => day.count));
    
// //     // Calculate average solved per active day
// //     const activeDays = activityData.filter(day => day.count > 0).length;
// //     const avgSolved = activeDays > 0 
// //       ? (totalSolvedProblems / activeDays).toFixed(1) 
// //       : 0;
    
// //     return (
// //       <div className="stat-cards">
// //         <div className="stat-card">
// //           <div className="stat-icon">
// //             <FaCode />
// //           </div>
// //           <div className="stat-content">
// //             <h3>{totalSolvedProblems}</h3>
// //             <p>Problems Solved</p>
// //           </div>
// //         </div>
        
// //         <div className="stat-card">
// //           <div className="stat-icon">
// //             <FaCalendarAlt />
// //           </div>
// //           <div className="stat-content">
// //             <h3>{streakDays}</h3>
// //             <p>Day Streak</p>
// //           </div>
// //         </div>
        
// //         <div className="stat-card">
// //           <div className="stat-icon">
// //             <FaMedal />
// //           </div>
// //           <div className="stat-content">
// //             <h3>{maxSolved}</h3>
// //             <p>Max in a Day</p>
// //           </div>
// //         </div>
        
// //         <div className="stat-card">
// //           <div className="stat-icon">
// //             <FaStar />
// //           </div>
// //           <div className="stat-content">
// //             <h3>{avgSolved}</h3>
// //             <p>Avg. per Day</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const renderPlatformsOverview = () => {
// //     return (
// //       <div className="platforms-overview">
// //         <h3>Platform Stats</h3>
// //         <div className="platform-cards">
// //           {platforms.map(platform => (
// //             <div key={platform._id} className="platform-detail-card">
// //               <div className="platform-header">
// //                 <div className="platform-icon">
// //                   {getPlatformIcon(platform.platformName)}
// //                 </div>
// //                 <div className="platform-name">
// //                   <h4>{platform.platformName}</h4>
// //                   <a href={platform.profileUrl || '#'} target="_blank" rel="noreferrer">
// //                     @{platform.handle}
// //                   </a>
// //                 </div>
// //               </div>
              
// //               <div className="platform-stats">
// //                 <div className="platform-stat">
// //                   <span className="stat-label">Rating</span>
// //                   <span className="stat-value">{platform.rating || 'N/A'}</span>
// //                 </div>
// //                 <div className="platform-stat">
// //                   <span className="stat-label">Rank</span>
// //                   <span className="stat-value">{platform.rank || 'N/A'}</span>
// //                 </div>
// //                 <div className="platform-stat">
// //                   <span className="stat-label">Solved</span>
// //                   <span className="stat-value">{platform.solvedProblems || 0}</span>
// //                 </div>
// //               </div>
              
// //               <div className="platform-last-updated">
// //                 Last updated: {new Date(platform.lastUpdated).toLocaleDateString()}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (loading) 
// //     {
// //     return (
// //       <div className="profile-container">
// //         <div className="loading-spinner-container">
// //           <div className="loading-spinner"></div>
// //           <p>Loading profile data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) 
// //     {
// //     return (
// //       <div className="profile-container">
// //         <div className="alert alert-error">
// //           <div className="alert-icon">⚠️</div>
// //           <div>{error}</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return (
// //       <div className="profile-container">
// //         <div className="alert alert-error">
// //           <div className="alert-icon">⚠️</div>
// //           <div>User not found</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="profile-container">
// //       <div className="profile-content">
// //         {/* Profile Header */}
// //         <div className="profile-header">
// //           <div className="profile-cover"></div>
// //           <div className="profile-info">
// //             <div className="profile-avatar">
// //               {user.profilePicture ? (
// //                 <img src={user.profilePicture} alt={user.name} />
// //               ) : (
// //                 <div className="profile-avatar-placeholder">
// //                   {user.name.charAt(0).toUpperCase()}
// //                 </div>
// //               )}
// //             </div>
            
// //             <div className="profile-details">
// //               <h1 className="profile-name">{user.name}</h1>
// //               <p className="profile-bio">{user.bio || 'No bio added yet'}</p>
              
// //               <div className="profile-links">
// //                 {user.githubUrl && (
// //                   <a href={user.githubUrl} target="_blank" rel="noreferrer" className="profile-link">
// //                     <FaGithub /> GitHub
// //                   </a>
// //                 )}
                
// //                 {user.linkedinUrl && (
// //                   <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="profile-link">
// //                     <FaLinkedin /> LinkedIn
// //                   </a>
// //                 )}
                
// //                 {user.portfolioUrl && (
// //                   <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="profile-link">
// //                     <FaGlobe /> Portfolio
// //                   </a>
// //                 )}
                
// //                 <span className="profile-stat">
// //                   <FaCodepen /> {platforms.length} Platform{platforms.length !== 1 ? 's' : ''}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Profile Tabs */}
// //         <div className="profile-tabs">
// //           <button 
// //             className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
// //             onClick={() => setActiveTab('overview')}
// //           >
// //             Overview
// //           </button>
// //           <button 
// //             className={`profile-tab ${activeTab === 'platforms' ? 'active' : ''}`}
// //             onClick={() => setActiveTab('platforms')}
// //           >
// //             Platforms
// //           </button>
// //         </div>
        
// //         {/* Tab Content */}
// //         <div className="profile-tab-content">
// //           {activeTab === 'overview' ? (
// //             <>
// //               {/* Statistics Cards */}
// //               {renderStatCards()}
              
// //               {/* Activity Heatmap */}
// //               {renderActivityHeatmap()}
              
// //               {/* Platforms Overview */}
// //               {platforms.length > 0 ? (
// //                 renderPlatformsOverview()
// //               ) : (
// //                 <div className="empty-platforms">
// //                   <div className="empty-icon">
// //                     <FaCode />
// //                   </div>
// //                   <h3>No Platforms Added Yet</h3>
// //                   <p>Connect your coding platforms to track your progress</p>
// //                 </div>
// //               )}
// //             </>
// //           ) : (
// //             <div className="platforms-detail">
// //               <h3>Connected Platforms</h3>
              
// //               {platforms.length > 0 ? (
// //                 <div className="platforms-detail-list">
// //                   {platforms.map(platform => (
// //                     <div key={platform._id} className="platform-detail-card full-width">
// //                       <div className="platform-header">
// //                         <div className="platform-icon">
// //                           {getPlatformIcon(platform.platformName)}
// //                         </div>
// //                         <div className="platform-name">
// //                           <h4>{platform.platformName}</h4>
// //                           <a href={platform.profileUrl || '#'} target="_blank" rel="noreferrer">
// //                             @{platform.handle}
// //                           </a>
// //                         </div>
// //                       </div>
                      
// //                       <div className="platform-stats detailed">
// //                         <div className="platform-stat">
// //                           <span className="stat-label">Rating</span>
// //                           <span className="stat-value">{platform.rating || 'N/A'}</span>
// //                         </div>
// //                         <div className="platform-stat">
// //                           <span className="stat-label">Rank</span>
// //                           <span className="stat-value">{platform.rank || 'N/A'}</span>
// //                         </div>
// //                         <div className="platform-stat">
// //                           <span className="stat-label">Solved</span>
// //                           <span className="stat-value">{platform.solvedProblems || 0}</span>
// //                         </div>
// //                         <div className="platform-stat">
// //                           <span className="stat-label">Last Updated</span>
// //                           <span className="stat-value">{new Date(platform.lastUpdated).toLocaleDateString()}</span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <div className="empty-platforms">
// //                   <div className="empty-icon">
// //                     <FaCode />
// //                   </div>
// //                   <h3>No Platforms Added Yet</h3>
// //                   <p>Connect your coding platforms to track your progress</p>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   FaGithub, FaLinkedin, FaGlobe, FaCodepen, 
//   FaMedal, FaCode, FaCalendarAlt, FaStar, FaSync 
// } from 'react-icons/fa';
// import { 
//   SiLeetcode, SiCodeforces, SiCodechef, 
//   SiHackerrank, SiHackerearth, SiGeeksforgeeks 
// } from 'react-icons/si';
// import './Profile.css';

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [platforms, setPlatforms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const config = {
//         headers: {
//           'x-auth-token': token
//         }
//       };

//       const [profileResponse, platformsResponse] = await Promise.all([
//         axios.get('http://localhost:5000/api/profile', config),
//         axios.get('http://localhost:5000/api/platform', config)
//       ]);

//       setUser(profileResponse.data.user);
//       setPlatforms(platformsResponse.data.platforms);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || 'Failed to load profile data');
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshPlatformData = async () => {
//     try {
//       setRefreshing(true);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }
//       const config = {
//         headers: {
//           'x-auth-token': token
//         }
//       };

//       const response = await axios.post(
//         'http://localhost:5000/api/platforms/update',
//         {},
//         config
//       );
      
//       setPlatforms(response.data.platforms);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || 'Failed to refresh data');
//       console.error('Refresh error:', err);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Get platform icon component
//   const getPlatformIcon = (platform) => {
//     const platformIcons = {
//       'LeetCode': <SiLeetcode />,
//       'Codeforces': <SiCodeforces />,
//       'CodeChef': <SiCodechef />,
//       'HackerRank': <SiHackerrank />,
//       'HackerEarth': <SiHackerearth />,
//       'GeeksForGeeks': <SiGeeksforgeeks />
//     };
//     return platformIcons[platform] || <FaCode />;
//   };

//   // Calculate statistics
//   const calculateStats = () => {
//     const totalSolved = platforms.reduce((sum, p) => sum + (p.solvedProblems || 0), 0);
//     const activityData = generateActivityData();
    
//     const streak = activityData
//       .slice().reverse()
//       .reduce((count, day) => day.count > 0 ? count + 1 : 0, 0);
    
//     const maxDaily = Math.max(...activityData.map(d => d.count));
//     const activeDays = activityData.filter(d => d.count > 0).length;
//     const avgDaily = activeDays > 0 ? (totalSolved / activeDays).toFixed(1) : 0;

//     return { totalSolved, streak, maxDaily, avgDaily, activityData };
//   };

//   // Generate activity data (mock - replace with real data from backend)
//   const generateActivityData = () => {
//     const today = new Date();
//     return Array.from({ length: 365 }, (_, i) => {
//       const date = new Date(today);
//       date.setDate(date.getDate() - (364 - i));
//       return {
//         date: date.toISOString().split('T')[0],
//         count: Math.min(Math.floor(Math.random() * 10), 12)
//       };
//     });
//   };
//   // Render activity heatmap
//   const renderActivityHeatmap = ({ activityData }) => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     // Group by weeks
//     const weeks = [];
//     let currentWeek = Array(new Date(activityData[0].date).getDay()).fill({ empty: true });
//     activityData.forEach(day => {
//       currentWeek.push({
//         date: day.date,
//         count: day.count,
//         color: `activity-level-${Math.min(Math.floor(day.count / 3) + 1, 4)}`
//       });

//       if (currentWeek.length === 7) {
//         weeks.push(currentWeek);
//         currentWeek = [];
//       }
//     });
//     // Add remaining days
//     if (currentWeek.length > 0) {
//       weeks.push([...currentWeek, ...Array(7 - currentWeek.length).fill({ empty: true })]);
//     }
//     // Get month labels
//     const monthLabels = [];
//     let currentMonth = -1;
//     activityData.forEach((day, i) => {
//       const month = new Date(day.date).getMonth();
//       if (month !== currentMonth && new Date(day.date).getDate() <= 7) {
//         monthLabels.push({ month: months[month], index: Math.floor(i / 7) });
//         currentMonth = month;
//       }
//     });
//     return (
//       <div className="activity-heatmap-container">
//         <div className="heatmap-header">
//           <h3>Coding Activity</h3>
//           <div className="heatmap-legend">
//             <span>Less</span>
//             {[1, 2, 3, 4].map(level => (
//               <div key={level} className={`legend-cell activity-level-${level}`} />
//             ))}
//             <span>More</span>
//           </div>
//         </div>
//         <div className="activity-heatmap">
//           <div className="weekday-labels">
//             {weekdays.filter((_, i) => i % 2 === 0).map(day => (
//               <div key={day} className="weekday-label">{day}</div>
//             ))}
//           </div>
//           <div className="heatmap-grid">
//             <div className="month-labels">
//               {monthLabels.map((label, i) => (
//                 <div key={i} className="month-label" style={{ gridColumn: label.index + 1 }}>
//                   {label.month}
//                 </div>
//               ))}
//             </div>        
//             <div className="heatmap-weeks">
//               {weeks.map((week, wi) => (
//                 <div key={wi} className="heatmap-week">
//                   {week.map((day, di) => (
//                     <div
//                       key={`${wi}-${di}`}
//                       className={`heatmap-day ${day.color || ''} ${day.empty ? 'empty-day' : ''}`}
//                       title={day.empty ? '' : `${day.date}: ${day.count} problems`}
//                     />
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
//   // Render statistics cards
//   const renderStatCards = ({ totalSolved, streak, maxDaily, avgDaily }) => (
//     <div className="stat-cards">
//       {[
//         { icon: <FaCode />, value: totalSolved, label: 'Problems Solved' },
//         { icon: <FaCalendarAlt />, value: streak, label: 'Day Streak' },
//         { icon: <FaMedal />, value: maxDaily, label: 'Max in a Day' },
//         { icon: <FaStar />, value: avgDaily, label: 'Avg. per Day' }
//       ].map((stat, i) => (
//         <div key={i} className="stat-card">
//           <div className="stat-icon">{stat.icon}</div>
//           <div className="stat-content">
//             <h3>{stat.value}</h3>
//             <p>{stat.label}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
//   // Render platform cards
//   const renderPlatformCards = () => (
//     <div className="platform-cards">
//       {platforms.map(platform => (
//         <div key={platform._id} className="platform-detail-card">
//           <div className="platform-header">
//             <div className="platform-icon">
//               {getPlatformIcon(platform.platformName)}
//             </div>
//             <div className="platform-name">
//               <h4>{platform.platformName}</h4>
//               <a href={platform.profileUrl} target="_blank" rel="noreferrer">
//                 @{platform.handle}
//               </a>
//             </div>
//           </div>
          
//           <div className="platform-stats">
//             <div className="platform-stat">
//               <span>Rating</span>
//               <span>{platform.rating || 'N/A'}</span>
//             </div>
//             <div className="platform-stat">
//               <span>Rank</span>
//               <span>{platform.rank || 'N/A'}</span>
//             </div>
//             <div className="platform-stat">
//               <span>Solved</span>
//               <span>{platform.solvedProblems || 0}</span>
//             </div>
//           </div>
          
//           <div className="platform-last-updated">
//             Last updated: {new Date(platform.lastUpdated).toLocaleDateString()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="profile-container">
//         <div className="loading-spinner-container">
//           <div className="loading-spinner" />
//           <p>Loading profile data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="profile-container">
//         <div className="alert alert-error">
//           <div className="alert-icon">⚠️</div>
//           <div>{error}</div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     console.log("NO user")
//     return null; // Handled by error state
//   }

//   const stats = calculateStats();

//   return (
//     <div className="profile-container">
//       <div className="profile-content">
//         {/* Profile Header */}
//         <div className="profile-header">
//           <div className="profile-cover" />
//           <div className="profile-info">
//             <div className="profile-avatar">
//               {user.profilePicture ? (
//                 <img src={user.profilePicture} alt={user.name} />
//               ) : (
//                 <div className="profile-avatar-placeholder">
//                   {user.name.charAt(0).toUpperCase()}
//                 </div>
//               )}
//             </div>
            
//             <div className="profile-details">
//               <h1 className="profile-name">{user.name}</h1>
//               <p className="profile-bio">{user.bio || 'No bio added yet'}</p>
              
//               <div className="profile-links">
//                 {user.githubUrl && (
//                   <a href={user.githubUrl} target="_blank" rel="noreferrer" className="profile-link">
//                     <FaGithub /> GitHub
//                   </a>
//                 )}
//                 {user.linkedinUrl && (
//                   <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="profile-link">
//                     <FaLinkedin /> LinkedIn
//                   </a>
//                 )}
//                 {user.portfolioUrl && (
//                   <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="profile-link">
//                     <FaGlobe /> Portfolio
//                   </a>
//                 )}
//                 <button 
//                   onClick={refreshPlatformData}
//                   disabled={refreshing}
//                   className="refresh-button"
//                 >
//                   <FaSync className={refreshing ? 'spinning' : ''} />
//                   {refreshing ? 'Refreshing...' : 'Refresh Data'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Profile Tabs */}
//         <div className="profile-tabs">
//           {['overview', 'platforms'].map(tab => (
//             <button
//               key={tab}
//               className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>
        
//         {/* Tab Content */}
//         <div className="profile-tab-content">
//           {activeTab === 'overview' ? (
//             <>
//               {renderStatCards(stats)}
//               {renderActivityHeatmap(stats)}
//               {platforms.length > 0 ? (
//                 <div className="platforms-overview">
//                   <h3>Platform Stats</h3>
//                   {renderPlatformCards()}
//                 </div>
//               ) : (
//                 <div className="empty-platforms">
//                   <div className="empty-icon"><FaCode /></div>
//                   <h3>No Platforms Added Yet</h3>
//                   <p>Connect your coding platforms to track your progress</p>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="platforms-detail">
//               <h3>Connected Platforms</h3>
//               {platforms.length > 0 ? (
//                 <div className="platforms-detail-list">
//                   {platforms.map(platform => (
//                     <div key={platform._id} className="platform-detail-card full-width">
//                       <div className="platform-header">
//                         <div className="platform-icon">
//                           {getPlatformIcon(platform.platformName)}
//                         </div>
//                         <div className="platform-name">
//                           <h4>{platform.platformName}</h4>
//                           <a href={platform.profileUrl} target="_blank" rel="noreferrer">
//                             @{platform.handle}
//                           </a>
//                         </div>
//                       </div>
                      
//                       <div className="platform-stats detailed">
//                         <div className="platform-stat">
//                           <span>Rating</span>
//                           <span>{platform.rating || 'N/A'}</span>
//                         </div>
//                         <div className="platform-stat">
//                           <span>Rank</span>
//                           <span>{platform.rank || 'N/A'}</span>
//                         </div>
//                         <div className="platform-stat">
//                           <span>Solved</span>
//                           <span>{platform.solvedProblems || 0}</span>
//                         </div>
//                         <div className="platform-stat">
//                           <span>Last Updated</span>
//                           <span>{new Date(platform.lastUpdated).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="empty-platforms">
//                   <div className="empty-icon"><FaCode /></div>
//                   <h3>No Platforms Added Yet</h3>
//                   <p>Connect your coding platforms to track your progress</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaGithub, FaLinkedin, FaGlobe, FaCodepen, 
  FaMedal, FaCode, FaCalendarAlt, FaStar, FaSync,
  FaPlus, FaTimes
} from 'react-icons/fa';
import { 
  SiLeetcode, SiCodeforces, SiCodechef, 
  SiHackerrank, SiHackerearth, SiGeeksforgeeks 
} from 'react-icons/si';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [newPlatform, setNewPlatform] = useState({
    platformName: '',
    handle: ''
  });
  const [availablePlatforms] = useState([
    { name: 'LeetCode', icon: <SiLeetcode /> },
    { name: 'Codeforces', icon: <SiCodeforces /> },
    { name: 'CodeChef', icon: <SiCodechef /> },
    { name: 'HackerRank', icon: <SiHackerrank /> },
    { name: 'AtCoder', icon: <SiCodeforces /> }, // Using same icon for now
    { name: 'HackerEarth', icon: <SiHackerearth /> },
    { name: 'GeeksForGeeks', icon: <SiGeeksforgeeks /> }
  ]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const [profileResponse, platformsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/profile', config),
        axios.get('http://localhost:5000/api/platform', config)
      ]);

      setUser(profileResponse.data.user);
      setPlatforms(platformsResponse.data.platforms);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load profile data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPlatformData = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/platform/update',
        {},
        config
      );
      
      setPlatforms(response.data.platforms);
      toast.success('Platform data refreshed successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to refresh data';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddPlatform = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await axios.post(
        'http://localhost:5000/api/platform',
        newPlatform,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      setPlatforms([...platforms, response.data.platform]);
      setShowAddPlatform(false);
      setNewPlatform({ platformName: '', handle: '' });
      toast.success(`${newPlatform.platformName} added successfully!`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add platform';
      toast.error(errorMsg);
      console.error('Add platform error:', err);
    }
  };

  const handleRemovePlatform = async (platformId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      await axios.delete(
        `http://localhost:5000/api/platform/${platformId}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      setPlatforms(platforms.filter(p => p._id !== platformId));
      toast.success('Platform removed successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to remove platform';
      toast.error(errorMsg);
      console.error('Remove platform error:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getPlatformIcon = (platform) => {
    const platformIcons = {
      'LeetCode': <SiLeetcode />,
      'Codeforces': <SiCodeforces />,
      'CodeChef': <SiCodechef />,
      'HackerRank': <SiHackerrank />,
      'HackerEarth': <SiHackerearth />,
      'GeeksForGeeks': <SiGeeksforgeeks />,
      'AtCoder': <SiCodeforces />
    };
    return platformIcons[platform] || <FaCode />;
  };

  const calculateStats = () => {
    const totalSolved = platforms.reduce((sum, p) => sum + (p.solvedProblems || 0), 0);
    
    // Get activity from backend
    const activityData = user?.activityData || [];
    
    const streak = activityData
      .slice().reverse()
      .reduce((count, day) => day.count > 0 ? count + 1 : 0, 0);
    
    const maxDaily = Math.max(...activityData.map(d => d.count), 0);
    const activeDays = activityData.filter(d => d.count > 0).length;
    const avgDaily = activeDays > 0 ? (totalSolved / activeDays).toFixed(1) : 0;

    return { totalSolved, streak, maxDaily, avgDaily, activityData };
  };

  const renderActivityHeatmap = ({ activityData }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Group by weeks
    const weeks = [];
    let currentWeek = Array(new Date(activityData[0]?.date).getDay() || 0).fill({ empty: true });
    
    activityData.forEach(day => {
      currentWeek.push({
        date: day.date,
        count: day.count,
        color: `activity-level-${Math.min(Math.floor(day.count / 3) + 1, 4)}`
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days
    if (currentWeek.length > 0) {
      weeks.push([...currentWeek, ...Array(7 - currentWeek.length).fill({ empty: true })]);
    }
    
    // Get month labels
    const monthLabels = [];
    let currentMonth = -1;
    activityData.forEach((day, i) => {
      const month = new Date(day.date).getMonth();
      if (month !== currentMonth && new Date(day.date).getDate() <= 7) {
        monthLabels.push({ month: months[month], index: Math.floor(i / 7) });
        currentMonth = month;
      }
    });

    return (
      <div className="activity-heatmap-container">
        <div className="heatmap-header">
          <h3>Coding Activity</h3>
          <div className="heatmap-legend">
            <span>Less</span>
            {[1, 2, 3, 4].map(level => (
              <div key={level} className={`legend-cell activity-level-${level}`} />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="activity-heatmap">
          <div className="weekday-labels">
            {weekdays.filter((_, i) => i % 2 === 0).map(day => (
              <div key={day} className="weekday-label">{day}</div>
            ))}
          </div>
          <div className="heatmap-grid">
            <div className="month-labels">
              {monthLabels.map((label, i) => (
                <div key={i} className="month-label" style={{ gridColumn: label.index + 1 }}>
                  {label.month}
                </div>
              ))}
            </div>        
            <div className="heatmap-weeks">
              {weeks.map((week, wi) => (
                <div key={wi} className="heatmap-week">
                  {week.map((day, di) => (
                    <div
                      key={`${wi}-${di}`}
                      className={`heatmap-day ${day.color || ''} ${day.empty ? 'empty-day' : ''}`}
                      title={day.empty ? '' : `${day.date}: ${day.count} problems`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatCards = ({ totalSolved, streak, maxDaily, avgDaily }) => (
    <div className="stat-cards">
      {[
        { icon: <FaCode />, value: totalSolved, label: 'Problems Solved' },
        { icon: <FaCalendarAlt />, value: streak, label: 'Day Streak' },
        { icon: <FaMedal />, value: maxDaily, label: 'Max in a Day' },
        { icon: <FaStar />, value: avgDaily, label: 'Avg. per Day' }
      ].map((stat, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPlatformCards = () => (
    <div className="platform-cards">
      {platforms.map(platform => (
        <div key={platform._id} className="platform-detail-card">
          <div className="platform-header">
            <div className="platform-icon">
              {getPlatformIcon(platform.platformName)}
            </div>
            <div className="platform-name">
              <h4>{platform.platformName}</h4>
              <a href={platform.profileUrl} target="_blank" rel="noreferrer">
                @{platform.handle}
              </a>
            </div>
            <button 
              className="remove-platform-btn"
              onClick={() => handleRemovePlatform(platform._id)}
              title="Remove platform"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="platform-stats">
            <div className="platform-stat">
              <span>Rating</span>
              <span>{platform.rating || 'N/A'}</span>
            </div>
            <div className="platform-stat">
              <span>Rank</span>
              <span>{platform.rank || 'N/A'}</span>
            </div>
            <div className="platform-stat">
              <span>Solved</span>
              <span>{platform.solvedProblems || 0}</span>
            </div>
          </div>
          
          <div className="platform-last-updated">
            Last updated: {new Date(platform.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      ))}
      
      <div 
        className="add-platform-card"
        onClick={() => setShowAddPlatform(true)}
      >
        <FaPlus />
        <span>Add Platform</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner" />
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="alert alert-error">
          <div className="alert-icon">⚠️</div>
          <div>{error}</div>
          <button onClick={fetchUserData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = calculateStats();

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover" />
          <div className="profile-info">
            <div className="profile-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-bio">{user.bio || 'No bio added yet'}</p>
              
              <div className="profile-links">
                {user.githubUrl && (
                  <a href={user.githubUrl} target="_blank" rel="noreferrer" className="profile-link">
                    <FaGithub /> GitHub
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="profile-link">
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
                {user.portfolioUrl && (
                  <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="profile-link">
                    <FaGlobe /> Portfolio
                  </a>
                )}
                <button 
                  onClick={refreshPlatformData}
                  disabled={refreshing}
                  className="refresh-button"
                >
                  <FaSync className={refreshing ? 'spinning' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <div className="profile-tabs">
          {['overview', 'platforms'].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="profile-tab-content">
          {activeTab === 'overview' ? (
            <>
              {renderStatCards(stats)}
              {renderActivityHeatmap(stats)}
              {platforms.length > 0 ? (
                <div className="platforms-overview">
                  <h3>Platform Stats</h3>
                  {renderPlatformCards()}
                </div>
              ) : (
                <div className="empty-platforms">
                  <div className="empty-icon"><FaCode /></div>
                  <h3>No Platforms Added Yet</h3>
                  <p>Connect your coding platforms to track your progress</p>
                  <button 
                    className="add-platform-btn"
                    onClick={() => setShowAddPlatform(true)}
                  >
                    <FaPlus /> Add Platform
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="platforms-detail">
              <h3>Connected Platforms</h3>
              {platforms.length > 0 ? (
                <div className="platforms-detail-list">
                  {platforms.map(platform => (
                    <div key={platform._id} className="platform-detail-card full-width">
                      <div className="platform-header">
                        <div className="platform-icon">
                          {getPlatformIcon(platform.platformName)}
                        </div>
                        <div className="platform-name">
                          <h4>{platform.platformName}</h4>
                          <a href={platform.profileUrl} target="_blank" rel="noreferrer">
                            @{platform.handle}
                          </a>
                        </div>
                        <button 
                          className="remove-platform-btn"
                          onClick={() => handleRemovePlatform(platform._id)}
                          title="Remove platform"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="platform-stats detailed">
                        <div className="platform-stat">
                          <span>Rating</span>
                          <span>{platform.rating || 'N/A'}</span>
                        </div>
                        <div className="platform-stat">
                          <span>Max Rating</span>
                          <span>{platform.maxRating || 'N/A'}</span>
                        </div>
                        <div className="platform-stat">
                          <span>Rank</span>
                          <span>{platform.rank || 'N/A'}</span>
                        </div>
                        <div className="platform-stat">
                          <span>Solved</span>
                          <span>{platform.solvedProblems || 0}</span>
                        </div>
                        <div className="platform-stat">
                          <span>Last Updated</span>
                          <span>{new Date(platform.lastUpdated).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {platform.problemBreakdown && (
                        <div className="problem-breakdown">
                          <h4>Problem Breakdown</h4>
                          <div className="breakdown-bars">
                            <div 
                              className="breakdown-bar easy" 
                              style={{ width: `${(platform.problemBreakdown.easy / platform.solvedProblems) * 100 || 0}%` }}
                            >
                              <span>Easy: {platform.problemBreakdown.easy || 0}</span>
                            </div>
                            <div 
                              className="breakdown-bar medium" 
                              style={{ width: `${(platform.problemBreakdown.medium / platform.solvedProblems) * 100 || 0}%` }}
                            >
                              <span>Medium: {platform.problemBreakdown.medium || 0}</span>
                            </div>
                            <div 
                              className="breakdown-bar hard" 
                              style={{ width: `${(platform.problemBreakdown.hard / platform.solvedProblems) * 100 || 0}%` }}
                            >
                              <span>Hard: {platform.problemBreakdown.hard || 0}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-platforms">
                  <div className="empty-icon"><FaCode /></div>
                  <h3>No Platforms Added Yet</h3>
                  <p>Connect your coding platforms to track your progress</p>
                  <button 
                    className="add-platform-btn"
                    onClick={() => setShowAddPlatform(true)}
                  >
                    <FaPlus /> Add Platform
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Platform Modal */}
      {showAddPlatform && (
        <div className="modal-overlay">
          <div className="add-platform-modal">
            <div className="modal-header">
              <h3>Add Coding Platform</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowAddPlatform(false);
                  setNewPlatform({ platformName: '', handle: '' });
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddPlatform}>
              <div className="form-group">
                <label>Platform</label>
                <select
                  value={newPlatform.platformName}
                  onChange={(e) => setNewPlatform({
                    ...newPlatform,
                    platformName: e.target.value
                  })}
                  required
                >
                  <option value="">Select a platform</option>
                  {availablePlatforms
                    .filter(p => !platforms.some(pl => pl.platformName === p.name))
                    .map(platform => (
                      <option key={platform.name} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Username/Handle</label>
                <input
                  type="text"
                  value={newPlatform.handle}
                  onChange={(e) => setNewPlatform({
                    ...newPlatform,
                    handle: e.target.value
                  })}
                  placeholder="Your username on this platform"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddPlatform(false);
                    setNewPlatform({ platformName: '', handle: '' });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;