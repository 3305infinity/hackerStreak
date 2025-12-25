const { spawn } = require('child_process');
const path = require('path');

// Cache for scraper responses
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Run Python scraper script and get JSON result
 * @param {string} scriptName - Name of the Python script (without .py)
 * @param {string} functionName - Function to call in the script
 * @param {Array} args - Arguments to pass to the function
 * @returns {Promise<object>} - Parsed JSON result
 */
async function runPythonScraper(scriptName, functionName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../scraper', `${scriptName}.py`);
    const pythonProcess = spawn('python', [scriptPath, functionName, ...args], {
      cwd: path.join(__dirname, '../../scraper'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script failed: ${stderr}`);
        reject(new Error(`Scraper failed: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (parseError) {
        console.error(`Failed to parse scraper output: ${stdout}`);
        reject(new Error(`Parse error: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error(`Failed to start Python process: ${error.message}`);
      reject(error);
    });
  });
}

// Platform scrapers implementation using Python modules
async function scrapeCodeforces(username) {
  try {
    const cacheKey = `codeforces:${username}`;
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }

    const result = await runPythonScraper('codeforces', 'get_codeforces_user_stats', [username]);

    if (!result || !result.success) {
      throw new Error(result?.error || 'Failed to scrape Codeforces data');
    }

    // Transform to expected format
    const transformedResult = {
      username: result.handle,
      rating: result.rating || 0,
      maxRating: result.maxRating || 0,
      rank: result.rank || 'unrated',
      contestCount: 0, // Not available in current scraper
      solvedCount: result.solvedProblems || 0,
      solvedProblems: result.problemBreakdown || { easy: 0, medium: 0, hard: 0 },
      contestSubmissions: [], // Not available in current scraper
      profileUrl: result.profileUrl,
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, { data: transformedResult, timestamp: Date.now() });
    return transformedResult;

  } catch (error) {
    console.error(`Error scraping Codeforces for ${username}:`, error.message);
    return {
      username,
      rating: 0,
      maxRating: 0,
      rank: 'Error',
      contestCount: 0,
      solvedCount: 0,
      solvedProblems: { easy: 0, medium: 0, hard: 0 },
      contestSubmissions: [],
      error: error.message,
      profileUrl: `https://codeforces.com/profile/${username}`
    };
  }
}

async function scrapeLeetCode(username) {
  try {
    const cacheKey = `leetcode:${username}`;
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }

    const result = await runPythonScraper('leetcode', 'get_leetcode_user_stats', [username]);

    if (!result || !result.success) {
      throw new Error(result?.error || 'Failed to scrape LeetCode data');
    }

    // Transform to expected format
    const transformedResult = {
      username: result.handle,
      rating: result.rating || 0,
      rank: result.rank || 0,
      contestCount: 0, // Not available in current scraper
      solvedCount: result.solvedProblems || 0,
      solvedProblems: result.problemBreakdown || { easy: 0, medium: 0, hard: 0 },
      acceptanceRate: result.acceptanceRate || 0,
      contestSubmissions: [], // Not available in current scraper
      profileUrl: result.profileUrl,
      lastUpdated: result.lastUpdated || new Date().toISOString()
    };

    cache.set(cacheKey, { data: transformedResult, timestamp: Date.now() });
    return transformedResult;

  } catch (error) {
    console.error(`Error scraping LeetCode for ${username}:`, error.message);
    return {
      username,
      rating: 0,
      rank: 0,
      solvedCount: 0,
      solvedProblems: { easy: 0, medium: 0, hard: 0 },
      acceptanceRate: 0,
      contestSubmissions: [],
      error: error.message,
      profileUrl: `https://leetcode.com/${username}`
    };
  }
}

async function scrapeCodeChef(username) {
  try {
    const cacheKey = `codechef:${username}`;
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }

    const result = await runPythonScraper('codechef', 'get_codechef_user_stats', [username]);

    if (!result || !result.success) {
      throw new Error(result?.error || 'Failed to scrape CodeChef data');
    }

    // Transform to expected format
    const transformedResult = {
      username: result.handle,
      rating: result.rating || 0,
      rank: result.rank || 'Unrated',
      contestCount: 0, // Not available in current scraper
      solvedCount: result.solvedProblems || 0,
      contestSubmissions: [], // Not available in current scraper
      profileUrl: result.profileUrl,
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, { data: transformedResult, timestamp: Date.now() });
    return transformedResult;

  } catch (error) {
    console.error(`Error scraping CodeChef for ${username}:`, error.message);
    return {
      username,
      rating: 0,
      rank: 'Error',
      solvedCount: 0,
      contestSubmissions: [],
      error: error.message,
      profileUrl: `https://www.codechef.com/users/${username}`
    };
  }
}

async function scrapeAtCoder(username) {
  try {
    const cacheKey = `atcoder:${username}`;
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }

    const result = await runPythonScraper('atcoder', 'get_atcoder_user_stats', [username]);

    if (!result || !result.success) {
      throw new Error(result?.error || 'Failed to scrape AtCoder data');
    }

    // Transform to expected format
    const transformedResult = {
      username: result.handle,
      rating: result.rating || 0,
      maxRating: result.highestRating || 0,
      rank: result.rank || 'unrated',
      contestCount: result.competitionsParticipated || 0,
      solvedCount: result.solvedProblems || 0,
      solvedProblems: result.problemBreakdown || { easy: 0, medium: 0, hard: 0 },
      contestSubmissions: [], // Not available in current scraper
      profileUrl: result.profileUrl,
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, { data: transformedResult, timestamp: Date.now() });
    return transformedResult;

  } catch (error) {
    console.error(`Error scraping AtCoder for ${username}:`, error.message);
    return {
      username,
      rating: 0,
      maxRating: 0,
      rank: 'Error',
      contestCount: 0,
      solvedCount: 0,
      solvedProblems: { easy: 0, medium: 0, hard: 0 },
      contestSubmissions: [],
      error: error.message,
      profileUrl: `https://atcoder.jp/users/${username}`
    };
  }
}

const platformScrapers = {
  codeforces: scrapeCodeforces,
  leetcode: scrapeLeetCode,
  codechef: scrapeCodeChef
};

/**
 * Scrape data from a specific platform
 * @param {string} platform - Platform name (codeforces, leetcode, codechef)
 * @param {string} username - Username on the platform
 * @returns {Promise<object>} - User data from the platform
 */
async function scrapePlatform(platform, username) {
  const scraper = platformScrapers[platform.toLowerCase()];
  if (!scraper) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return await scraper(username);
}

/**
 * Update all platforms for a user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Array>} - Array of updated platform data
 */
async function updateAllPlatforms(userId) {
  return [];
}

// Export the platform scrapers and main function
module.exports = {
  scrapePlatform,
  scrapeCodeforces,
  scrapeLeetCode,
  scrapeCodeChef,
  scrapeAtCoder,
  updateAllPlatforms
};
