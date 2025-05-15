// // // // const express = require("express");
// // // // const axios = require("axios");
// // // // const router = express.Router();

// // // // router.get("/contests", async (req, res) => {
// // // //     try {
// // // //         const codeforcesAPI = "https://codeforces.com/api/contest.list";
// // // //         const leetcodeAPI = "http://127.0.0.1:5001/contests/leetcode";
// // // //         const atcoderAPI = "http://127.0.0.1:5003/contests/atcoder";  // Flask API
// // // //         // Fetch data from APIs in parallel
// // // //         const [cfResponse, leetcodeResponse, atcoderResponse] = await Promise.all([
// // // //             axios.get(codeforcesAPI),
// // // //             axios.get(leetcodeAPI),
// // // //             axios.get(atcoderAPI)
// // // //         ]);
// // // //         // Process Codeforces contests
// // // //         const codeforcesContests = cfResponse.data.result
// // // //             .filter(contest => contest.phase === "BEFORE") 
// // // //             .map(contest => ({
// // // //                 id: `cf-${contest.id}`,
// // // //                 platform: "Codeforces",
// // // //                 name: contest.name,
// // // //                 url: `https://codeforces.com/contest/${contest.id}`,
// // // //                 startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
// // // //                 duration: (contest.durationSeconds / 3600).toFixed(1) + " hrs"
// // // //             })).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));;

// // // //         // Process LeetCode contests
// // // //         const leetcodeContests = leetcodeResponse.data.map((contest, index) => ({
// // // //             id: `${contest.platform.toLowerCase()}-${index}`,
// // // //             platform: contest.platform,
// // // //             name: contest.name,
// // // //             url: contest.url,
// // // //             startTime: contest.start_time || contest.startTime,
// // // //             duration: contest.duration
// // // //         })).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));;

// // // //         // Process AtCoder contests from Flask API
// // // //         const atcoderContests = atcoderResponse.data.map((contest, index) => ({
// // // //             id: `atcoder-${index}`,
// // // //             platform: "AtCoder",
// // // //             name: contest.name,
// // // //             url: contest.url,
// // // //             startTime: contest.start_time,
// // // //             duration: contest.duration
// // // //         })).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));;

// // // //         // Extract the next upcoming contest for each platform
// // // //         const upcomingContests = {
// // // //             Codeforces: codeforcesContests.length > 0 ? codeforcesContests[0] : null,
// // // //             LeetCode: leetcodeContests.length > 0 ? leetcodeContests[0] : null,
// // // //             AtCoder: atcoderContests.length > 0 ? atcoderContests[0] : null
// // // //         };

// // // //         // Combine all contests
// // // //         const allContests = [...codeforcesContests, ...leetcodeContests, ...atcoderContests]
// // // //             .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

// // // //         res.json({ 
// // // //             allContests,    
// // // //             upcoming: upcomingContests 
// // // //         });

// // // //     } catch (error) {
// // // //         console.error("Error fetching contests:", error);
// // // //         res.status(500).json({ 
// // // //             error: "Failed to fetch contests",
// // // //             details: error.message 
// // // //         });
// // // //     }
// // // // });

// // // // module.exports = router;



// // // const express = require("express");
// // // const axios = require("axios");
// // // const router = express.Router();

// // // // Helper function to process Codeforces contests
// // // const processCodeforcesContests = (contests, phase) => {
// // //   return contests
// // //     .filter(contest => contest.phase === phase)
// // //     .map(contest => ({
// // //       id: `cf-${contest.id}`,
// // //       platform: "Codeforces",
// // //       name: contest.name,
// // //       url: `https://codeforces.com/contest/${contest.id}`,
// // //       startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
// // //       duration: (contest.durationSeconds / 3600).toFixed(1) + " hrs",
// // //       type: phase === "BEFORE" ? "upcoming" : "past"
// // //     }))
// // //     .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
// // // };

// // // router.get("/", async (req, res) => {
// // //   try {
// // //     // API endpoints
// // //     const codeforcesAPI = "https://codeforces.com/api/contest.list";
// // //     const leetcodeAPI = "http://127.0.0.1:5001/contests/leetcode";
// // //     const atcoderAPI = "http://127.0.0.1:5003/contests/atcoder";

