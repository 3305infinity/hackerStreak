import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PerformancePredictor.css';

const PerformancePredictor = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    currentRating: '',
    targetRating: '',
    daysToTarget: '',
    dailyPracticeHours: '',
    contestFrequency: 'weekly'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/performance/predict', formData);
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to generate prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="performance-predictor">
      <div className="predictor-header">
        <h1>Performance Predictor</h1>
        <p>Predict your rating growth based on your practice schedule</p>
      </div>

      <div className="predictor-content">
        <div className="prediction-form">
          <h2>Enter Your Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentRating">Current Rating</label>
              <input
                type="number"
                id="currentRating"
                name="currentRating"
                value={formData.currentRating}
                onChange={handleInputChange}
                placeholder="e.g., 1500"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetRating">Target Rating</label>
              <input
                type="number"
                id="targetRating"
                name="targetRating"
                value={formData.targetRating}
                onChange={handleInputChange}
                placeholder="e.g., 1800"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="daysToTarget">Days to Reach Target</label>
              <input
                type="number"
                id="daysToTarget"
                name="daysToTarget"
                value={formData.daysToTarget}
                onChange={handleInputChange}
                placeholder="e.g., 90"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dailyPracticeHours">Daily Practice Hours</label>
              <input
                type="number"
                id="dailyPracticeHours"
                name="dailyPracticeHours"
                value={formData.dailyPracticeHours}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                step="0.5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contestFrequency">Contest Frequency</label>
              <select
                id="contestFrequency"
                name="contestFrequency"
                value={formData.contestFrequency}
                onChange={handleInputChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <button type="submit" className="predict-btn" disabled={loading}>
              {loading ? 'Generating Prediction...' : 'Predict Performance'}
            </button>
          </form>
        </div>

        <div className="prediction-results">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {prediction && (
            <div className="prediction-card">
              <h3>Performance Prediction</h3>
              <div className="prediction-details">
                <div className="prediction-item">
                  <span className="label">Estimated Final Rating:</span>
                  <span className="value">{prediction.finalRating}</span>
                </div>
                <div className="prediction-item">
                  <span className="label">Success Probability:</span>
                  <span className="value">{prediction.successProbability}%</span>
                </div>
                <div className="prediction-item">
                  <span className="label">Required Problems/Day:</span>
                  <span className="value">{prediction.problemsPerDay}</span>
                </div>
                <div className="prediction-item">
                  <span className="label">Recommended Focus Areas:</span>
                  <span className="value">{prediction.focusAreas.join(', ')}</span>
                </div>
              </div>

              <div className="prediction-timeline">
                <h4>Rating Growth Timeline</h4>
                <div className="timeline-chart">
                  {prediction.timeline.map((point, index) => (
                    <div key={index} className="timeline-point">
                      <span className="month">Month {point.month}</span>
                      <span className="rating">{point.rating}</span>
                      <div
                        className="progress-bar"
                        style={{ width: `${(point.rating / parseInt(formData.targetRating)) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformancePredictor;
