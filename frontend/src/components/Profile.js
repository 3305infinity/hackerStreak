import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaGithub, FaLinkedin, FaGlobe, FaCodepen,
  FaMedal, FaCode, FaCalendarAlt, FaStar, FaSync,
  FaPlus, FaTimes
} from 'react-icons/fa';
import {
  SiLeetcode, SiCodeforces, SiCodechef, SiHackerrank, SiHackerearth, SiGeeksforgeeks
} from 'react-icons/si';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [addingPlatform, setAddingPlatform] = useState(false);
  const [newPlatform, setNewPlatform] = useState({
    platformName: '',
    handle: ''
  });
  const [availablePlatforms] = useState([
    { name: 'LeetCode', icon: <SiLeetcode /> },
    { name: 'Codeforces', icon: <SiCodeforces /> },
    { name: 'CodeChef', icon: <SiCodechef /> },
    { name: 'HackerRank', icon: <SiHackerrank /> },
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

      const profileResponse = await axios.get('http://localhost:5000/api/profile', config);
      // Activity endpoint might not exist, so we'll handle it gracefully
      let activityResponse = { data: { activityData: [] } };
      try {
        activityResponse = await axios.get('http://localhost:5000/api/profile/activity', config);
      } catch (activityErr) {
        console.log('Activity data not available, using empty data');
      }

      setUser({ ...profileResponse.data.user, activityData: activityResponse.data.activityData });
      setPlatforms(profileResponse.data.platforms || []);
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
        'http://localhost:5000/api/platforms/update',
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
    if (addingPlatform) return; // Prevent multiple submissions

    try {
      setAddingPlatform(true);
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
    } finally {
      setAddingPlatform(false);
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
      'GeeksForGeeks': <SiGeeksforgeeks />
    };
    return platformIcons[platform] || <FaCode />;
  };

  const calculateStats = () => {
    const totalSolved = platforms.reduce((sum, p) => sum + (p.solvedProblems || 0), 0);
    const totalPlatforms = platforms.length;
    const avgRating = platforms.length > 0 ? (platforms.reduce((sum, p) => sum + (p.rating || 0), 0) / platforms.length).toFixed(0) : 0;

    // Get activity from backend
    const activityData = user?.activityData || [];

    const streak = activityData
      .slice().reverse()
      .reduce((count, day) => day.count > 0 ? count + 1 : 0, 0);

    const maxDaily = Math.max(...activityData.map(d => d.count), 0);
    const activeDays = activityData.filter(d => d.count > 0).length;
    const avgDaily = activeDays > 0 ? (totalSolved / activeDays).toFixed(1) : 0;

    return { totalSolved, totalPlatforms, avgRating, streak, maxDaily, avgDaily, activityData };
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

  const renderStatCards = ({ totalSolved, totalPlatforms, avgRating, streak, maxDaily, avgDaily }) => (
    <div className="stat-cards">
      {/* Cumulative Stats Row */}
      <div className="cumulative-stats-row">
        <div className="cumulative-stat-card">
          <div className="cumulative-stat-icon">
            <FaCode />
          </div>
          <div className="cumulative-stat-content">
            <h2>{totalSolved}</h2>
            <p>Total Problems Solved</p>
          </div>
        </div>
        <div className="cumulative-stat-card">
          <div className="cumulative-stat-icon">
            <FaGlobe />
          </div>
          <div className="cumulative-stat-content">
            <h2>{totalPlatforms}</h2>
            <p>Platforms Connected</p>
          </div>
        </div>
        <div className="cumulative-stat-card">
          <div className="cumulative-stat-icon">
            <FaStar />
          </div>
          <div className="cumulative-stat-content">
            <h2>{avgRating}</h2>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      {[
        { icon: <FaCalendarAlt />, value: streak, label: 'Current Streak', subtitle: 'days' },
        { icon: <FaMedal />, value: maxDaily, label: 'Max Daily', subtitle: 'problems' },
        { icon: <FaStar />, value: avgDaily, label: 'Daily Average', subtitle: 'problems' }
      ].map((stat, i) => (
        <div key={i} className="stat-card detailed">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3>{stat.value} <span className="stat-subtitle">{stat.subtitle}</span></h3>
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
    <div className="home-container">
      <main className="home-main">
        <section className="contests-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">👤</span>
              Profile
            </h2>
          </div>

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
        </section>
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
      </footer>

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
                <button type="submit" className="submit-btn" disabled={addingPlatform}>
                  {addingPlatform ? 'Adding...' : 'Add Platform'}
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
