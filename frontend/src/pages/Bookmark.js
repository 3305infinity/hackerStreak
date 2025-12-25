import React, { useState, useEffect } from 'react';
import { useBookmark } from '../context/BookmarkContext';
import './BookmarksPage.css';

const Bookmark = () => {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmark();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveBookmark = async (contestId) => {
    try {
      setLoading(true);
      await removeBookmark(contestId);
    } catch (err) {
      setError('Failed to remove bookmark');
      console.error('Remove bookmark error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      try {
        setLoading(true);
        await clearAllBookmarks();
      } catch (err) {
        setError('Failed to clear bookmarks');
        console.error('Clear bookmarks error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Codeforces': '#1F8ACB',
      'LeetCode': '#FFA116',
      'AtCoder': '#FF6B35',
      'CodeChef': '#5B4638'
    };
    return colors[platform] || '#6c757d';
  };

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <div>
            <h1>My Bookmarks</h1>
            <p>Save contests you're interested in for quick access</p>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No bookmarks yet</h3>
          <p>Bookmark contests from the upcoming contests page to keep track of events you're interested in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <div>
          <h1>My Bookmarks</h1>
          <p>{bookmarks.length} bookmarked contest{bookmarks.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="clear-all-btn"
          onClick={handleClearAll}
          disabled={loading}
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="bookmarks-grid">
        {bookmarks.map((contest) => (
          <div key={contest.contestId || contest.id} className="bookmark-card">
            <div className="bookmark-header">
              <h3>{contest.name}</h3>
              <button
                className="remove-btn"
                onClick={() => handleRemoveBookmark(contest.contestId || contest.id)}
                disabled={loading}
                title="Remove bookmark"
              >
                ×
              </button>
            </div>

            <div className="bookmark-details">
              <div className="detail-item">
                <span className="label">Platform:</span>
                <span
                  className="value"
                  style={{ color: getPlatformColor(contest.platform) }}
                >
                  {contest.platform}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Date:</span>
                <span className="value">{formatDate(contest.startTime)}</span>
              </div>

              <div className="detail-item">
                <span className="label">Duration:</span>
                <span className="value">{contest.duration}</span>
              </div>

              {contest.minRating && (
                <div className="detail-item">
                  <span className="label">Rating:</span>
                  <span className="value">{contest.minRating} - {contest.maxRating}</span>
                </div>
              )}
            </div>

            <div className="bookmark-actions">
              <a
                href={contest.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="contest-link"
              >
                View Contest
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmark;
