import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PerformanceAnalyzer.css';

function PerformanceAnalyzer() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState('linked');
  const [handles, setHandles] = useState({
    codeforces: '',
    leetcode: '',
    codechef: '',
    atcoder: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setMode(token ? 'linked' : 'handles');
  }, []);

  const handleInputChange = (platform, value) => {
    setHandles(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const analyzeMyAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/performance/analyze', {
        method: 'GET',
        headers: {
          'x-auth-token': token
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to analyze performance');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const analyzeByHandles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ handles })
      });
      const data = await response.json();
      if (response.ok) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to analyze performance');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const platformsForUI = (() => {
    if (!analysis) return [];
    if (Array.isArray(analysis.platforms)) return analysis.platforms;
    if (analysis.platformData && typeof analysis.platformData === 'object') {
      return Object.entries(analysis.platformData).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        rating: data.rating || 'N/A',
        contests: (() => {
          if (!Array.isArray(data.contestSubmissions) || data.contestSubmissions.length === 0) return 0;
          const summaries = data.contestSubmissions.filter(s => typeof s?.problemId === 'string' && s.problemId.endsWith('-summary'));
          if (summaries.length === 0) return 0;
          return new Set(summaries.map(s => s.contestId).filter(Boolean)).size;
        })(),
        problems: typeof data.solvedProblems === 'object' 
          ? data.solvedProblems.all || data.solvedProblems.solvedCount || 0
          : data.solvedProblems || 0,
        rank: typeof data.rank === 'object' ? 'N/A' : (data.rank || 'N/A'),
        profileUrl: data.profileUrl || null
      }));
    }
    return [];
  })();
  return (
    <div className="performance-analyzer-container">
      <div className="analyzer-header">
        <h1>Performance Analyzer</h1>
        <p>Analyze your competitive programming performance across platforms</p>
      </div>

      <div className="handles-input">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="analyze-btn"
            onClick={() => setMode('linked')}
            disabled={!isLoggedIn}
            style={{ opacity: isLoggedIn ? 1 : 0.6 }}
          >
            Analyze My Linked Accounts
          </button>
          <button
            className="analyze-btn"
            onClick={() => setMode('handles')}
          >
            Analyze By Handles
          </button>
          <button
            className="analyze-btn"
            onClick={() => navigate('/study-plan')}
          >
            Open Study Plan
          </button>
        </div>

        {mode === 'linked' && (
          <div style={{ marginTop: '14px' }}>
            <h2>Use Saved Handles</h2>
            <p style={{ marginTop: '6px', opacity: 0.85 }}>
              Uses the platform handles you already added in your profile.
            </p>
            <button
              className="analyze-btn"
              onClick={analyzeMyAccounts}
              disabled={loading || !isLoggedIn}
              style={{ marginTop: '10px', opacity: isLoggedIn ? 1 : 0.6 }}
            >
              {loading ? 'Analyzing...' : 'Analyze Now'}
            </button>
          </div>
        )}

        {mode === 'handles' && (
          <>
            <h2>Enter Handles</h2>
            <div className="handles-grid">
              <div className="handle-input">
                <label>Codeforces Handle:</label>
                <input
                  type="text"
                  value={handles.codeforces}
                  onChange={(e) => handleInputChange('codeforces', e.target.value)}
                  placeholder="e.g., tourist"
                />
              </div>
              <div className="handle-input">
                <label>LeetCode Handle:</label>
                <input
                  type="text"
                  value={handles.leetcode}
                  onChange={(e) => handleInputChange('leetcode', e.target.value)}
                  placeholder="e.g., leetcode_user"
                />
              </div>
              <div className="handle-input">
                <label>CodeChef Handle:</label>
                <input
                  type="text"
                  value={handles.codechef}
                  onChange={(e) => handleInputChange('codechef', e.target.value)}
                  placeholder="e.g., codechef_user"
                />
              </div>
              <div className="handle-input">
                <label>AtCoder Handle:</label>
                <input
                  type="text"
                  value={handles.atcoder}
                  onChange={(e) => handleInputChange('atcoder', e.target.value)}
                  placeholder="e.g., atcoder_user"
                />
              </div>
            </div>
            <button
              className="analyze-btn"
              onClick={analyzeByHandles}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Performance'}
            </button>
          </>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {analysis && (
        <>
          <div className="score-card">
            <div className="score-display">
              <div
                className="score-circle"
                style={{
                  background:
                    analysis.performanceScore >= 70
                      ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                      : analysis.performanceScore >= 40
                        ? 'linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)'
                        : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                }}
              >
                <div className="score-number">{analysis.performanceScore}</div>
                <div className="score-label">/ 100</div>
              </div>
              <div className="score-info">
                <h3>Overall Performance</h3>
                <p>{analysis.insights?.overallAssessment || 'Performance summary'}</p>
              </div>
            </div>
          </div>

          {platformsForUI && platformsForUI.length > 0 && (
            <div className="platform-data-section">
              <h2>Platform Overview</h2>
              <div className="platform-grid">
                {platformsForUI.map((platform, index) => (
                  <div key={index} className="platform-card">
                    <div className="platform-header">
                      <h3>{platform.name}</h3>
                      {platform.profileUrl && (
                        <a href={platform.profileUrl} target="_blank" rel="noreferrer">
                          View profile
                        </a>
                      )}
                    </div>
                    <div className="platform-stats">
                      <div className="stat-item">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{platform.rating ?? 'N/A'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">{platform.rank ?? 'N/A'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Solved</span>
                        <span className="stat-value">{platform.problems ?? 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Contests</span>
                        <span className="stat-value">{platform.contests ?? 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.aggregatedMetrics && (
            <div className="metrics-section">
              <h2>Aggregated Metrics</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>Total Solved</h3>
                  <div className="metric-value">{analysis.aggregatedMetrics.totalSolved}</div>
                </div>
                <div className="metric-card">
                  <h3>Acceptance Rate</h3>
                  <div className="metric-value">{analysis.aggregatedMetrics.acceptanceRate}%</div>
                </div>
                <div className="metric-card">
                  <h3>Avg Rating</h3>
                  <div className="metric-value">{analysis.aggregatedMetrics.averageRating}</div>
                </div>
                <div className="metric-card">
                  <h3>Platforms</h3>
                  <div className="metric-value">{analysis.aggregatedMetrics.platformsCount}</div>
                </div>
              </div>
            </div>
          )}

          {analysis.topicAnalysis && analysis.topicAnalysis.topics && (
            <div className="topic-analysis-section">
              <h2>Topic Performance Analysis</h2>
              <div className="topic-grid">
                {Object.entries(analysis.topicAnalysis.topics).map(([topic, stats]) => (
                  <div key={topic} className="topic-card">
                    <div className="topic-header">
                      <h4>{topic}</h4>
                      <div className="weakness-indicator">
                        <div
                          className="weakness-bar"
                          style={{
                            width: `${Math.min(stats.weaknessScore * 100, 100)}%`,
                            backgroundColor: stats.weaknessScore > 0.6 ? '#e74c3c' : stats.weaknessScore > 0.3 ? '#f39c12' : '#27ae60'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="topic-stats">
                      <div className="stat">
                        <span>Attempted:</span> {stats.attempted}
                      </div>
                      <div className="stat">
                        <span>Solved:</span> {stats.solved}
                      </div>
                      <div className="stat">
                        <span>Failure Rate:</span> {(stats.failureRate * 100).toFixed(1)}%
                      </div>
                      <div className="stat">
                        <span>Weakness Score:</span> {(stats.weaknessScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.insights && (
            <div className="insights-section">
              <h2>Insights & Recommendations</h2>
              <div className="insights-grid">
                <div className="insight-card strengths">
                  <h3>🎯 Strengths</h3>
                  <ul>
                    {(analysis.insights.strengths || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-card weaknesses">
                  <h3>⚠️ Weaknesses</h3>
                  <ul>
                    {(analysis.insights.weaknesses || []).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-card recommendations">
                  <h3>💡 Recommendations</h3>
                  <ul>
                    {(analysis.insights.recommendations || []).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PerformanceAnalyzer;
