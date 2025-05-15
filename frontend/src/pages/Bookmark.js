import React, { useContext } from 'react';
import { BookmarkContext } from '../context/BookmarkContext';
import BookmarkCard from '../components/BookmarkCard.js';
import moment from 'moment';
import './BookmarksPage.css';
import Navbar from '../components/Navbar.js';
const BookmarksPage = () => {
  const { bookmarkedContests, toggleBookmark } = useContext(BookmarkContext);
  // Classify contests
  const upcomingContests = bookmarkedContests.filter(contest => 
    moment(contest.startTime).isAfter(moment())
  ).sort((a, b) => moment(a.startTime) - moment(b.startTime));
  const pastContests = bookmarkedContests.filter(contest => 
    moment(contest.startTime).isBefore(moment())
  ).sort((a, b) => moment(b.startTime) - moment(a.startTime));
  const handleRemove = (contestId) => {
    toggleBookmark({ id: contestId });
  };
  const handleSetReminder = (contest) => {
    console.log('Set reminder for:', contest.name);
  };
  const handleShare = (contest) => {
    console.log('Sharing contest:', contest.name);
  };
  return (
    
    <>
    <Navbar/>
    <div className="bookmarks-page">
      <h1 className="page-title">Your Bookmarked Contests</h1>  
      {bookmarkedContests.length === 0 ? (
        <div className="empty-state">
          <p>No bookmarks yet. Bookmark contests to see them here.</p>
        </div>
      ) : (
        <>
          {upcomingContests.length > 0 && (
            <section className="bookmark-section">
              <h2 className="section-title">Upcoming Contests</h2>
              <div className="cards-grid">
                {upcomingContests.map(contest => (
                  <BookmarkCard
                    key={contest.id}
                    contest={contest}
                    onRemove={handleRemove}
                    onSetReminder={handleSetReminder}
                    onShare={handleShare}
                  />
                ))}
              </div>
            </section>
          )}

          {pastContests.length > 0 && (
            <section className="bookmark-section">
              <h2 className="section-title">Past Contests</h2>
              <div className="cards-grid">
                {pastContests.map(contest => (
                  <BookmarkCard
                    key={contest.id}
                    contest={contest}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
    </>
  );
};

export default BookmarksPage;