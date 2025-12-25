import  React   , { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpcomingContestCard from '../components/UpcomingContestCard';
import '../styles/UpcomingContests.css';

function UpcomingContests() {
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePlatform, setActivePlatform] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/upcoming");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContests(data.upcoming || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching contests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getFilteredContests = () => {
    if (activePlatform === 'all') {
      return contests;
    }
    return contests.filter(contest =>
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
    <div className="home-container">
      <main className="home-main">
        <section className="contests-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Upcoming Contests
            </h2>
            <div className="filter-tabs">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  className={`filter-tab ${activePlatform === platform.id ? 'active' : ''}`}
                  onClick={() => setActivePlatform(platform.id)}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading upcoming contests...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Error loading contests: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No upcoming contests found</h3>
              <p>Check back later for upcoming coding challenges</p>
            </div>
          ) : (
            <div className="contest-grid">
              {filteredContests.map(contest => (
                <UpcomingContestCard
                  key={contest.id}
                  contest={contest}
                  onClick={() => navigate(`/contest/${contest.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UpcomingContests;