// // //     // Fetch data from all APIs in parallel
// // //     const [cfResponse, leetcodeResponse, atcoderResponse] = await Promise.all([
// // //       axios.get(codeforcesAPI),
// // //       axios.get(leetcodeAPI),
// // //       axios.get(atcoderAPI)
// // //     ]);

// // //     // Process Codeforces contests
// // //     const codeforcesUpcoming = processCodeforcesContests(cfResponse.data.result, "BEFORE");
// // //     const codeforcesPast = processCodeforcesContests(cfResponse.data.result, "FINISHED").slice(0, 50); // Limit past contests

// // //     // Process LeetCode contests
// // //     const leetcodeData = leetcodeResponse.data;
// // //     const leetcodeUpcoming = leetcodeData.upcoming.map((contest, index) => ({
// // //       id: `lc-${index}`,
// // //       platform: "LeetCode",
// // //       name: contest.name,
// // //       url: contest.url,
// // //       startTime: contest.start_time,
// // //       duration: contest.duration,
// // //       type: "upcoming"
// // //     }));

// // //     const leetcodePast = leetcodeData.past.map((contest, index) => ({
// // //       id: `lc-past-${index}`,
// // //       platform: "LeetCode",
// // //       name: contest.name,
// // //       url: contest.url,
// // //       startTime: contest.start_time,
// // //       duration: contest.duration,
// // //       type: "past"
// // //     }));

// // //     // Process AtCoder contests
// // //     const atcoderData = atcoderResponse.data;
// // //     const atcoderUpcoming = atcoderData.upcoming.map((contest, index) => ({
// // //       id: `ac-${index}`,
// // //       platform: "AtCoder",
// // //       name: contest.name,
// // //       url: contest.url,
// // //       startTime: contest.start_time,
// // //       duration: contest.duration,
// // //       type: "upcoming"
// // //     }));

// // //     const atcoderPast = atcoderData.past.map((contest, index) => ({
// // //       id: `ac-past-${index}`,
// // //       platform: "AtCoder",
// // //       name: contest.name,
// // //       url: contest.url,
// // //       startTime: contest.start_time,
// // //       duration: contest.duration,
// // //       type: "past"
// // //     }));

// // //     // Combine all contests
// // //     const allContests = [
// // //       ...codeforcesUpcoming,
// // //       ...codeforcesPast,
// // //       ...leetcodeUpcoming,
// // //       ...leetcodePast,
// // //       ...atcoderUpcoming,
// // //       ...atcoderPast
// // //     ];

// // //     // Group by platform and type
// // //     const contestsByPlatform = {
// // //       Codeforces: {
// // //         upcoming: codeforcesUpcoming,
// // //         past: codeforcesPast
// // //       },
// // //       LeetCode: {
// // //         upcoming: leetcodeUpcoming,
// // //         past: leetcodePast
// // //       },
// // //       AtCoder: {
// // //         upcoming: atcoderUpcoming,
// // //         past: atcoderPast
// // //       }
// // //     };

// // //     res.json({
// // //       allContests,
// // //       contestsByPlatform,
// // //       lastUpdated: new Date().toISOString()
// // //     });

// // //   } catch (error) {
// // //     console.error("Error fetching contests:", error);
// // //     res.status(500).json({ 
// // //       error: "Failed to fetch contests",
// // //       details: error.message 
// // //     });
// // //   }
// // // });

// // // module.exports = router;


// // const express = require("express");
// // const axios = require("axios");
// // const router = express.Router();

// // // Helper function to process Codeforces contests
// // const processCodeforcesContests = (contests, phase) => {
// //   if (!Array.isArray(contests)) return [];
// //   return contests
// //     .filter(contest => contest.phase === phase)
// //     .map(contest => ({
// //       id: `cf-${contest.id}`,
// //       platform: "Codeforces",
// //       name: contest.name,
// //       url: `https://codeforces.com/contest/${contest.id}`,
// //       startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
// //       duration: (contest.durationSeconds / 3600).toFixed(1) + " hrs",
// //       type: phase === "BEFORE" ? "upcoming" : "past"
// //     }))
// //     .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
// // };

// // // Helper function to safely process other platforms' contests
// // const processPlatformContests = (data, platform, type) => {
// //   if (!data || !data[type] || !Array.isArray(data[type])) return [];
// //   return data[type].map((contest, index) => ({
// //     id: `${platform.toLowerCase()}-${type}-${index}`,
// //     platform: platform,
// //     name: contest.name || `Untitled ${platform} Contest`,
// //     url: contest.url || `https://${platform.toLowerCase()}.com`,
// //     startTime: contest.start_time || new Date().toISOString(),
// //     duration: contest.duration || "N/A",
// //     type: type
// //   }));
// // };

