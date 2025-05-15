// // // // const axios = require('axios');
// // // // const cheerio = require('cheerio');

// // // // // Mock function for LeetCode
// // // // async function scrapeLeetCode(username) {
// // // //   try {
// // // //     // In a real implementation, you would fetch from LeetCode's API or scrape their site
// // // //     return {
// // // //       rating: Math.floor(Math.random() * 3000),
// // // //       rank: `Top ${Math.floor(Math.random() * 20) + 1}%`,
// // // //       solvedProblems: Math.floor(Math.random() * 1000),
// // // //       profileUrl: `https://leetcode.com/${username}`
// // // //     };
// // // //   } catch (err) {
// // // //     console.error('Error scraping LeetCode:', err);
// // // //     return null;
// // // //   }
// // // // }

// // // // // Mock function for Codeforces
// // // // async function scrapeCodeforces(username) {
// // // //   try {
// // // //     // Mock data - in real implementation, use Codeforces API
// // // //     return {
// // // //       rating: Math.floor(Math.random() * 3000),
// // // //       rank: `Candidate Master`,
// // // //       solvedProblems: Math.floor(Math.random() * 2000),
// // // //       profileUrl: `https://codeforces.com/profile/${username}`
// // // //     };
// // // //   } catch (err) {
// // // //     console.error('Error scraping Codeforces:', err);
// // // //     return null;
// // // //   }
// // // // }

// // // // // Add similar functions for other platforms...

// // // // module.exports = {
// // // //   scrapePlatform: async (platformName, username) => {
// // // //     switch (platformName.toLowerCase()) {
// // // //       case 'leetcode':
// // // //         return await scrapeLeetCode(username);
// // // //       case 'codeforces':
// // // //         return await scrapeCodeforces(username);
// // // //       // Add cases for other platforms...
// // // //       default:
// // // //         return null;
// // // //     }
// // // //   },
  
// // // //   updateAllPlatforms: async (userId) => {
// // // //     try {
// // // //       const platforms = await Platform.find({ user: userId });
      
// // // //       const updatePromises = platforms.map(async platform => {
// // // //         const data = await module.exports.scrapePlatform(platform.platformName, platform.handle);
// // // //         if (data) {
// // // //           platform.rating = data.rating;
// // // //           platform.rank = data.rank;
// // // //           platform.solvedProblems = data.solvedProblems;
// // // //           platform.profileUrl = data.profileUrl;
// // // //           platform.lastUpdated = new Date();
// // // //           await platform.save();
// // // //         }
// // // //         return platform;
// // // //       });
      
// // // //       return await Promise.all(updatePromises);
// // // //     } catch (err) {
// // // //       console.error('Error updating platforms:', err);
// // // //       throw err;
// // // //     }
// // // //   }
// // // // };






// // // const axios = require('axios');
// // // const cheerio = require('cheerio');

// // // // LeetCode scraper using their GraphQL API
// // // async function scrapeLeetCode(username) {
// // //   try {
// // //     const query = {
// // //       query: `
// // //         query getUserProfile($username: String!) {
// // //           matchedUser(username: $username) {
// // //             username
// // //             profile {
// // //               ranking
// // //               reputation
// // //             }
// // //             submitStats {
// // //               acSubmissionNum {
// // //                 difficulty
// // //                 count
// // //               }
// // //             }
// // //           }
// // //         }
// // //       `,
// // //       variables: { username }
// // //     };

// // //     const response = await axios.post('https://leetcode.com/graphql', query, {
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Referer': 'https://leetcode.com'
// // //       }
// // //     });

// // //     const userData = response.data.data.matchedUser;
// // //     if (!userData) {
// // //       return null;
// // //     }

// // //     // Extract problem difficulties
// // //     const solvedProblems = userData.submitStats.acSubmissionNum.reduce((acc, diff) => {
// // //       acc[diff.difficulty.toLowerCase()] = diff.count;
// // //       return acc;
// // //     }, { easy: 0, medium: 0, hard: 0 });

// // //     return {
// // //       rating: userData.profile.reputation,
// // //       rank: `#${userData.profile.ranking}`,
// // //       solvedProblems,
// // //       totalSolved: Object.values(solvedProblems).reduce((a, b) => a + b, 0),
// // //       profileUrl: `https://leetcode.com/${username}`,
// // //       handle: username
// // //     };
// // //   } catch (err) {
// // //     console.error('Error scraping LeetCode:', err);
// // //     return null;
// // //   }
// // // }

// // // // Codeforces scraper using their API
// // // async function scrapeCodeforces(username) {
// // //   try {
// // //     const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
// // //     const userData = response.data.result[0];

// // //     // Get contest rating
// // //     const contestResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
// // //     const contestRatings = contestResponse.data.result;
// // //     const latestRating = contestRatings.length > 0 
// // //       ? contestRatings[contestRatings.length - 1].newRating 
// // //       : userData.rating;

// // //     // Problem statistics
// // //     const problemsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
// // //     const submissions = problemsResponse.data.result;
    
// // //     // Count unique solved problems by difficulty
// // //     const solvedProblems = {
// // //       easy: new Set(),
// // //       medium: new Set(),
// // //       hard: new Set()
// // //     };

// // //     submissions.forEach(submission => {
// // //       if (submission.verdict === 'OK') {
// // //         const problemDifficulty = submission.problem.rating;
// // //         const problemKey = `${submission.problem.contestId}${submission.problem.index}`;
        
