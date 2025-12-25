const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5002';

/**
 * Call ML service for topic classification
 * @param {string} endpoint - ML service endpoint
 * @param {object} data - Input data
 * @returns {Promise<object>} - ML service result
 */
async function callMLService(endpoint, data = {}) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/${endpoint}`, data, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`ML service call failed for ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Classify problem topic using ML service
 * @param {object} problemData - Problem data (title, description, tags, etc.)
 * @returns {Promise<string>} - Predicted topic
 */
async function classifyProblemTopic(problemData) {
  try {
    const result = await callMLService('classify_topic', problemData);
    return result.success && result.topic ? result.topic : 'Misc';
  } catch (error) {
    console.error('Topic classification error:', error);
    return 'Misc';
  }
}

/**
 * Batch classify multiple problems
 * @param {Array} problems - Array of problem data
 * @returns {Promise<Array>} - Array of predicted topics
 */
async function batchClassifyTopics(problems) {
  const results = [];

  for (const problem of problems) {
    const topic = await classifyProblemTopic(problem);
    results.push(topic);
  }

  return results;
}

/**
 * Get topic confidence scores
 * @param {object} problemData - Problem data
 * @returns {Promise<object>} - Topic with confidence scores
 */
async function getTopicWithConfidence(problemData) {
  try {
    const result = await callMLService('classify_topic_confidence', problemData);
    if (result.success) {
      return result;
    }
  } catch (error) {
    console.error('Topic confidence classification error:', error);
  }

  return { topic: 'Misc', confidence: 0, scores: {} };
}

/**
 * Rule-based fallback classification for common patterns
 * @param {object} problemData - Problem data
 * @returns {string} - Predicted topic
 */
function ruleBasedClassification(problemData) {
  const title = (problemData.title || '').toLowerCase();
  const description = (problemData.description || '').toLowerCase();
  const tags = (problemData.tags || []).map(t => t.toLowerCase());

  // DP patterns
  if (title.includes('dp') || title.includes('dynamic') ||
      description.includes('dp') || description.includes('dynamic programming') ||
      tags.includes('dp') || tags.includes('dynamic-programming')) {
    return 'DP';
  }

  // Graph patterns
  if (title.includes('graph') || title.includes('tree') || title.includes('dfs') || title.includes('bfs') ||
      description.includes('graph') || description.includes('tree') || description.includes('dfs') || description.includes('bfs') ||
      tags.some(t => ['graphs', 'trees', 'dfs', 'bfs', 'shortest-path'].includes(t))) {
    return 'Graphs';
  }

  // Greedy patterns
  if (title.includes('greedy') || description.includes('greedy') ||
      tags.includes('greedy')) {
    return 'Greedy';
  }

  // Math patterns
  if (title.includes('math') || title.includes('number') || title.includes('prime') ||
      description.includes('math') || description.includes('number theory') ||
      tags.some(t => ['math', 'number-theory', 'combinatorics', 'geometry'].includes(t))) {
    return 'Math';
  }

  // String patterns
  if (title.includes('string') || title.includes('text') || title.includes('palindrome') ||
      description.includes('string') || description.includes('text') ||
      tags.some(t => ['strings', 'string-algorithms'].includes(t))) {
    return 'Strings';
  }

  // Data Structures patterns
  if (title.includes('stack') || title.includes('queue') || title.includes('heap') ||
      description.includes('stack') || description.includes('queue') || description.includes('heap') ||
      tags.some(t => ['data-structures', 'stacks', 'queues', 'heaps'].includes(t))) {
    return 'DataStructures';
  }

  // Binary Search patterns
  if (title.includes('binary search') || description.includes('binary search') ||
      tags.includes('binary-search') || tags.includes('two-pointers')) {
    return 'BinarySearch';
  }

  return 'Misc';
}

/**
 * Hybrid classification combining ML and rule-based approaches
 * @param {object} problemData - Problem data
 * @returns {Promise<string>} - Predicted topic
 */
async function hybridClassifyTopic(problemData) {
  try {
    // First try ML classification
    const mlTopic = await classifyProblemTopic(problemData);

    // If ML is confident (not Misc), use it
    if (mlTopic !== 'Misc') {
      return mlTopic;
    }

    // Otherwise, use rule-based classification
    return ruleBasedClassification(problemData);

  } catch (error) {
    console.error('Hybrid classification error:', error);
    // Fallback to rule-based
    return ruleBasedClassification(problemData);
  }
}

module.exports = {
  classifyProblemTopic,
  batchClassifyTopics,
  getTopicWithConfidence,
  ruleBasedClassification,
  hybridClassifyTopic
};