// // router.get("/", async (req, res) => {
// //   try {
// //     // API endpoints
// //     const codeforcesAPI = "https://codeforces.com/api/contest.list";
// //     const leetcodeAPI = "http://127.0.0.1:5001/contests/leetcode";
// //     const atcoderAPI = "http://127.0.0.1:5003/contests/atcoder";

// //     // Fetch data from all APIs with error handling
// //     const responses = await Promise.allSettled([
// //       axios.get(codeforcesAPI),
// //       axios.get(leetcodeAPI),
// //       axios.get(atcoderAPI),
// //       axios.get(codechefAPI)
// //     ]);

// //     // Process responses
// //     const [cfResponse, leetcodeResponse, atcoderResponse, codechefResponse] = responses;

// //     // Process Codeforces contests
// //     const codeforcesUpcoming = cfResponse.status === 'fulfilled' 
// //       ? processCodeforcesContests(cfResponse.value.data.result, "BEFORE")
// //       : [];
// //     const codeforcesPast = cfResponse.status === 'fulfilled'
// //       ? processCodeforcesContests(cfResponse.value.data.result, "FINISHED").slice(0, 50)
// //       : [];

// //     // Process LeetCode contests
// //     const leetcodeUpcoming = leetcodeResponse.status === 'fulfilled'
// //       ? processPlatformContests(leetcodeResponse.value.data, "LeetCode", "upcoming")
// //       : [];
// //     const leetcodePast = leetcodeResponse.status === 'fulfilled'
// //       ? processPlatformContests(leetcodeResponse.value.data, "LeetCode", "past")
// //       : [];

// //     // Process AtCoder contests
// //     const atcoderUpcoming = atcoderResponse.status === 'fulfilled'
// //       ? processPlatformContests({ upcoming: atcoderResponse.value.data }, "AtCoder", "upcoming")
// //       : [];
// //     const atcoderPast = [];

// //     // Process CodeChef contests (example - adjust based on actual API response)
// //     const codechefUpcoming = codechefResponse.status === 'fulfilled'
// //       ? processPlatformContests(codechefResponse.value.data, "CodeChef", "upcoming")
// //       : [];
// //     const codechefPast = [];

// //     // Combine all contests
// //     const upcomingContests = [
// //       ...codeforcesUpcoming,
// //       ...leetcodeUpcoming,
// //       ...atcoderUpcoming,
// //       ...codechefUpcoming
// //     ].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

// //     res.json({
// //       upcoming: upcomingContests,
// //       past: [
// //         ...codeforcesPast,
// //         ...leetcodePast,
// //         ...atcoderPast,
// //         ...codechefPast
// //       ],
// //       lastUpdated: new Date().toISOString()
// //     });

// //   } catch (error) {
// //     console.error("Error fetching contests:", error);
// //     res.status(500).json({ 
// //       error: "Failed to fetch contests",
// //       details: error.message,
// //       upcoming: [],
// //       past: []
// //     });
// //   }
// // });

// // module.exports = router;


// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// // Helper function to process Codeforces contests
// const processCodeforcesContests = (contests, phase) => {
//   if (!Array.isArray(contests)) return [];
//   return contests
//     .filter(contest => contest.phase === phase)
//     .map(contest => ({
//       id: `cf-${contest.id}`,
//       platform: "Codeforces",
//       name: contest.name,
//       url: `https://codeforces.com/contest/${contest.id}`,
//       startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
//       duration: (contest.durationSeconds / 3600).toFixed(1) + " hrs",
//       type: phase === "BEFORE" ? "upcoming" : "past"
//     }))
//     .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
// };

// // Helper function to safely process other platforms' contests
// const processPlatformContests = (data, platform, type) => {
//   if (!data || !Array.isArray(data)) return [];
//   return data.map((contest, index) => ({
//     id: `${platform.toLowerCase()}-${type}-${index}`,
//     platform: platform,
//     name: contest.name || contest.title || `Untitled ${platform} Contest`,
//     url: contest.url || `https://${platform.toLowerCase()}.com`,
//     startTime: contest.start_time || contest.startTime || new Date().toISOString(),
//     duration: contest.duration || "N/A",
//     type: type
//   }));
// };

