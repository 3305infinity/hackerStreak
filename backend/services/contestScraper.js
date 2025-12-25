const { spawn } = require('child_process');
const path = require('path');

// Cache for contest data with change detection
const contestCache = new Map();
const CONTEST_CACHE_TTL = 10 * 60 * 1000; // 10 minutes for contests

/**
 * Run Python scraper script and get JSON result for contests
 * @param {string} scriptName - Name of the Python script (without .py)
 * @param {string} functionName - Function to call in the script
 * @param {Array} args - Arguments to pass to the function
 * @returns {Promise<object>} - Parsed JSON result
 */
async function runContestScraper(scriptName, functionName, args = []) {
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
        console.error(`Contest scraper failed: ${stderr}`);
        reject(new Error(`Contest scraper failed: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (parseError) {
        console.error(`Failed to parse contest scraper output: ${stdout}`);
        reject(new Error(`Parse error: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error(`Failed to start contest scraper process: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Check if contest data has changed
 * @param {string} platform - Platform name
 * @param {object} newData - New contest data
 * @returns {boolean} - True if data has changed
 */
function hasContestDataChanged(platform, newData) {
  const cacheKey = `contests:${platform}`;
  const cached = contestCache.get(cacheKey);

  if (!cached) {
    return true; // No cached data, so it's "changed"
  }

  // Simple change detection: compare lengths and first few contests
  const cachedUpcoming = cached.data.upcoming || [];
  const cachedPast = cached.data.past || [];
  const newUpcoming = newData.upcoming || [];
  const newPast = newData.past || [];

  if (cachedUpcoming.length !== newUpcoming.length || cachedPast.length !== newPast.length) {
    return true;
  }

  // Check if first contest names match (simple heuristic)
  if (newUpcoming.length > 0 && cachedUpcoming.length > 0) {
    if (cachedUpcoming[0].name !== newUpcoming[0].name) {
      return true;
    }
  }

  return false; // Data appears unchanged
}

/**
 * Scrape contests from a specific platform
 * @param {string} platform - Platform name (codeforces, leetcode, codechef, atcoder)
 * @returns {Promise<object>} - Contest data with change detection
 */
async function scrapeContests(platform) {
  try {
    const cacheKey = `contests:${platform}`;
    const cached = contestCache.get(cacheKey);

    // Check if we have recent cached data
    if (cached && (Date.now() - cached.timestamp < CONTEST_CACHE_TTL)) {
      return {
        ...cached.data,
        fromCache: true,
        lastUpdated: cached.timestamp
      };
    }

    console.log(`Scraping contests for ${platform}...`);

    const result = await runContestScraper(platform, `get_${platform}_contests`);

    if (!result) {
      throw new Error(`Failed to scrape ${platform} contests`);
    }

    // Check if data has actually changed
    const hasChanged = hasContestDataChanged(platform, result);

    // Update cache
    contestCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
      hasChanged
    });

    return {
      ...result,
      fromCache: false,
      hasChanged,
      lastUpdated: Date.now()
    };

  } catch (error) {
    console.error(`Error scraping contests for ${platform}:`, error.message);

    // Return cached data if available, even if expired
    const cacheKey = `contests:${platform}`;
    const cached = contestCache.get(cacheKey);

    if (cached) {
      console.log(`Returning expired cached data for ${platform} due to error`);
      return {
        ...cached.data,
        fromCache: true,
        error: error.message,
        lastUpdated: cached.timestamp
      };
    }

    // Return empty data with error
    return {
      upcoming: [],
      past: [],
      error: error.message,
      fromCache: false,
      hasChanged: false,
      lastUpdated: Date.now()
    };
  }
}

/**
 * Scrape contests from all platforms
 * @returns {Promise<object>} - Contest data from all platforms
 */
async function scrapeAllContests() {
  const platforms = ['codeforces', 'leetcode', 'codechef', 'atcoder'];
  const results = {};

  console.log('Starting contest scraping for all platforms...');

  for (const platform of platforms) {
    try {
      results[platform] = await scrapeContests(platform);
    } catch (error) {
      console.error(`Failed to scrape ${platform}:`, error.message);
      results[platform] = {
        upcoming: [],
        past: [],
        error: error.message,
        fromCache: false,
        hasChanged: false,
        lastUpdated: Date.now()
      };
    }
  }

  // Check which platforms have new data
  const changedPlatforms = platforms.filter(platform =>
    results[platform].hasChanged && !results[platform].error
  );

  console.log(`Contest scraping completed. Platforms with changes: ${changedPlatforms.join(', ')}`);

  return {
    results,
    changedPlatforms,
    timestamp: Date.now()
  };
}

/**
 * Get cached contest data without scraping
 * @param {string} platform - Platform name
 * @returns {object|null} - Cached contest data or null
 */
function getCachedContests(platform) {
  const cacheKey = `contests:${platform}`;
  const cached = contestCache.get(cacheKey);

  if (cached) {
    return {
      ...cached.data,
      fromCache: true,
      lastUpdated: cached.timestamp
    };
  }

  return null;
}

/**
 * Clear contest cache for a platform
 * @param {string} platform - Platform name (optional, clears all if not specified)
 */
function clearContestCache(platform = null) {
  if (platform) {
    const cacheKey = `contests:${platform}`;
    contestCache.delete(cacheKey);
    console.log(`Cleared contest cache for ${platform}`);
  } else {
    contestCache.clear();
    console.log('Cleared all contest caches');
  }
}

/**
 * Get cache statistics
 * @returns {object} - Cache statistics
 */
function getCacheStats() {
  const stats = {
    totalEntries: contestCache.size,
    platforms: []
  };

  for (const [key, value] of contestCache.entries()) {
    const platform = key.replace('contests:', '');
    stats.platforms.push({
      platform,
      lastUpdated: value.timestamp,
      age: Date.now() - value.timestamp,
      upcomingCount: value.data.upcoming?.length || 0,
      pastCount: value.data.past?.length || 0
    });
  }

  return stats;
}

module.exports = {
  scrapeContests,
  scrapeAllContests,
  getCachedContests,
  clearContestCache,
  getCacheStats
};