// // //         if (problemDifficulty <= 1200) {
// // //           solvedProblems.easy.add(problemKey);
// // //         } else if (problemDifficulty <= 1600) {
// // //           solvedProblems.medium.add(problemKey);
// // //         } else {
// // //           solvedProblems.hard.add(problemKey);
// // //         }
// // //       }
// // //     });

// // //     return {
// // //       rating: latestRating,
// // //       rank: userData.rank,
// // //       solvedProblems: {
// // //         easy: solvedProblems.easy.size,
// // //         medium: solvedProblems.medium.size,
// // //         hard: solvedProblems.hard.size
// // //       },
// // //       totalSolved: submissions.filter(s => s.verdict === 'OK').length,
// // //       profileUrl: `https://codeforces.com/profile/${username}`,
// // //       handle: username
// // //     };
// // //   } catch (err) {
// // //     console.error('Error scraping Codeforces:', err);
// // //     return null;
// // //   }
// // // }

// // // // HackerRank scraper 
// // // async function scrapeHackerRank(username) {
// // //   try {
// // //     const response = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/badges`);
// // //     const badges = response.data.models;

// // //     // HackerRank doesn't provide a straightforward way to get problem counts
// // //     // This is a simplified approach
// // //     return {
// // //       rating: badges.length, // Using badge count as a proxy for "rating"
// // //       rank: 'Not Available',
// // //       solvedProblems: {
// // //         easy: 0,  // HackerRank API doesn't provide easy breakdown
// // //         medium: 0,
// // //         hard: 0
// // //       },
// // //       totalSolved: 0,
// // //       profileUrl: `https://www.hackerrank.com/${username}`,
// // //       handle: username
// // //     };
// // //   } catch (err) {
// // //     console.error('Error scraping HackerRank:', err);
// // //     return null;
// // //   }
// // // }

// // // // GeeksForGeeks scraper
// // // async function scrapeGeeksForGeeks(username) {
// // //   try {
// // //     const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}/`);
// // //     const $ = cheerio.load(response.data);
    
// // //     // Parsing problem-solving stats
// // //     const problemStats = $('.score-card-head').map((i, el) => {
// // //       const text = $(el).text().trim();
// // //       return text;
// // //     }).get();

// // //     // Extract problem counts (this might need adjustment based on actual page structure)
// // //     return {
// // //       rating: 0, // GeeksForGeeks doesn't have a clear rating system
// // //       rank: 'Not Available',
// // //       solvedProblems: {
// // //         easy: 0,
// // //         medium: 0,
// // //         hard: 0
// // //       },
// // //       totalSolved: 0,
// // //       profileUrl: `https://auth.geeksforgeeks.org/user/${username}/`,
// // //       handle: username
// // //     };
// // //   } catch (err) {
// // //     console.error('Error scraping GeeksForGeeks:', err);
// // //     return null;
// // //   }
// // // }

// // // module.exports = {
// // //   scrapePlatform: async (platformName, username) => {
// // //     switch (platformName.toLowerCase()) {
// // //       case 'leetcode':
// // //         return await scrapeLeetCode(username);
// // //       case 'codeforces':
// // //         return await scrapeCodeforces(username);
// // //       case 'hackerrank':
// // //         return await scrapeHackerRank(username);
// // //       case 'geeksforgeeks':
// // //         return await scrapeGeeksForGeeks(username);
// // //       default:
// // //         return null;
// // //     }
// // //   },

// // //   updateAllPlatforms: async (userId) => {
// // //     try {
// // //       const platforms = await Platform.find({ user: userId });

// // //       const updatePromises = platforms.map(async platform => {
// // //         const data = await module.exports.scrapePlatform(platform.platformName, platform.handle);
// // //         if (data) {
// // //           platform.rating = data.rating;
// // //           platform.rank = data.rank;
// // //           platform.solvedProblems = data.totalSolved;
// // //           platform.problemBreakdown = data.solvedProblems;
// // //           platform.profileUrl = data.profileUrl;
// // //           platform.lastUpdated = new Date();
// // //           await platform.save();
// // //         }
// // //         return platform;
// // //       });
// // //       return await Promise.all(updatePromises);
// // //     } catch (err) {
// // //       console.error('Error updating platforms:', err);
// // //       throw err;
// // //     }
// // //   }
// // // };


// // const axios = require('axios');
// // const cheerio = require('cheerio');

// // // LeetCode scraper
// // async function scrapeLeetCode(username) {
// //   try {
// //     const response = await axios.get(`https://leetcode.com/${username}`);
// //     const $ = cheerio.load(response.data);
    
// //     // Extract data from the page
// //     const solved = $('[data-original-title="Problems Solved"]').text().trim();
// //     const rating = $('.rating-number').text().trim();
// //     const rank = $('.trophy').first().text().trim();
    
// //     return {
// //       rating: parseInt(rating) || 0,
// //       rank: rank || 'N/A',
// //       solvedProblems: parseInt(solved) || 0,
// //       profileUrl: `https://leetcode.com/${username}`
// //     };
// //   } catch (err) {
// //     console.error('LeetCode scraping error:', err);
// //     return null;
// //   }
// // }

// // // Codeforces scraper
// // async function scrapeCodeforces(username) {
// //   try {
// //     const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
// //     const userData = response.data.result[0];
    
// //     return {
// //       rating: userData.rating || 0,
// //       rank: userData.rank || 'N/A',
// //       solvedProblems: userData.maxRank ? 1000 : 500, // Example - replace with actual scraping
// //       profileUrl: `https://codeforces.com/profile/${username}`
// //     };
// //   } catch (err) {
// //     console.error('Codeforces scraping error:', err);
// //     return null;
// //   }
// // }

