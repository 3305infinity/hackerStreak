// // import React from 'react';
// // import moment from 'moment';
// // import { FaExternalLinkAlt, FaClock, FaCalendarAlt } from 'react-icons/fa';

// // const platformColors = {
// //   Codeforces: 'bg-red-100 text-red-800',
// //   LeetCode: 'bg-yellow-100 text-yellow-800',
// //   CodeChef: 'bg-purple-100 text-purple-800',
// //   AtCoder: 'bg-green-100 text-green-800',
// //   default: 'bg-gray-100 text-gray-800'
// // };

// // const UpcomingContestCard = ({ contest }) => {
// //   const { name,/ platform, url, startTime, duration } = contest;
// //   const formattedDate = moment(startTime).format('MMMM Do YYYY, h:mm A');
// //   const timeLeft = moment(startTime).fromNow();
// //   const badgeClass = platformColors[platform] || platformColors.default;

// //   return (
// //     <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
// //       <div className="p-5">
// //         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
// //           {platform}
// //         </span>
        
// //         <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2" title={name}>
// //           {name}
// //         </h3>
        
// //         <div className="mt-3 flex items-center text-sm text-gray-500">
// //           <FaCalendarAlt className="flex-shrink-0 mr-2" />
// //           <span>{formattedDate}</span>
// //         </div>/
        
// //         <div className="mt-1 flex items-center text-sm text-gray-500">
// //           <FaClock className="flex-shrink-0 mr-2" />
// //           <span>Duration: {duration}</span>
// //         </div>
        
// //         <div className="mt-4">
// //           <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
// //             Starts {timeLeft}
// //           </span>
// //         </div>
        
// //         <div className="mt-4">
// //           <a
// //             href={url}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
// //           >
// //             Register Now
// //             <FaExternalLinkAlt className="ml-1" />
// //           </a>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UpcomingContestCard;


// import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import { FaExternalLinkAlt, FaClock, FaCalendarAlt, FaBell, FaRegBell, FaBookmark, FaRegBookmark } from 'react-icons/fa';
// import './ContestCard.css';
// const axios = require("axios");
// const platformColors = {
//   Codeforces: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
//   LeetCode: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
//   CodeChef: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
//   AtCoder: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
//   default: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
// };

// const CountdownTimer = ({ targetDate }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = moment();
//       const end = moment(targetDate);
//       const duration = moment.duration(end.diff(now));

//       setTimeLeft({
//         days: duration.days(),
//         hours: duration.hours(),
//         minutes: duration.minutes(),
//         seconds: duration.seconds()
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   return (
//     <div className="flex space-x-1 text-xs">
//       {timeLeft.days > 0 && (
//         <span className="bg-dark-200 text-light px-2 py-1 rounded">
//           {timeLeft.days}d
//         </span>
//       )}
//       <span className="bg-dark-200 text-light px-2 py-1 rounded">
//         {timeLeft.hours}h
//       </span>
//       <span className="bg-dark-200 text-light px-2 py-1 rounded">
//         {timeLeft.minutes}m
//       </span>
//       <span className="bg-dark-200 text-light px-2 py-1 rounded">
//         {timeLeft.seconds}s
//       </span>
//     </div>
//   );
// };

// const ContestCard = ({ contest }) => {
//   const { name, platform, url, startTime, duration } = contest;
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isReminderSet, setIsReminderSet] = useState(false);
//   const [showReminderForm, setShowReminderForm] = useState(false);
//   const [email, setEmail] = useState('');
//   const [reminderTime, setReminderTime] = useState('60');
//   const [isSending, setIsSending] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const badgeStyle = platformColors[platform] || platformColors.default;
//   const formattedDate = moment(startTime).format('MMMM Do YYYY, h:mm A');
//   const durationHours = Math.floor(moment.duration(duration).asHours());
//   const durationMinutes = moment.duration(duration).minutes();

