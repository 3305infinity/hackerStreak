import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudyPlan.css';

const StudyPlan = () => {
  const navigate = useNavigate();
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [performanceSummary, setPerformanceSummary] = useState(null);

  useEffect(() => {
    fetchCurrentStudyPlan();
    fetchPerformanceSummary();
  }, []);

  const fetchCurrentStudyPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/study-plan/current', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.hasActivePlan) {
        setStudyPlan(response.data.studyPlan);
        setCurrentDay(response.data.studyPlan.progressTracking?.currentDay || 1);
      }
    } catch (err) {
      console.log('No existing study plan found');
    }
  };

  const fetchPerformanceSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/performance/summary', {
        headers: { 'x-auth-token': token }
      });

      setPerformanceSummary(response.data.summary);
    } catch (err) {
      console.log('Performance summary not available');
    }
  };

  const generateStudyPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/study-plan/generate', {
        duration_days: 7
      }, {
        headers: { 'x-auth-token': token }
      });
      setStudyPlan(response.data.studyPlan);
      setCurrentDay(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (day, completedProblems, notes = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/study-plan/progress', {
        day,
        completedProblems,
        notes
      }, {
        headers: { 'x-auth-token': token }
      });

      // Update local state
      setStudyPlan(prev => ({
        ...prev,
        progressTracking: {
          ...prev.progressTracking,
          currentDay: Math.max(prev.progressTracking.currentDay, day),
          lastActivityDate: new Date()
        }
      }));
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const getTopicColor = (topic) => {
    const colors = {
      DP: '#FF6B6B',
      Graphs: '#4ECDC4',
      Greedy: '#45B7D1',
      Math: '#96CEB4',
      Strings: '#FFEAA7',
      DataStructures: '#DDA0DD',
      BinarySearch: '#98D8C8',
      Misc: '#F7DC6F'
    };
    return colors[topic] || '#BDC3C7';
  };

  const getFocusIcon = (focus) => {
    const icons = {
      study: '📚',
      revision: '🔄',
      mock_contest: '🏁'
    };
    return icons[focus] || '📝';
  };

  const getDayStatus = (day) => {
    if (day < currentDay) return 'completed';
    if (day === currentDay) return 'current';
    return 'upcoming';
  };

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="contests-section">
          <div className="study-plan-container">
            <div className="study-plan-header">
              <h1>🤖 AI Study Plan Generator</h1>
              <p>Get personalized study recommendations based on your contest performance</p>
              <div className="header-actions">
                <button
                  className="nav-btn analyzer-btn"
                  onClick={() => navigate('/performance-analyzer')}
                >
                  📊 View Performance Analyzer
                </button>
              </div>
            </div>

            {performanceSummary && (
              <div className="performance-summary">
                <div className="summary-card">
                  <div className="summary-header">
                    <h3>🎯 Your Performance Overview</h3>
                    <span className="performance-score">
                      Score: {performanceSummary.performanceScore}/100
                    </span>
                  </div>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="stat-label">Problems Solved</span>
                      <span className="stat-value">{performanceSummary.aggregatedMetrics.totalSolved}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Acceptance Rate</span>
                      <span className="stat-value">{performanceSummary.aggregatedMetrics.acceptanceRate}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Top Weak Areas</span>
                      <span className="stat-value">
                        {performanceSummary.topWeakTopics.map(t => t.topic).join(', ')}
                      </span>
                    </div>
                  </div>
                  <p className="assessment">{performanceSummary.overallAssessment}</p>
                </div>
              </div>
            )}

            {!studyPlan && (
              <div className="generate-section">
                <div className="generate-card">
                  <h3>Generate Your Study Plan</h3>
                  <p>Our AI analyzes your contest submissions and creates a customized study plan to improve your weak areas.</p>
                  <button
                    className="generate-btn"
                    onClick={generateStudyPlan}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Study Plan'}
                  </button>
                  {error && <p className="error-message">{error}</p>}
                </div>
              </div>
            )}

            {studyPlan && (
              <div className="study-plan-content">
                <div className="plan-header">
                  <div className="plan-info">
                    <h2>Your Personalized Study Plan</h2>
                    <div className="plan-meta">
                      <span>Duration: {studyPlan.totalDays} days</span>
                      <span>Started: {new Date(studyPlan.startDate).toLocaleDateString()}</span>
                      <span>Current Day: {currentDay}</span>
                    </div>
                  </div>
                  <button className="regenerate-btn" onClick={generateStudyPlan} disabled={loading}>
                    {loading ? 'Regenerating...' : 'Regenerate Plan'}
                  </button>
                </div>

                {studyPlan.llmExplanation && (
                  <div className="plan-explanation">
                    <h3>📋 Plan Overview</h3>
                    <p>{studyPlan.llmExplanation.summary}</p>
                    <p><strong>Strategy:</strong> {studyPlan.llmExplanation.overallStrategy}</p>
                  </div>
                )}

                <div className="daily-plans-grid">
                  {studyPlan.dailyPlans.map((dailyPlan) => (
                    <div
                      key={dailyPlan.day}
                      className={`daily-plan-card ${getDayStatus(dailyPlan.day)}`}
                    >
                      <div className="day-header">
                        <div className="day-info">
                          <h3>Day {dailyPlan.day}</h3>
                          <span className="focus-badge">
                            {getFocusIcon(dailyPlan.focus)} {dailyPlan.focus.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="day-meta">
                          <span>{dailyPlan.estimatedDuration} min</span>
                          <span>{dailyPlan.totalQuestions} problems</span>
                        </div>
                      </div>

                      <div className="topics-section">
                        {dailyPlan.topics.map((topic, index) => (
                          <div key={index} className="topic-item">
                            <div
                              className="topic-badge"
                              style={{ backgroundColor: getTopicColor(topic.topic) }}
                            >
                              {topic.topic}
                            </div>
                            <span className="question-count">{topic.questionCount} questions</span>
                          </div>
                        ))}
                      </div>

                      {dailyPlan.day === currentDay && (
                        <div className="day-actions">
                          <button
                            className="complete-day-btn"
                            onClick={() => updateProgress(dailyPlan.day)}
                          >
                            Mark Day Complete
                          </button>
                        </div>
                      )}

                      {dailyPlan.day < currentDay && (
                        <div className="completion-indicator">
                          ✅ Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {studyPlan.generationParams?.focusAreas && (
                  <div className="focus-areas">
                    <h3>🎯 Focus Areas</h3>
                    <div className="focus-areas-grid">
                      {studyPlan.generationParams.focusAreas.map((area, index) => (
                        <div key={index} className="focus-area-card">
                          <div
                            className="focus-topic"
                            style={{ backgroundColor: getTopicColor(area.topic) }}
                          >
                            {area.topic}
                          </div>
                          <div className="focus-details">
                            <div className="weakness-score">
                              Weakness: {(area.weaknessScore * 100).toFixed(1)}%
                            </div>
                            <div className="allocated-questions">
                              {area.allocatedQuestions} questions allocated
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HackStreak. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudyPlan;