// // // HackerRank scraper
// // async function scrapeHackerRank(username) {
// //   try {
// //     const response = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/badges`);
// //     const badges = response.data.models;
    
// //     return {
// //       rating: badges.length * 100,
// //       rank: 'N/A',
// //       solvedProblems: badges.reduce((sum, b) => sum + b.stars, 0),
// //       profileUrl: `https://www.hackerrank.com/${username}`
// //     };
// //   } catch (err) {
// //     console.error('HackerRank scraping error:', err);
// //     return null;
// //   }
// // }

// // // Main scraper function
// // module.exports = {
// //   scrapePlatform: async (platformName, handle) => {
// //     switch (platformName.toLowerCase()) {
// //       case 'leetcode':
// //         return await scrapeLeetCode(handle);
// //       case 'codeforces':
// //         return await scrapeCodeforces(handle);
// //       case 'hackerrank':
// //         return await scrapeHackerRank(handle);
// //       default:
// //         return null;
// //     }
// //   },

// //   updatePlatforms: async (userId) => {
// //     try {
// //       const platforms = await Platform.find({ user: userId });
// //       const updatedPlatforms = [];
      
// //       for (const platform of platforms) {
// //         const data = await module.exports.scrapePlatform(
// //           platform.platformName, 
// //           platform.handle
// //         );
        
// //         if (data) {
// //           platform.rating = data.rating;
// //           platform.rank = data.rank;
// //           platform.solvedProblems = data.solvedProblems;
// //           platform.profileUrl = data.profileUrl;
// //           platform.lastUpdated = new Date();
// //           await platform.save();
// //           updatedPlatforms.push(platform);
// //         }
// //       }
      
// //       return updatedPlatforms;
// //     } catch (err) {
// //       console.error('Error updating platforms:', err);
// //       throw err;
// //     }
// //   }
// // };


// const axios = require('axios');
// const cheerio = require('cheerio');
// const retry = require('async-retry');

// // Configure axios for all requests
// const axiosConfig = {
//   timeout: 10000,
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//   }
// };
// async function fetchWithRetry(url, options = {}) {
//   const maxRetries = 3;
//   let lastError;
  
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const response = await axios.get(url, { ...axiosConfig, ...options });
//       return response;
//     } catch (err) {
//       lastError = err;
//       if (err.response && err.response.status >= 400 && err.response.status < 500) {
//         // Don't retry for client errors (4xx)
//         break;
//       }
//       // Exponential backoff
//       await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
//     }
//   }
  
//   throw lastError;
// }
// // // Helper function to fetch with retry
// // async function fetchWithRetry(url, options = {}) {
// //   return retry(
// //     async (bail) => {
// //       try {
// //         const response = await axios.get(url, { ...axiosConfig, ...options });
// //         return response;
// //       } catch (err) {
// //         if (err.response && err.response.status >= 400 && err.response.status < 500) {
// //           // Don't retry for 4xx errors
// //           bail(new Error(`Request failed with status ${err.response.status}`));
// //           return;
// //         }
// //         throw err;
// //       }
// //     },
// //     {
// //       retries: 3,
// //       minTimeout: 1000,
// //       maxTimeout: 5000
// //     }
// //   );
// // }

// // LeetCode scraper
// async function scrapeLeetCode(username) {
//   try {
//     const { data } = await fetchWithRetry(`https://leetcode.com/${username}`);
//     const $ = cheerio.load(data);
    
//     // Extract data from the page
//     const solvedText = $('[data-original-title="Problems Solved"]').text().trim();
//     const solvedMatch = solvedText.match(/(\d+)/);
//     const solved = solvedMatch ? parseInt(solvedMatch[1]) : 0;
    
//     const ratingText = $('.rating-number').text().trim();
//     const rating = ratingText ? parseInt(ratingText) : 0;
    
//     const rank = $('.trophy').first().text().trim() || 'N/A';
    
//     // Problem breakdown (if available)
//     const breakdown = { easy: 0, medium: 0, hard: 0 };
//     $('.difficulty-ac-count').each(function() {
//       const diff = $(this).attr('data-difficulty')?.toLowerCase();
//       const count = parseInt($(this).text().trim()) || 0;
//       if (diff && breakdown.hasOwnProperty(diff)) {
//         breakdown[diff] = count;
//       }
//     });
    
//     return {
//       rating,
//       rank,
//       solvedProblems: solved,
//       problemBreakdown: breakdown,
//       profileUrl: `https://leetcode.com/${username}`
//     };
//   } catch (err) {
//     console.error('LeetCode scraping error:', err.message);
//     return null;
//   }
// }

// // Codeforces scraper
// async function scrapeCodeforces(username) {
//   try {
//     const { data } = await fetchWithRetry(`https://codeforces.com/api/user.info?handles=${username}`);
    
//     if (data.status !== 'OK' || !data.result || data.result.length === 0) {
//       throw new Error('User not found on Codeforces');
//     }
    
//     const userData = data.result[0];
    
//     // Get solved problems count (approximate)
//     let solvedProblems = 0;
//     try {
//       const submissionsRes = await fetchWithRetry(
//         `https://codeforces.com/api/user.status?handle=${username}`
//       );
//       if (submissionsRes.data.status === 'OK') {
//         const solvedSet = new Set();
//         submissionsRes.data.result.forEach(sub => {
//           if (sub.verdict === 'OK') {
//             solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
//           }
//         });
//         solvedProblems = solvedSet.size;
//       }
//     } catch (subErr) {
//       console.error('Error fetching submissions:', subErr.message);
//       solvedProblems = 0;
//     }
    