// //   const sendReminder = async () => {
// //     setIsSending(true);
// //     try {
// //       await axios.post('http://localhost:5000/api/send-reminder', {
// //         email,
// //         contestName: contest.name,
// //         platform: contest.platform,
// //         startTime: contest.startTime,
// //         contestUrl: contest.url,
// //       });
// //       setIsSuccess(true);
// //       setTimeout(() => setIsSuccess(false), 3000);
// //     } catch (error) {
// //       alert('Failed to send reminder. Check console for details.');
// //       console.error(error);
// //     } finally {
// //       setIsSending(false);
// //     }
// //   };
    
//     const handleSetReminder = async(e) => {
//     e.preventDefault();
//     console.log(`Reminder set for ${email} ${reminderTime} minutes before contest`);
//     setShowReminderForm(false);
//     try {
//         const response = await axios.post('http://localhost:5000/api/send-reminder', {
//           email,
//           contestName: name,
//           platform,
//           startTime,
//           contestUrl: url,
//           reminderTime: parseInt(reminderTime)
//         });
//         if (response.data.success) {
//           setIsReminderSet(true);
//           setShowReminderForm(false);
//         }
//       } 
//       catch (error) {
//         console.error('Error setting reminder:', error);
//         alert('Failed to set reminder. Please try again.');
//         setIsReminderSet(false);
//       } finally {
//         setIsReminderSet(false);
//       }
//   };

//   return (
//     <div className={`contest-card ${badgeStyle.border} relative`}>
//       {/* Platform Badge */}
//       <div className={`platform-badge ${badgeStyle.bg} ${badgeStyle.text}`}>
//         {platform}
//       </div>

//       {/* Bookmark Button */}
//       <button 
//         className="bookmark-btn absolute top-4 right-4"
//         onClick={() => setIsBookmarked(!isBookmarked)}
//       >
//         {isBookmarked ? <FaBookmark className="text-accent" /> : <FaRegBookmark />}
//       </button>

//       {/* Contest Info */}
//       <h3 className="contest-title">{name}</h3>
      
//       <div className="contest-detail">
//         <FaCalendarAlt className="icon" />
//         <span>{formattedDate}</span>
//       </div>
      
//       <div className="contest-detail">
//         <FaClock className="icon" />
//         <span>Duration: {durationHours}h {durationMinutes > 0 ? `${durationMinutes}m` : ''}</span>
//       </div>

//       {/* Countdown Timer */}
//       <div className="countdown-container">
//         <CountdownTimer targetDate={startTime} />
//       </div>

//       {/* Action Buttons */}
//       <div className="action-buttons">
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="register-btn"
//         >
//           Register <FaExternalLinkAlt className="ml-1" />
//         </a>

//         <button 
//           className={`reminder-btn ${isReminderSet ? 'reminder-set' : ''}`}
//           onClick={() => !isReminderSet && setShowReminderForm(!showReminderForm)}
//         >
//           {isReminderSet ? <FaBell className="text-accent" /> : <FaRegBell />}
//           <span>{isReminderSet ? 'Reminder Set' : 'Set Reminder'}</span>
//         </button>
//       </div>

//       {/* Reminder Form */}
//       {showReminderForm && (
//         <div className="reminder-form">
//           <h4>Get Email Reminder</h4>
//           <form onSubmit={handleSetReminder}>
//             <input
//               type="email"
//               placeholder="Your email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <select 
//               value={reminderTime} 
//               onChange={(e) => setReminderTime(e.target.value)}
//             >
//               <option value="30">30 minutes before</option>
//               <option value="60">1 hour before</option>
//               <option value="1440">1 day before</option>
//             </select>
//             <button type="submit" className="submit-btn">
//               Set Reminder
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContestCard;




import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { 
  FaExternalLinkAlt, 
  FaClock, 
  FaCalendarAlt, 
  FaBell, 
  FaRegBell, 
  FaBookmark, 
  FaRegBookmark,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import './ContestCard.css';

const platformColors = {
  Codeforces: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  LeetCode: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  CodeChef: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  AtCoder: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  default: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
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
    <div className="flex space-x-1 text-xs">
      {timeLeft.days > 0 && (
        <span className="bg-dark-200 text-light px-2 py-1 rounded">
          {timeLeft.days}d
        </span>
      )}
      <span className="bg-dark-200 text-light px-2 py-1 rounded">
        {timeLeft.hours}h
      </span>
      <span className="bg-dark-200 text-light px-2 py-1 rounded">
        {timeLeft.minutes}m
      </span>
      <span className="bg-dark-200 text-light px-2 py-1 rounded">
        {timeLeft.seconds}s
      </span>
    </div>
  );
};

