import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCode, FaYoutube, FaExternalLinkAlt, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../styles/Solutions.css';

function Solutions() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const mockProblems = [
    {
      id: 1,
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "Easy",
      topics: ["Array", "Hash Table"],
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      solutionUrl: "https://leetcode.com/problems/two-sum/solution/",
      videoUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
      acceptance: "47.8%",
      likes: 12500
    },
    {
      id: 2,
      title: "Add Two Numbers",
      platform: "LeetCode",
      difficulty: "Medium",
      topics: ["Linked List", "Math"],
      description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.",
      solutionUrl: "https://leetcode.com/problems/add-two-numbers/solution/",
      videoUrl: "https://www.youtube.com/watch?v=LBVsXSMOIk4",
      acceptance: "35.6%",
      likes: 8900
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      platform: "LeetCode",
      difficulty: "Medium",
      topics: ["String", "Sliding Window"],
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      solutionUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/",
      videoUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0",
      acceptance: "31.4%",
      likes: 15600
    },
    {
      id: 4,
      title: "Codeforces Round 800 (Div. 2)",
      platform: "Codeforces",
      difficulty: "Hard",
      topics: ["Dynamic Programming", "Greedy"],
      description: "Contest problems from Codeforces Round 800. Features challenging algorithmic problems.",
      solutionUrl: "https://codeforces.com/blog/entry/100000",
      videoUrl: "https://www.youtube.com/watch?v=example",
      acceptance: "15.2%",
      likes: 3200
    },
    {
      id: 5,
      title: "AtCoder Beginner Contest 200",
      platform: "AtCoder",
      difficulty: "Medium",
      topics: ["Implementation", "Math"],
      description: "Beginner-friendly contest with problems ranging from simple to moderately complex.",
      solutionUrl: "https://atcoder.jp/contests/abc200/editorial",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      acceptance: "42.1%",
      likes: 2100
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProblems(mockProblems);
      setFilteredProblems(mockProblems);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = problems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(problem => problem.platform.toLowerCase() === selectedPlatform.toLowerCase());
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // Filter by topic
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(problem => problem.topics.includes(selectedTopic));
    }

    setFilteredProblems(filtered);
  }, [searchTerm, selectedPlatform, selectedDifficulty, selectedTopic, problems]);

  const [platforms, setPlatforms] = useState(['all', 'LeetCode', 'Codeforces', 'AtCoder', 'CodeChef']);
  const [difficulties, setDifficulties] = useState(['all', 'Easy', 'Medium', 'Hard']);
  const [topics, setTopics] = useState(['all', 'Array', 'String', 'Linked List', 'Dynamic Programming', 'Greedy', 'Math', 'Implementation']);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/solutions/filters/options");
        if (response.ok) {
          const data = await response.json();
          setPlatforms(data.platforms || platforms);
          setDifficulties(data.difficulties || difficulties);
          setTopics(data.topics || topics);
        }
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} />);
    }
    return stars;
  };

  return (
    <div className="solutions-container">
      <main className="solutions-main">
        <div className="header-section">
          <h1 className="page-title">Problem Bank & Solutions</h1>
          <p className="page-subtitle">
            Access solutions, video explanations, and practice problems from various platforms
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search problems, topics, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Platform</label>
              <select
                className="filter-select"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Difficulty</label>
              <select
                className="filter-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Topic</label>
              <select
                className="filter-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="empty-state">
            <FaCode className="empty-icon" />
            <h3>No problems found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="problems-grid">
            {filteredProblems.map(problem => (
              <div key={problem.id} className="problem-card">
                <div className="problem-header">
                  <div className="problem-title-section">
                    <h3 className="problem-title">{problem.title}</h3>
                    <span className={`problem-platform ${problem.platform.toLowerCase()}`}>
                      {problem.platform}
                    </span>
                  </div>
                  <span className={`problem-difficulty ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                <p className="problem-description">{problem.description}</p>

                <div className="problem-topics">
                  {problem.topics.map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>

                <div className="problem-stats">
                  <span className="acceptance-rate">Acceptance: {problem.acceptance}</span>
                  <span className="likes">{problem.likes.toLocaleString()} likes</span>
                </div>

                <div className="problem-actions">
                  <a
                    href={problem.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn solution-btn"
                  >
                    <FaCode /> Solution
                  </a>
                  <a
                    href={problem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn video-btn"
                  >
                    <FaYoutube /> Video
                  </a>
                  <button className="action-btn bookmark-btn">
                    <FaStar /> Bookmark
                  </button>
                </div>
              </div>
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

export default Solutions;