//     return {
//       rating: userData.rating || 0,
//       maxRating: userData.maxRating || userData.rating || 0,
//       rank: userData.rank || 'N/A',
//       solvedProblems,
//       profileUrl: `https://codeforces.com/profile/${username}`
//     };
//   } catch (err) {
//     console.error('Codeforces scraping error:', err.message);
//     return null;
//   }
// }

// // HackerRank scraper
// async function scrapeHackerRank(username) {
//   try {
//     const { data } = await fetchWithRetry(
//       `https://www.hackerrank.com/rest/hackers/${username}/badges`,
//       { headers: { 'Accept': 'application/json' } }
//     );
    
//     const badges = data.models || [];
//     const solvedProblems = badges.reduce((sum, b) => sum + (b.stars || 0), 0);
    
//     // Get rating from profile
//     let rating = 0;
//     try {
//       const profileRes = await fetchWithRetry(
//         `https://www.hackerrank.com/rest/hackers/${username}/profile`,
//         { headers: { 'Accept': 'application/json' } }
//       );
//       rating = profileRes.data.model?.contest_rating || 0;
//     } catch (profileErr) {
//       console.error('Error fetching HackerRank profile:', profileErr.message);
//     }
    
//     return {
//       rating,
//       rank: 'N/A', // HackerRank doesn't provide rank easily
//       solvedProblems,
//       profileUrl: `https://www.hackerrank.com/${username}`
//     };
//   } catch (err) {
//     console.error('HackerRank scraping error:', err.message);
//     return null;
//   }
// }

// // CodeChef scraper
// async function scrapeCodeChef(username) {
//   try {
//     const { data } = await fetchWithRetry(`https://www.codechef.com/users/${username}`);
//     const $ = cheerio.load(data);
    
//     // Extract rating
//     const ratingText = $('.rating-number').text().trim();
//     const rating = ratingText ? parseInt(ratingText.replace(/,/g, '')) : 0;
    
//     // Extract rank
//     const rankText = $('.rating-rank').text().trim();
//     const rank = rankText || 'N/A';
    
//     // Extract solved problems
//     const solvedText = $('.problems-solved h5').text().trim();
//     const solvedMatch = solvedText.match(/(\d+)/);
//     const solvedProblems = solvedMatch ? parseInt(solvedMatch[1]) : 0;
    
//     return {
//       rating,
//       rank,
//       solvedProblems,
//       profileUrl: `https://www.codechef.com/users/${username}`
//     };
//   } catch (err) {
//     console.error('CodeChef scraping error:', err.message);
//     return null;
//   }
// }

// // Main scraper function
// module.exports = {
//   scrapePlatform: async (platformName, handle) => {
//     const platform = platformName.toLowerCase();
    
//     try {
//       switch (platform) {
//         case 'leetcode':
//           return await scrapeLeetCode(handle);
//         case 'codeforces':
//           return await scrapeCodeforces(handle);
//         case 'hackerrank':
//           return await scrapeHackerRank(handle);
//         case 'codechef':
//           return await scrapeCodeChef(handle);
//         // Add more platforms here
//         default:
//           console.error(`Unsupported platform: ${platformName}`);
//           return null;
//       }
//     } catch (err) {
//       console.error(`Error scraping ${platformName}:`, err.message);
//       return null;
//     }
//   },

//   updatePlatforms: async (userId) => {
//     try {
//       const platforms = await Platform.find({ user: userId });
//       const updatedPlatforms = [];
      
//       for (const platform of platforms) {
//         try {
//           const data = await module.exports.scrapePlatform(
//             platform.platformName, 
//             platform.handle
//           );
          
//           if (data) {
//             // Only update if data has changed
//             const needsUpdate = 
//               platform.rating !== data.rating ||
//               platform.solvedProblems !== data.solvedProblems ||
//               platform.rank !== data.rank ||
//               platform.profileUrl !== data.profileUrl;
            
//             if (needsUpdate) {
//               Object.assign(platform, {
//                 rating: data.rating,
//                 maxRating: data.maxRating || platform.maxRating,
//                 rank: data.rank,
//                 solvedProblems: data.solvedProblems,
//                 problemBreakdown: data.problemBreakdown || platform.problemBreakdown,
//                 profileUrl: data.profileUrl || platform.profileUrl,
//                 lastUpdated: new Date()
//               });
              
//               await platform.save();
//               updatedPlatforms.push(platform);
//             }
//           }
//         } catch (platformErr) {
//           console.error(`Error updating ${platform.platformName}:`, platformErr.message);
//           continue;
//         }
//       }
      
//       return updatedPlatforms;
//     } catch (err) {
//       console.error('Error updating platforms:', err.message);
//       throw err;
//     }
//   }
// };





const axios = require('axios');
const cheerio = require('cheerio');

// Configure axios defaults for all requests
const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
});

/**
 * Helper function to fetch with retry logic
 * @param {string} url - URL to fetch
 * @param {object} options - Axios options
 * @returns {Promise<object>} - Axios response
 */
async function fetchWithRetry(url, options = {}) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axiosInstance.get(url, options);
      return response;
    } catch (err) {
      lastError = err;
      
      // Don't retry for client errors (4xx)
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        break;
      }
      
      // Exponential backoff
      const delay = 1000 * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} for ${url} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * LeetCode scraper using their GraphQL API when possible, with HTML scraping as fallback
 * @param {string} username - LeetCode username
 * @returns {Promise<object>} - User profile data
 */
