import React, { createContext, useState, useEffect } from 'react';
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
      const exists = prev.some(c => c.id === contest.id);
      return exists 
        ? prev.filter(c => c.id !== contest.id)
        : [...prev, contest];
    });
  };
  return (
    <BookmarkContext.Provider value={{ bookmarkedContests, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};