// router.get("/", async (req, res) => {
//   try {
//     // API endpoints - updated with working endpoints
//     const endpoints = {
//       codeforces: "https://codeforces.com/api/contest.list",
//       leetcode: "http://127.0.0.1:5001/contests/leetcode",
//       atcoder: "http://127.0.0.1:5003/contests/atcoder",
//       codechef: "https://www.codechef.com/api/list/contests/all"
//     };

//     // Fetch data from all APIs with error handling
//     const responses = await Promise.allSettled([
//       axios.get(endpoints.codeforces),
//       axios.get(endpoints.leetcode, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }),
//       axios.get(endpoints.atcoder),
//       axios.get(endpoints.codechef)
//     ]);

//     // Process responses
//     const [cfResponse, lcResponse, acResponse, ccResponse] = responses;

//     // Process Codeforces contests
//     const codeforcesUpcoming = cfResponse.status === 'fulfilled' && cfResponse.value.data.result
//       ? processCodeforcesContests(cfResponse.value.data.result, "BEFORE")
//       : [];
//     const codeforcesPast = cfResponse.status === 'fulfilled' && cfResponse.value.data.result
//       ? processCodeforcesContests(cfResponse.value.data.result, "FINISHED").slice(0, 50)
//       : [];

//     // Process LeetCode contests (GraphQL response)
//     const leetcodeUpcoming = lcResponse.status === 'fulfilled' && lcResponse.value.data.data
//       ? processPlatformContests(lcResponse.value.data.data.contests, "LeetCode", "upcoming")
//       : [];
//     const leetcodePast = [];

//     // Process AtCoder contests
//     const atcoderUpcoming = acResponse.status === 'fulfilled' && acResponse.value.data
//       ? processPlatformContests(acResponse.value.data, "AtCoder", "upcoming")
//       : [];
//     const atcoderPast = [];

//     // Process CodeChef contests
//     let codechefUpcoming = [];
//     let codechefPast = [];
//     if (ccResponse.status === 'fulfilled' && ccResponse.value.data) {
//       const now = new Date();
//       const contests = ccResponse.value.data.future_contests || [];
//       codechefUpcoming = processPlatformContests(contests, "CodeChef", "upcoming");
      
//       const pastContests = ccResponse.value.data.past_contests || [];
//       codechefPast = processPlatformContests(pastContests, "CodeChef", "past");
//     }

//     // Combine all contests
//     const upcomingContests = [
//       ...codeforcesUpcoming,
//       ...leetcodeUpcoming,
//       ...atcoderUpcoming,
//       ...codechefUpcoming
//     ].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

//     const pastContests = [
//       ...codeforcesPast,
//       ...leetcodePast,
//       ...atcoderPast,
//       ...codechefPast
//     ];

//     res.json({
//       upcoming: upcomingContests,
//       past: pastContests,
//       lastUpdated: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error("Error fetching contests:", error);
//     res.status(500).json({ 
//       error: "Failed to fetch contests",
//       details: error.message,
//       upcoming: [],
//       past: []
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Helper function to process Codeforces contests
const processCodeforcesContests = (contests, phase) => {
  if (!Array.isArray(contests)) return [];
  return contests
    .filter(contest => contest.phase === phase)
    .map(contest => ({
      id: `cf-${contest.id}`,
      platform: "Codeforces",
      name: contest.name,
      url: `https://codeforces.com/contest/${contest.id}`,
      startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
      duration: (contest.durationSeconds / 3600).toFixed(1) + " hrs",
      type: phase === "BEFORE" ? "upcoming" : "past"
    }))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};

// Helper function to safely process other platforms' contests
const processPlatformContests = (data, platform, type) => {
  if (!data || !Array.isArray(data)) return [];
  return data.map((contest, index) => ({
    id: `${platform.toLowerCase()}-${type}-${index}`,
    platform: platform,
    name: contest.name || contest.title || `Untitled ${platform} Contest`,
    url: contest.url || `https://${platform.toLowerCase()}.com`,
    startTime: contest.start_time || contest.startTime || new Date().toISOString(),
    duration: contest.duration || "N/A",
    type: type
  }));
};

