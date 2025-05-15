import React from 'react';
import { format, parseISO } from 'date-fns';

const ContestCard = ({ contest, isBookmarked, onBookmarkToggle }) => {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle(contest.id);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`contest-card ${contest.type}`}>
      <div className="card-header">
        <span className={`platform-tag ${contest.platform.toLowerCase()}`}>
          {contest.platform}
        </span>
        <button 
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>
      
      <div className="card-body">
        <h3 className="contest-name">{contest.name}</h3>
        <div className="contest-meta">
          <div className="meta-item">
            <span className="meta-label">Start:</span>
            <span className="meta-value">{formatDate(contest.startTime)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Duration:</span>
            <span className="meta-value">{contest.duration}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <a 
          href={contest.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="contest-link"
        >
          View Contest
        </a>
      </div>
    </div>
  );
};

export default ContestCard;