async function scrapeLeetCode(username) {
  try {
    // First try GraphQL API
    try {
      const query = {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
                reputation
                starRating
              }
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
          }
        `,
        variables: { username }
      };

      const response = await axiosInstance.post('https://leetcode.com/graphql', query, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        }
      });

      const userData = response.data.data.matchedUser;
      
      if (!userData) {
        throw new Error('User not found');
      }

      // Process problem breakdown
      const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
      const submitStats = userData.submitStats.acSubmissionNum;
      
      submitStats.forEach(stat => {
        const difficulty = stat.difficulty.toLowerCase();
        if (difficulty in problemBreakdown) {
          problemBreakdown[difficulty] = stat.count;
        }
      });

      const totalSolved = Object.values(problemBreakdown).reduce((a, b) => a + b, 0);

      return {
        rating: userData.profile.starRating || userData.profile.reputation || 0,
        rank: userData.profile.ranking ? `#${userData.profile.ranking}` : 'N/A',
        solvedProblems: totalSolved,
        problemBreakdown,
        profileUrl: `https://leetcode.com/${username}`,
        handle: username
      };
    } catch (graphqlErr) {
      console.log(`GraphQL API failed for LeetCode user ${username}, falling back to HTML scraping:`, graphqlErr.message);
      // Fallback to HTML scraping
      throw graphqlErr; // to trigger fallback
    }
  } catch (err) {
    // Fallback to HTML scraping
    try {
      const { data } = await fetchWithRetry(`https://leetcode.com/${username}`);
      const $ = cheerio.load(data);

      // Extract data from the page
      const solvedText = $('[data-cy="solved-count"]').text().trim() || 
                         $('[data-original-title="Problems Solved"]').text().trim();
      const solvedMatch = solvedText.match(/(\d+)/);
      const solved = solvedMatch ? parseInt(solvedMatch[1]) : 0;

      const ratingText = $('.rating-number').text().trim();
      const rating = ratingText ? parseInt(ratingText) : 0;

      const rankText = $('.ranking-title').text().trim() || $('.trophy').first().text().trim();
      const rank = rankText || 'N/A';

      // Problem breakdown
      const breakdown = { easy: 0, medium: 0, hard: 0 };
      
      // Try different selectors based on LeetCode's evolving UI
      $('.difficulty-ac-count, [data-difficulty]').each(function() {
        const difficultyElem = $(this);
        let diff = difficultyElem.attr('data-difficulty')?.toLowerCase();
        
        if (!diff) {
          // Try to infer from container classes or nearby text
          const container = difficultyElem.closest('.difficulty-level');
          if (container.hasClass('easy') || container.text().toLowerCase().includes('easy')) {
            diff = 'easy';
          } else if (container.hasClass('medium') || container.text().toLowerCase().includes('medium')) {
            diff = 'medium';
          } else if (container.hasClass('hard') || container.text().toLowerCase().includes('hard')) {
            diff = 'hard';
          }
        }
        
        if (diff && breakdown.hasOwnProperty(diff)) {
          const countText = difficultyElem.text().trim();
          const countMatch = countText.match(/(\d+)/);
          breakdown[diff] = countMatch ? parseInt(countMatch[1]) : 0;
        }
      });

      return {
        rating,
        rank,
        solvedProblems: solved,
        problemBreakdown: breakdown,
        profileUrl: `https://leetcode.com/${username}`,
        handle: username
      };
    } catch (htmlErr) {
      console.error(`Failed to scrape LeetCode user ${username}:`, htmlErr.message);
      return null;
    }
  }
}

/**
 * Codeforces scraper using their API
 * @param {string} username - Codeforces handle
 * @returns {Promise<object>} - User profile data
 */
