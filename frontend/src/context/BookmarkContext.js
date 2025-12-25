import React, { createContext, useState, useEffect, useContext } from 'react';

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedContests');
    if (saved) {
      try {
        setBookmarkedContests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
        localStorage.removeItem('bookmarkedContests');
      }
    }
    setInitialized(true);
  }, []);

  // Save to localStorage when changes occur
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('bookmarkedContests', JSON.stringify(bookmarkedContests));
    }
  }, [bookmarkedContests, initialized]);

  const toggleBookmark = (contest) => {
    setBookmarkedContests(prev => {
      const exists = prev.some(c => (c.id || c.contestId) === (contest.id || contest.contestId));
      return exists
        ? prev.filter(c => (c.id || c.contestId) !== (contest.id || contest.contestId))
        : [...prev, contest];
    });
  };

  const removeBookmark = (contestId) => {
    setBookmarkedContests(prev => prev.filter(c => (c.id || c.contestId) !== contestId));
  };

  const clearAllBookmarks = () => {
    setBookmarkedContests([]);
  };

  const isBookmarked = (contestId) => {
    return bookmarkedContests.some(c => (c.id || c.contestId) === contestId);
  };

  const value = {
    bookmarks: bookmarkedContests,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    isBookmarked
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};