// Helper function specifically for AtCoder contests
const processAtcoderContests = (contests, type) => {
  if (!Array.isArray(contests)) return [];
  return contests.map((contest, index) => ({
    id: `ac-${type}-${index}`,
    platform: "AtCoder",
    name: contest.name,
    url: contest.url,
    startTime: contest.start_time,
    duration: contest.duration || "N/A",
    type: type
  }));
};

router.get("/", async (req, res) => {
  try {
    // API endpoints - updated with working endpoints
    const endpoints = {
      codeforces: "https://codeforces.com/api/contest.list",
      leetcode: "http://127.0.0.1:5001/contests/leetcode",
      atcoder: "http://127.0.0.1:5003/contests/atcoder",
      codechef: "https://www.codechef.com/api/list/contests/all"
    };

    // Fetch data from all APIs with error handling
    const responses = await Promise.allSettled([
      axios.get(endpoints.codeforces),
      axios.get(endpoints.leetcode),
      axios.get(endpoints.atcoder),
      axios.get(endpoints.codechef)
    ]);

    // Process responses
    const [cfResponse, lcResponse, acResponse, ccResponse] = responses;

    // Process Codeforces contests
    const codeforcesUpcoming = cfResponse.status === 'fulfilled' && cfResponse.value.data.result
      ? processCodeforcesContests(cfResponse.value.data.result, "BEFORE")
      : [];
    const codeforcesPast = cfResponse.status === 'fulfilled' && cfResponse.value.data.result
      ? processCodeforcesContests(cfResponse.value.data.result, "FINISHED").slice(0, 50)
      : [];

    // Process LeetCode contests
    let leetcodeUpcoming = [];
    let leetcodePast = [];
    if (lcResponse.status === 'fulfilled' && lcResponse.value.data) {
      if (Array.isArray(lcResponse.value.data)) {
        // Handle the case where LeetCode returns a single array
        leetcodeUpcoming = processPlatformContests(
          lcResponse.value.data.filter(c => c.status === 'upcoming'),
          "LeetCode",
          "upcoming"
        );
        leetcodePast = processPlatformContests(
          lcResponse.value.data.filter(c => c.status === 'past'),
          "LeetCode",
          "past"
        );
      } else if (lcResponse.value.data.upcoming && lcResponse.value.data.past) {
        // Handle the case where LeetCode returns an object with upcoming/past
        leetcodeUpcoming = processPlatformContests(lcResponse.value.data.upcoming, "LeetCode", "upcoming");
        leetcodePast = processPlatformContests(lcResponse.value.data.past, "LeetCode", "past");
      }
    }

    // Process AtCoder contests
    let atcoderUpcoming = [];
    let atcoderPast = [];
    if (acResponse.status === 'fulfilled' && acResponse.value.data) {
      if (acResponse.value.data.upcoming && acResponse.value.data.past) {
        // Handle the case where AtCoder returns an object with upcoming/past
        atcoderUpcoming = processAtcoderContests(acResponse.value.data.upcoming, "upcoming");
        atcoderPast = processAtcoderContests(acResponse.value.data.past, "past");
      } else if (Array.isArray(acResponse.value.data)) {
        // Handle the case where AtCoder returns a single array
        atcoderUpcoming = processAtcoderContests(
          acResponse.value.data.filter(c => c.type === 'upcoming'),
          "upcoming"
        );
        atcoderPast = processAtcoderContests(
          acResponse.value.data.filter(c => c.type === 'past'),
          "past"
        );
      }
    }

    // Process CodeChef contests
    let codechefUpcoming = [];
    let codechefPast = [];
    if (ccResponse.status === 'fulfilled' && ccResponse.value.data) {
      const now = new Date();
      const contests = ccResponse.value.data.future_contests || [];
      codechefUpcoming = processPlatformContests(contests, "CodeChef", "upcoming");
      
      const pastContests = ccResponse.value.data.past_contests || [];
      codechefPast = processPlatformContests(pastContests, "CodeChef", "past");
    }

    // Combine all contests
    const upcomingContests = [
      ...codeforcesUpcoming,
      ...leetcodeUpcoming,
      ...atcoderUpcoming,
      ...codechefUpcoming
    ].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    const pastContests = [
      ...codeforcesPast,
      ...leetcodePast,
      ...atcoderPast,
      ...codechefPast
    ].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Sort past contests newest first

    res.json({
      upcoming: upcomingContests,
      past: pastContests,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ 
      error: "Failed to fetch contests",
      details: error.message,
      upcoming: [],
      past: []
    });
  }
});

module.exports = router;