const ContestCard = ({ contest, isBookmarked, onBookmarkToggle })=> {
  const { name, platform, url, startTime, duration } = contest;
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [email, setEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('60');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const badgeStyle = platformColors[platform] || platformColors.default;
  const formattedDate = moment(startTime).format('MMMM Do YYYY, h:mm A');
  const durationHours = Math.floor(moment.duration(duration).asHours());
  const durationMinutes = moment.duration(duration).minutes();
    
  const handleSetReminder = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      
      const response = await axios.post('http://localhost:5000/api/send-reminder', {
        email,
        contestName: name,
        platform,
        startTime,
        contestUrl: url,
        reminderTime: parseInt(reminderTime)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setIsReminderSet(true);
        setShowReminderForm(false);
        setEmail(''); // Clear email after successful reminder
      } else {
        setError(response.data.message || 'Failed to set reminder');
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      setError(error.response?.data?.error || 'Failed to set reminder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleBookmarkToggle = () => {
    onBookmarkToggle(contest);
  };


  return (
    <div className={`contest-card ${badgeStyle.border} relative`}>
      {/* Platform Badge */}{platform}
      <div className={`platform-badge ${badgeStyle.bg} ${badgeStyle.text}`}>
        {platform}
      </div>   
     <button 
        className="bookmark-btn"
        onClick={() => onBookmarkToggle(contest)}
      >
        {isBookmarked ? <FaBookmark className="text-accent" /> : <FaRegBookmark />}
      </button>
     
      {/* Contest Info */}
      <h3 className="contest-title">{name}</h3>
      
      <div className="contest-detail">
        <FaCalendarAlt className="icon" />
        <span>{formattedDate}</span>
      </div>
      
      <div className="contest-detail">
        <FaClock className="icon" />
        <span>Duration: {durationHours}h {durationMinutes > 0 ? `${durationMinutes}m` : ''}</span>
      </div>

      {/* Countdown Timer */}
      <div className="countdown-container">
        <CountdownTimer targetDate={startTime} />
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="register-btn"
          aria-label={`Register for ${name} on ${platform}`}
        >
          Register <FaExternalLinkAlt className="ml-1" />
        </a>

        <button 
          className={`reminder-btn ${isReminderSet ? 'reminder-set' : ''}`}
          onClick={() => !isReminderSet && setShowReminderForm(!showReminderForm)}
          disabled={isLoading}
          aria-label={isReminderSet ? 'Reminder already set' : 'Set reminder'}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : isReminderSet ? (
            <FaBell className="text-accent" />
          ) : (
            <FaRegBell />
          )}
          <span>{isLoading ? 'Processing...' : isReminderSet ? 'Reminder Set' : 'Set Reminder'}</span>
        </button>
      </div>

      {/* Reminder Form */}
      {showReminderForm && (
    <div className="reminder-form">
      <div className="reminder-form-header">
        <h4>Get Email Reminder</h4>
        <button 
          onClick={() => setShowReminderForm(false)}
          className="close-btn"
          aria-label="Close reminder form"
        >
          <FaTimes />
        </button>
      </div>
      {error && <div className="reminder-error">{error}</div>}
      <form onSubmit={handleSetReminder}>
        <input
          type="email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="email-input"
        />
        <select 
          value={reminderTime} 
          onChange={(e) => setReminderTime(e.target.value)}
          className="time-select"
        >
          <option value="30">30 minutes before</option>
          <option value="60">1 hour before</option>
          <option value="1440">1 day before</option>
        </select>
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : 'Set Reminder'}
          </button>
        </div>
      </form>
    </div>
  )}
    </div>
  );
};

export default ContestCard;