async function scrapeCodeforces(username) {
  try {
    const { data } = await fetchWithRetry(`https://codeforces.com/api/user.info?handles=${username}`);

    if (data.status !== 'OK' || !data.result || data.result.length === 0) {
      throw new Error('User not found on Codeforces');
    }

    const userData = data.result[0];
    
    // Get problem stats
    let solvedProblems = 0;
    const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
    
    try {
      const submissionsRes = await fetchWithRetry(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`
      );
      
      if (submissionsRes.data.status === 'OK') {
        const solvedSet = new Set();
        
        submissionsRes.data.result.forEach(sub => {
          if (sub.verdict === 'OK') {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            
            if (!solvedSet.has(problemId)) {
              solvedSet.add(problemId);
              
              // Categorize by difficulty (rating)
              const difficulty = sub.problem.rating || 0;
              if (difficulty <= 1200) {
                problemBreakdown.easy++;
              } else if (difficulty <= 1900) {
                problemBreakdown.medium++;
              } else {
                problemBreakdown.hard++;
              }
            }
          }
        });
        
        solvedProblems = solvedSet.size;
      }
    } catch (subErr) {
      console.error(`Error fetching Codeforces submissions for ${username}:`, subErr.message);
    }

    return {
      rating: userData.rating || 0,
      maxRating: userData.maxRating || 0,
      rank: userData.rank || 'N/A',
      solvedProblems,
      problemBreakdown,
      profileUrl: `https://codeforces.com/profile/${username}`,
      handle: username
    };
  } catch (err) {
    console.error(`Error scraping Codeforces for ${username}:`, err.message);
    return null;
  }
}

/**
 * CodeChef scraper using HTML parsing
 * @param {string} username - CodeChef username
 * @returns {Promise<object>} - User profile data
 */
async function scrapeCodeChef(username) {
  try {
    const { data } = await fetchWithRetry(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(data);

    // Extract rating
    const ratingText = $('.rating-number').text().trim();
    const rating = ratingText ? parseInt(ratingText.replace(/,/g, '')) : 0;
    
    // Extract max rating
    const maxRatingText = $('div:contains("Highest Rating")').next().text().trim();
    const maxRatingMatch = maxRatingText.match(/(\d+)/);
    const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1]) : rating;

    // Extract rank
    const rankText = $('.rating-ranks strong').first().text().trim();
    const rank = rankText || 'N/A';

    // Extract solved problems
    const fullySolvedText = $('section:contains("Fully Solved")').find('h5').text().trim();
    const solvedMatch = fullySolvedText.match(/(\d+)/);
    const fullySolved = solvedMatch ? parseInt(solvedMatch[1]) : 0;
    
    const partiallySolvedText = $('section:contains("Partially Solved")').find('h5').text().trim();
    const partialMatch = partiallySolvedText.match(/(\d+)/);
    const partiallySolved = partialMatch ? parseInt(partialMatch[1]) : 0;
    
    // Get difficulty breakdown (CodeChef doesn't clearly categorize by difficulty)
    // We'll approximate based on problem categories
    const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
    
    // Try to extract problem categories if available
    $('section:contains("Problem Solved")').find('.problems-solved').each(function() {
      const category = $(this).find('h5').text().toLowerCase();
      
      if (category.includes('beginner') || category.includes('easy')) {
        const count = $(this).find('span').text().match(/(\d+)/);
        if (count) problemBreakdown.easy += parseInt(count[1]);
      } else if (category.includes('medium') || category.includes('div 2')) {
        const count = $(this).find('span').text().match(/(\d+)/);
        if (count) problemBreakdown.medium += parseInt(count[1]);
      } else if (category.includes('hard') || category.includes('challenge') || category.includes('div 1')) {
        const count = $(this).find('span').text().match(/(\d+)/);
        if (count) problemBreakdown.hard += parseInt(count[1]);
      }
    });
    
    // If we couldn't extract specific categories, make an estimate
    const totalSolved = fullySolved + partiallySolved;
    if (totalSolved > 0 && Object.values(problemBreakdown).reduce((a, b) => a + b, 0) === 0) {
      // Rough estimate: 50% easy, 30% medium, 20% hard
      problemBreakdown.easy = Math.round(totalSolved * 0.5);
      problemBreakdown.medium = Math.round(totalSolved * 0.3);
      problemBreakdown.hard = totalSolved - problemBreakdown.easy - problemBreakdown.medium;
    }

    return {
      rating,
      maxRating,
      rank,
      solvedProblems: totalSolved,
      problemBreakdown,
      profileUrl: `https://www.codechef.com/users/${username}`,
      handle: username
    };
  } catch (err) {
    console.error(`Error scraping CodeChef for ${username}:`, err.message);
    return null;
  }
}

/**
 * AtCoder scraper using HTML parsing
 * @param {string} username - AtCoder username
 * @returns {Promise<object>} - User profile data
 */
