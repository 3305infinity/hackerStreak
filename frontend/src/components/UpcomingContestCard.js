import React from 'react';
import './ContestCard.css';

const UpcomingContestCard = ({ contest, onBookmark, isBookmarked = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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

  const getDifficultyColor = (minRating) => {
    if (!minRating) return '#6c757d';
    if (minRating <= 1200) return '#00C853';
    if (minRating <= 1600) return '#FF9800';
    if (minRating <= 2000) return '#F44336';
    return '#9C27B0';
  };

  const { date, time } = formatDate(contest.startTime);
  const timeUntil = getTimeUntilStart(contest.startTime);

  return (
    <div className="contest-card">
      <div className="contest-header">
        <div className="platform-badge" style={{ backgroundColor: getPlatformColor(contest.platform) }}>
          {contest.platform}
        </div>
        <button
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => onBookmark(contest)}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      <div className="contest-content">
        <h3 className="contest-title">{contest.name}</h3>

        <div className="contest-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span className="detail-text">{date} at {time}</span>
          </div>

          <div className="detail-item">
            <span className="detail-icon">⏱️</span>
            <span className="detail-text">{contest.duration}</span>
          </div>

          {contest.minRating && (
            <div className="detail-item">
              <span className="detail-icon">🎯</span>
              <span
                className="detail-text"
                style={{ color: getDifficultyColor(contest.minRating) }}
              >
                {contest.minRating} - {contest.maxRating}
              </span>
            </div>
          )}
        </div>

        <div className="contest-footer">
          <div className="time-until">
            <span className="time-badge">
              {timeUntil === 'Started' ? '🔴 LIVE' : `⏰ ${timeUntil}`}
            </span>
          </div>

          <a
            href={contest.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="contest-link"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpcomingContestCard;
