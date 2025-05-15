import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { 
  FaExternalLinkAlt, 
  FaClock, 
  FaCalendarAlt,
  FaTrash,
  FaShareAlt,
  FaBell
} from 'react-icons/fa';
import './BookmarkCard.css';

const platformData = {
  Codeforces: { color: 'bg-purple-100 text-purple-800' },
  LeetCode: { color: 'bg-orange-100 text-orange-800' },
  CodeChef: { color: 'bg-blue-100 text-blue-800' },
  AtCoder: { color: 'bg-green-100 text-green-800' },
  default: { color: 'bg-gray-100 text-gray-800' }
};

const BookmarkCard = ({ contest, onRemove, onSetReminder, onShare }) => {
  const { name, platform, url, startTime, duration } = contest;
  const platformInfo = platformData[platform] || platformData.default;
  const isPast = moment(startTime).isBefore(moment());
  const status = isPast ? 'Past' : 'Upcoming';
  const statusColor = isPast ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

  const durationHours = Math.floor(moment.duration(duration).asHours());
  const durationMinutes = moment.duration(duration).minutes();
  const formattedDate = moment(startTime).format('MMMM Do YYYY, h:mm A');

  return (
    <div className={`bookmark-card ${isPast ? 'past-contest' : ''}`}>
      <div className="card-header">
        <div className={`platform-badge ${platformInfo.color}`}>
          {platform}
        </div>
        <div className={`status-badge ${statusColor}`}>
          {status}
        </div>
      </div>

      <div className="card-body">
        <h3 className="contest-title">{name}</h3>
        
        <div className="contest-meta">
          <div className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            <span>{formattedDate}</span>
          </div>
          <div className="meta-item">
            <FaClock className="meta-icon" />
            <span>{durationHours}h {durationMinutes}m</span>
          </div>
        </div>

        {!isPast && (
          <div className="countdown">
            <span>Starts in: </span>
            <CountdownTimer targetDate={startTime} />
          </div>
        )}
      </div>

      <div className="card-footer">
        <button 
          className="action-btn danger"
          onClick={() => onRemove(contest.id)}
        >
          <FaTrash />
        </button>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn primary"
        >
          <FaExternalLinkAlt />
        </a>

        {!isPast && (
          <>
            <button 
              className="action-btn secondary"
              onClick={() => onSetReminder(contest)}
            >
              <FaBell />
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => onShare(contest)}
            >
              <FaShareAlt />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const end = moment(targetDate);
      const duration = moment.duration(end.diff(now));

      setTimeLeft({
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds()
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className="countdown-timer">
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

export default BookmarkCard;