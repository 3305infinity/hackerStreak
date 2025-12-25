import React, { useEffect, useState } from 'react';
import ContestCard from './UpcomingContestCard';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  
   const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "we.grind();";
    const typingSpeed = 100; // ms per character
    const cursorBlinkSpeed = 500; // ms
  
    // Typing animation for "we.grind()"
    useEffect(() => {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setTypedText(fullText.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, typingSpeed);
  
      return () => clearInterval(typingInterval);
    }, []);
  
    // Cursor blink effect
    useEffect(() => {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, cursorBlinkSpeed);
  
      return () => clearInterval(cursorInterval);
    }, []);
  

  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/contests");
        const data = await response.json();

        if (data.upcoming) {
          const upcomingArray = Object.values(data.upcoming)
            .filter(contest => contest !== null)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          
          setContests(upcomingArray);
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = activeFilter === 'all' 
    ? contests 
    : contests.filter(contest => contest.platform === activeFilter);

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-highlight">Code.</span> Compete. <span className="hero-highlight">Conquer.</span>
            </h1>
            <p className="hero-subtitle">
              Never miss another coding contest. Get personalized reminders and track your progress.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">
                <Link to='/allcontests' style={{textDecoration:'none',color:'white'}}>
                Explore Contests
                </Link>
              </button>
              <button className="btn-secondary">
                How It Works
              </button>
            </div>
          </div>
          {/* <div className="hero-illustration">
            <div className="code-snippet"></div>
          </div> */}
          <div className="hero-illustration">
  <div className="code-snippet">
    <div className="code-content">
      <span className="code-comment">// No cap, this code bussin' </span>
      <br/>
      <span className="code-keyword">const</span> <span className="code-function">hackStreak =(){'{'}
      </span>      <br/>
      &nbsp;&nbsp;<span className="code-keyword">let</span> <span className="code-var">clout</span> = <span className="code-string">"max"</span>;
      <br/>
      &nbsp;&nbsp;<span className="code-keyword">let</span> <span className="code-var">skills</span> = <span className="code-string">"∞"</span>;
      
      <br/>
      &nbsp;&nbsp;<span className="code-comment">// Sheesh, we built different </span>
      <br/>
          &nbsp;&nbsp;<span className="code-keyword">while</span>(<span className="code-var">you</span>.<span className="code-function">sleeping</span>()) {'{'}
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;{typedText}
          <span className={showCursor ? "code-cursor" : "code-cursor hidden"}>|</span>
          <br/>
          &nbsp;&nbsp;{'}'}
          <br/>
          <br/><span className="code-keyword">return</span> <span className="code-string">"W"</span>;
      <br/>
      {'}'}
      <br/>
      <br/>
      <span className="code-comment">// Bet you can't resist this flex 😎</span>
      <br/>
      <span className="code-keyword">if</span> (<span className="code-function">based</span>()) {'{'}
      <br/>
      &nbsp;&nbsp;<span className="code-function">hackStreak</span>();
      <br/>
      {'}'}
    </div>
  </div>
</div>
        </section>

        <section className="contests-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Upcoming Battles
            </h2>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Platforms
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'Codeforces' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Codeforces')}
              >
                Codeforces
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'LeetCode' ? 'active' : ''}`}
                onClick={() => setActiveFilter('LeetCode')}
              >
                LeetCode
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'CodeChef' ? 'active' : ''}`}
                onClick={() => setActiveFilter('CodeChef')}
              >
                CodeChef
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'AtCoder' ? 'active' : ''}`}
                onClick={() => setActiveFilter('AtCoder')}
              >
                AtCoder
              </button>
            </div>
          </div>

          {contests.length > 0 && (
            <div className="view-all-container">
              <button className="view-all-btn">
              <Link to='/allcontests' style={{textDecoration:'none',color:'white'}}>
                  View All Upcoming Contests →
                </Link>
              </button>
            </div>
          )
          }
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading contests...</p>
            </div>
          ) : filteredContests.length > 0 ? (
            <div className="contest-grid">
              {filteredContests.slice(0, 2).map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No contests available</h3>
              <p>Check back later for upcoming coding challenges</p>
            </div>
          )}

          {/* {contests.length > 0 && (
            <div className="view-all-container">
              <button className="view-all-btn">
              <Link to='/allcontests' style={{textDecoration:'none',color:'white'}}>
                  View All Upcoming Contests →
                </Link>
              </button>
            </div>
          )
          } */}
        </section>

<section className="features-section">
  <div className="container">
    <h2 className="section-titles">Why HackStreak Stands Out</h2>
    <p className="section-subtitle">More than just a contest tracker - your complete coding companion</p>
    
    <div className="features-grid">
      {/* <!-- Feature 1 --> */}
      <div className="feature-card">
        <div className="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
          </svg>
        </div>
        <h3>
          <Link to="/allcontests" style={{textDecoration:'none',color:'black'}}>
          Unified Contest Dashboard
          </Link>
          </h3>
        <p>Aggregates upcoming and past contests from Codeforces, LeetCode, CodeChef, AtCoder in one place with customizable filters and calendar integration</p>
      </div>
      
      {/* <!-- Feature 2 --> */}
      <div className="feature-card">
        <div className="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h3>
        <Link to="/solutions" style={{textDecoration:'none',color:'black'}}>
          Problem Bank with Solutions
          </Link>
          </h3>
        <p>Curated repository of contest problems with community-submitted solutions, editorials, and discussion threads for better learning</p>
      </div>
      
      {/* <!-- Feature 3 --> */}
      <div className="feature-card">
        <div className="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </div>
        <h3>
        <Link to="/profile" style={{textDecoration:'none',color:'black'}}>
          Smart Profile Analyzer
        </Link>
          </h3>
        <p>Automatically syncs and analyzes your profiles across platforms to identify strengths, weaknesses, and suggest improvement areas</p>
      </div>
      
      {/* <!-- Feature 4 --> */}
      <div className="feature-card">
        <div className="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
        <h3>
        <Link to="/solutions" style={{textDecoration:'none',color:'black'}}>
          Personalized Recommendations
        </Link>
        </h3>
        <p>AI-powered suggestions for contests to join and practice problems based on your skill level and goals</p>
      </div>
      
      <div className="feature-card">
        <div className="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
          </svg>
        </div>
        <h3>
          
        <Link to="/solutions" style={{textDecoration:'none',color:'black'}}>
          Virtual Contest Creator
        </Link>
          
          </h3>
        <p>Create custom contests from past problems to simulate real competition with friends or solo</p>
      </div>
      
      <div className="feature-card">
        <div className="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"/>
          </svg>
        </div>
        <h3>
        <Link to="/profile" style={{textDecoration:'none',color:'black'}}>
          Progress Tracking & Streaks
        </Link>
          </h3>
        <p>Visualize your improvement with detailed analytics and maintain motivation with streak tracking</p>
      </div>
    </div>
  </div>
</section>


      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;