async function scrapeAtCoder(username) {
  try {
    const { data } = await fetchWithRetry(`https://atcoder.jp/users/${username}`);
    const $ = cheerio.load(data);

    // Extract rating
    const ratingText = $('th:contains("Rating")').next().text().trim();
    const ratingMatch = ratingText.match(/(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
    
    // Extract highest rating
    const highestRatingText = $('th:contains("Highest Rating")').next().text().trim();
    const highestRatingMatch = highestRatingText.match(/(\d+)/);
    const maxRating = highestRatingMatch ? parseInt(highestRatingMatch[1]) : rating;
    
    // Extract rank/class
    const rankText = $('th:contains("Class")').next().text().trim() || 
                     $('span.user-gray, span.user-brown, span.user-green, span.user-cyan, span.user-blue, span.user-yellow, span.user-orange, span.user-red').text().trim();
    const rank = rankText || 'N/A';

    // Get solved problems count
    let solvedProblems = 0;
    try {
      const { data: submissionData } = await fetchWithRetry(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`);
      
      const solvedSet = new Set();
      submissionData.forEach(sub => {
        if (sub.result === 'AC') { // AC = Accepted
          solvedSet.add(sub.problem_id);
        }
      });
      
      solvedProblems = solvedSet.size;
      
      // Get problem difficulty breakdown using the problems API
      const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
      
      try {
        const { data: problemsData } = await fetchWithRetry('https://kenkoooo.com/atcoder/resources/problem-models.json');
        
        solvedSet.forEach(problemId => {
          const problem = problemsData[problemId];
          if (problem && problem.difficulty) {
            // AtCoder difficulties range from about -1000 to 4000
            const difficulty = problem.difficulty;
            if (difficulty < 400) {
              problemBreakdown.easy++;
            } else if (difficulty < 1200) {
              problemBreakdown.medium++;
            } else {
              problemBreakdown.hard++;
            }
          } else {
            // If difficulty not available, count as easy
            problemBreakdown.easy++;
          }
        });
      } catch (diffErr) {
        console.error(`Error fetching AtCoder problem difficulties for ${username}:`, diffErr.message);
        // Make a rough estimate
        problemBreakdown.easy = Math.round(solvedProblems * 0.4);
        problemBreakdown.medium = Math.round(solvedProblems * 0.4);
        problemBreakdown.hard = solvedProblems - problemBreakdown.easy - problemBreakdown.medium;
      }
      
      return {
        rating,
        maxRating,
        rank,
        solvedProblems,
        problemBreakdown,
        profileUrl: `https://atcoder.jp/users/${username}`,
        handle: username
      };
      
    } catch (apiErr) {
      console.error(`Error using AtCoder API for ${username}:`, apiErr.message);
      
      // Fallback: just extract from contest history
      const contestHistory = $('.table-responsive').find('tbody tr').length || 0;
      
      // Rough estimate of solved problems based on contest history
      solvedProblems = contestHistory * 3; // Assume ~3 problems per contest
      
      return {
        rating,
        maxRating,
        rank,
        solvedProblems,
        problemBreakdown: { easy: 0, medium: 0, hard: 0 },
        profileUrl: `https://atcoder.jp/users/${username}`,
        handle: username
      };
    }
  } catch (err) {
    console.error(`Error scraping AtCoder for ${username}:`, err.message);
    return null;
  }
}

/**
 * HackerRank scraper
 * @param {string} username - HackerRank username
 * @returns {Promise<object>} - User profile data
 */
async function scrapeHackerRank(username) {
  try {
    const { data } = await fetchWithRetry(
      `https://www.hackerrank.com/rest/hackers/${username}/profile`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!data || !data.model) {
      throw new Error('User not found on HackerRank');
    }
    
    const userData = data.model;
    
    // Get badges
    const badgesResponse = await fetchWithRetry(
      `https://www.hackerrank.com/rest/hackers/${username}/badges`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    const badges = badgesResponse.data.models || [];
    
    // Calculate a proxy for rating based on badges and score
    const badgeScore = badges.reduce((sum, badge) => sum + (badge.stars || 1), 0);
    const rating = userData.contest_rating || userData.ratings?.data?.practice?.score || badgeScore * 100 || 0;
    
    // Get submission count
    let solvedProblems = 0;
    const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
    
    try {
      const submissionsRes = await fetchWithRetry(
        `https://www.hackerrank.com/rest/hackers/${username}/submission_histories`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (submissionsRes.data && submissionsRes.data.models) {
        const submissions = submissionsRes.data.models;
        solvedProblems = Object.values(submissions).reduce((sum, count) => sum + count, 0);
        
        // Try to get difficulty breakdown
        const challengesRes = await fetchWithRetry(
          `https://www.hackerrank.com/rest/hackers/${username}/recent_challenges`,
          { headers: { 'Accept': 'application/json' } }
        );
        
        if (challengesRes.data && challengesRes.data.models) {
          challengesRes.data.models.forEach(challenge => {
            const difficulty = challenge.difficulty_name?.toLowerCase();
            if (difficulty && problemBreakdown.hasOwnProperty(difficulty)) {
              problemBreakdown[difficulty]++;
            } else if (difficulty === 'advanced') {
              problemBreakdown.hard++;
            } else {
              // Default to medium if unknown
              problemBreakdown.medium++;
            }
          });
        } else {
          // Estimate breakdown
          problemBreakdown.easy = Math.round(solvedProblems * 0.4);
          problemBreakdown.medium = Math.round(solvedProblems * 0.4);
          problemBreakdown.hard = solvedProblems - problemBreakdown.easy - problemBreakdown.medium;
        }
      }
    } catch (subErr) {
      console.error(`Error fetching HackerRank submissions for ${username}:`, subErr.message);
      // Make a rough estimate
      solvedProblems = badgeScore * 3; // Assume ~3 problems per badge
      problemBreakdown.easy = Math.round(solvedProblems * 0.4);
      problemBreakdown.medium = Math.round(solvedProblems * 0.4);
      problemBreakdown.hard = solvedProblems - problemBreakdown.easy - problemBreakdown.medium;
    }

    return {
      rating,
      rank: userData.level || 'N/A',
      solvedProblems,
      problemBreakdown,
      profileUrl: `https://www.hackerrank.com/${username}`,
      handle: username
    };
  } catch (err) {
    console.error(`Error scraping HackerRank for ${username}:`, err.message);
    return null;
  }
}

/**
 * GeeksForGeeks scraper using HTML parsing
 * @param {string} username - GeeksForGeeks username
 * @returns {Promise<object>} - User profile data
 */
async function scrapeGeeksForGeeks(username) {
  try {
    const { data } = await fetchWithRetry(`https://auth.geeksforgeeks.org/user/${username}`);
    const $ = cheerio.load(data);

    // Extract institute rank
    const instituteRankText = $('.rankNum').text().trim();
    const rankMatch = instituteRankText.match(/(\d+)/);
    const rank = rankMatch ? `#${rankMatch[1]}` : 'N/A';
    
    // Extract coding score as rating
    const codingScoreText = $('div:contains("Coding Score")').next().text().trim();
    const scoreMatch = codingScoreText.match(/(\d+)/);
    const rating = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    
    // Extract problem solving count
    const problemsCountText = $('div:contains("Problem Solved")').next().text().trim();
    const problemsMatch = problemsCountText.match(/(\d+)/);
    const solvedProblems = problemsMatch ? parseInt(problemsMatch[1]) : 0;
    
    // Get problem breakdown
    const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
    
    // Try to extract problem breakdown
    $('div.gb_bHS').each(function() {
      const label = $(this).find('.difficulty').text().toLowerCase();
      const countText = $(this).find('.count').text();
      const count = parseInt(countText) || 0;
      
      if (label.includes('basic') || label.includes('school') || label.includes('easy')) {
        problemBreakdown.easy += count;
      } else if (label.includes('medium')) {
        problemBreakdown.medium += count;
      } else if (label.includes('hard')) {
        problemBreakdown.hard += count;
      }
    });
    
    // If breakdown extraction failed, estimate
    if (solvedProblems > 0 && Object.values(problemBreakdown).reduce((a, b) => a + b, 0) === 0) {
      problemBreakdown.easy = Math.round(solvedProblems * 0.5);
      problemBreakdown.medium = Math.round(solvedProblems * 0.3);
      problemBreakdown.hard = solvedProblems - problemBreakdown.easy - problemBreakdown.medium;
    }

    return {
      rating,
      rank,
      solvedProblems,
      problemBreakdown,
      profileUrl: `https://auth.geeksforgeeks.org/user/${username}`,
      handle: username
    };
  } catch (err) {
    console.error(`Error scraping GeeksForGeeks for ${username}:`, err.message);
    return null;
  }
}

/**
 * HackerEarth scraper
 * @param {string} username - HackerEarth username
 * @returns {Promise<object>} - User profile data
 */
async function scrapeHackerEarth(username) {
  try {
    const { data } = await fetchWithRetry(`https://www.hackerearth.com/@${username}`);
    const $ = cheerio.load(data);

    // Extract rating
    const ratingText = $('.rating-number').text().trim();
    const rating = ratingText ? parseInt(ratingText) : 0;
    
    // Extract rank (HackerEarth doesn't prominently display rank)
    const rank = 'N/A';
    
    // Extract solved problems count
    const solvedText = $('.problems-solved').text().trim();
    const solvedMatch = solvedText.match(/(\d+)/);
    const solvedProblems = solvedMatch ? parseInt(solvedMatch[1]) : 0;
    
    // HackerEarth doesn't easily show problem breakdown by difficulty
    const problemBreakdown = { easy: 0, medium: 0, hard: 0 };
    
    // Estimate based on total count
    if (solvedProblems > 0) {
      problemBreakdown.easy = Math.round(solvedProblems * 0.5);
      problemBreakdown.medium = Math.round(solvedProblems * 0.3);
      problemBreakdown.hard = solvedProblems - problemBreakdown.easy - problemBreakdown.medium;
    }

    return {
      rating,
      rank,
      solvedProblems,
      problemBreakdown,
      profileUrl: `https://www.hackerearth.com/@${username}`,
      handle: username
    };
  } catch (err) {
    console.error(`Error scraping HackerEarth for ${username}:`, err.message);
    return null;
  }
}

/**
 * Scrape platform based on platform name and username
 * @param {string} platformName - Name of the platform
 * @param {string} handle - User handle/username on the platform
 * @returns {Promise<object|null>} - User data or null if failed
 */
async function scrapePlatform(platformName, handle) {
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    console.error(`Invalid handle provided for ${platformName}`);
    return null;
  }
  
  // Clean up the handle
  const cleanHandle = handle.trim();
  
  try {
    console.log(`Scraping ${platformName} for user ${cleanHandle}`);
    
    switch (platformName.toLowerCase()) {
      case 'leetcode':
        return await scrapeLeetCode(cleanHandle);
      case 'codeforces':
        return await scrapeCodeforces(cleanHandle);
      case 'codechef':
        return await scrapeCodeChef(cleanHandle);
      case 'atcoder':
        return await scrapeAtCoder(cleanHandle);
      case 'hackerrank':
        return await scrapeHackerRank(cleanHandle);
      case 'geeksforgeeks':
        return await scrapeGeeksForGeeks(cleanHandle);
      case 'hackerearth':
        return await scrapeHackerEarth(cleanHandle);
      default:
        console.error(`Unsupported platform: ${platformName}`);
        return null;
    }
  } catch (err) {
    console.error(`Error scraping ${platformName} for ${cleanHandle}:`, err.message);
    return null;
  }
}

// /**
//  * Update all platforms for a user
//  * @param {string} userId - MongoDB ObjectId of the user
//  * @returns {Promise<Array>} - Array of updated platform objects
//  */
// async function updateAllPlatforms(userId) {
//   try {
//     const Platform = require('../models/Platform');
//     const platforms = await Platform.find({ user: userId });
//     const updatedPlatforms = [];
    
//     // Use Promise.allSettled to handle failures individually
//     const updatePromises = platforms.map(async platform => {
//       try {
//         const data = await scrapePlatform(platform.platformName, platform.handle);
        
//         if (data) {
//           // Check if data has changed
//           const needsUpdate = 
//             platform.rating !== data.rating ||
//             platform.solvedProblems !== data.solvedProblems ||
//             platform.rank !== data.rank ||
//             platform.profileUrl !== data.profileUrl;
          
//           if (needsUpdate) {
//             // Store current values in history before updating
//             const historyEntry = {
//               updatedAt: new Date(),
//               rating: platform.rating,
//               solvedProblems: platform.solvedProblems
//             };
            
//             if (!platform.updateHistory) {
//               platform.updateHistory = [];
//             }
            
//             platform.updateHistory.push(historyEntry);
            
//             // Limit history size if needed
//             if (platform.updateHistory.length > 100) {
//               platform.updateHistory = platform.updateHistory.slice(-100);
//             }
            
//             // Update platform data
//             platform.rating = data.rating;
//             platform.maxRating = data.maxRating || platform.maxRating;
//             platform.rank = data.rank;
//             platform.solvedProblems = data.solvedProblems;
//             platform.problemBreakdown = data.problemBreakdown;
//             platform.profileUrl = data.profileUrl;
//             platform.lastUpdated = new Date();
            
//             await platform.save();
//             updatedPlatforms.push(platform);
//           }
//         }
        
//         return platform;
//       } catch (err) {
//         console.error(`Error updating ${platform.platformName} for ${platform.handle}:`, err.message);
//         return platform;
//       }
//     });
    
//     await Promise.allSettled(updatePromises);
//     return updatedPlatforms;
//   } catch (err) {
//     console.error('Error in updateAllPlatforms:', err.message);
//     throw err;
//   }
// }

module.exports = {
  scrapePlatform,
  // updateAllPlatforms
};