import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaPlus, FaTrash, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './AddPlatform.css';

const AddPlatform = () => {
  const [platforms, setPlatforms] = useState([]);
  const [formData, setFormData] = useState({
    platformName: 'Codeforces',
    handle: ''
  });
  const [editId, setEditId] = useState(null);
  const [editHandle, setEditHandle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const supportedPlatforms = [
    'Codeforces',
    'LeetCode',
    'CodeChef',
    'HackerRank',
    'AtCoder',
    'HackerEarth',
    'GeeksForGeeks',
    'CodingNinjas',
    'CodeAcademy'
  ];

  const platformIcons = {
    'Codeforces': '🟣',
    'LeetCode': '🟠',
    'CodeChef': '🟤',
    'HackerRank': '🟢',
    'AtCoder': '🔵',
    'HackerEarth': '🟡',
    'GeeksForGeeks': '🟢',
    'CodingNinjas': '🔴',
    'CodeAcademy': '🔵'
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
  };
  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/platform', getAuthConfig());
      setPlatforms(response.data.platforms || response.data);
      setLoading(false);
    } catch (err) {
      handleApiError(err, 'Failed to fetch platforms');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPlatform = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/platform', formData, getAuthConfig());
      setSuccess(`${formData.platformName} handle added successfully!`);
      setFormData({ ...formData, handle: '' });
      fetchPlatforms();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleApiError(err, 'Failed to add platform');
      setLoading(false);
    }
  };

  const handleDeletePlatform = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/platform/${id}`, getAuthConfig());
      setPlatforms(platforms.filter(platform => platform._id !== id));
      setSuccess('Platform removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleApiError(err, 'Failed to delete platform');
    }
  };

  const handleEditClick = (platform) => {
    setEditId(platform._id);
    setEditHandle(platform.handle);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditHandle('');
  };

  const handleUpdatePlatform = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/platform/${id}`,
        { handle: editHandle },
        getAuthConfig()
      );
      
      setPlatforms(
        platforms.map(platform =>
          platform._id === id ? res.data.platform : platform
        )
      );
      
      setEditId(null);
      setEditHandle('');
      setSuccess('Platform handle updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      handleApiError(err, 'Failed to update platform');
    }
  };

  const handleApiError = (err, defaultMessage) => {
    if (err.response) {
      if (err.response.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
      } else {
        setError(err.response.data?.error || defaultMessage);
      }
    } else {
      setError(defaultMessage);
    }
    setTimeout(() => setError(null), 3000);
  };

  return (
    <div className="add-platform-container">
      <Navbar />
      
      <div className="platform-content">
        <div className="platform-header">
          <h1>Manage Your Coding Platforms</h1>
          <p>Add your handles from various coding platforms to track your progress</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <FaTimes className="alert-icon" />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FaCheck className="alert-icon" />
            {success}
          </div>
        )}

        <div className="platform-section">
          <div className="platform-form-container">
            <h2>Add New Platform</h2>
            <form onSubmit={handleAddPlatform} className="platform-form">
              <div className="form-group">
                <label htmlFor="platformName">Platform</label>
                <select
                  id="platformName"
                  name="platformName"
                  value={formData.platformName}
                  onChange={handleInputChange}
                  required
                >
                  {supportedPlatforms.map(platform => (
                    <option key={platform} value={platform}>
                      {platformIcons[platform]} {platform}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="handle">Handle / Username</label>
                <input
                  type="text"
                  id="handle"
                  name="handle"
                  value={formData.handle}
                  onChange={handleInputChange}
                  placeholder="Your username on this platform"
                  required
                />
              </div>
              
              <button type="submit" className="btn-add-platform" disabled={loading}>
                <FaPlus /> Add Platform
              </button>
            </form>
          </div>

          <div className="platforms-list-container">
            <h2>Your Platforms</h2>
            {loading ? (
              <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
                <p>Loading your platforms...</p>
              </div>
            ) : platforms.length === 0 ? (
              <div className="empty-platforms">
                <div className="empty-icon">📋</div>
                <h3>No platforms added yet</h3>
                <p>Add your first platform handle to get started</p>
              </div>
            ) : (
              <div className="platforms-list">
                {platforms.map(platform => (
                  <div key={platform._id} className="platform-card">
                    <div className="platform-info">
                      <div className="platform-icon">{platformIcons[platform.platformName]}</div>
                      <div className="platform-details">
                        <h3>{platform.platformName}</h3>
                        {editId === platform._id ? (
                          <div className="edit-handle-form">
                            <input
                              type="text"
                              value={editHandle}
                              onChange={(e) => setEditHandle(e.target.value)}
                              className="edit-handle-input"
                            />
                            <div className="edit-actions">
                              <button 
                                onClick={() => handleUpdatePlatform(platform._id)}
                                className="btn-save"
                              >
                                <FaCheck />
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="btn-cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="platform-handle">{platform.handle}</p>
                        )}
                      </div>
                    </div>
                    {editId !== platform._id && (
                      <div className="platform-actions">
                        <button 
                          onClick={() => handleEditClick(platform)}
                          className="btn-edit"
                          title="Edit Handle"
                        >
                          <FaPen />
                        </button>
                        <button 
                          onClick={() => handleDeletePlatform(platform._id)}
                          className="btn-delete"
                          title="Delete Platform"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlatform;