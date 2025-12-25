import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import '../styles/PastContests.css';

function PastContests() {
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePlatform, setActivePlatform] = useState('all');
  const [bookmarks, setBookmarks] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/past");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContests(data.past || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching contests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookmarks");
        if (response.ok) {
          const data = await response.json();
          setBookmarks(new Set(data.bookmarks || []));
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchContests();
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (contestId) => {
    try {
      const newBookmarks = new Set(bookmarks);
      const method = newBookmarks.has(contestId) ? 'DELETE' : 'POST';

      const response = await fetch(`http://localhost:5000/api/bookmark/${contestId}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        if (method === 'DELETE') {
          newBookmarks.delete(contestId);
        } else {
          newBookmarks.add(contestId);
        }
        setBookmarks(newBookmarks);
      } else {
        throw new Error('Failed to update bookmark');
      }
    } catch (err) {
      console.error("Failed to update bookmark:", err);
    }
  };

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
    <div className="past-contests-container">
      <main className="past-contests-main">
        <div className="header-section">
          <h1 className="page-title">Past Contests</h1>
          <p className="page-subtitle">
            Review your past contest performances and learn from them
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
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading past contests...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error loading contests: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="empty-state">
            <p>No past contests found {activePlatform !== 'all' ? `for ${platforms.find(p => p.id === activePlatform)?.name}` : ''}.</p>
          </div>
        ) : (
          <div className="contests-grid">
            {filteredContests.map(contest => (
              <ContestCard
                key={contest.id}
                contest={contest}
                isBookmarked={bookmarks.has(contest.id)}
                onBookmarkToggle={toggleBookmark}
                onClick={() => navigate(`/contest/${contest.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PastContests;
