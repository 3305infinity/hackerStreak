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

// Mock data for when APIs are not available
const getMockContests = () => {
  const now = new Date();
  const upcomingContests = [
    {
      id: "cf-1234",
      platform: "Codeforces",
      name: "Codeforces Round #800 (Div. 2)",
      url: "https://codeforces.com/contest/1234",
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      duration: "2.0 hrs"
    },
    {
      id: "lc-weekly-350",
      platform: "LeetCode",
      name: "LeetCode Weekly Contest 350",
      url: "https://leetcode.com/contest/weekly-contest-350",
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      duration: "1.5 hrs"
    }
  ];

  const pastContests = [
    {
      id: "cf-1200",
      platform: "Codeforces",
      name: "Codeforces Round #795 (Div. 2)",
      url: "https://codeforces.com/contest/1200",
      startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      duration: "2.0 hrs"
    },
    {
      id: "lc-weekly-345",
      platform: "LeetCode",
      name: "LeetCode Weekly Contest 345",
      url: "https://leetcode.com/contest/weekly-contest-345",
      startTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      duration: "1.5 hrs"
    }
  ];

  return { upcoming: upcomingContests, past: pastContests };
};

router.get("/", async (req, res) => {
  try {
    let upcomingContests = [];
    let pastContests = [];

    // Try to fetch from Codeforces API (most reliable)
    try {
      const cfResponse = await axios.get("https://codeforces.com/api/contest.list", {
        timeout: 5000 // 5 second timeout
      });

      if (cfResponse.data && cfResponse.data.result) {
        upcomingContests = processCodeforcesContests(cfResponse.data.result, "BEFORE");
        pastContests = processCodeforcesContests(cfResponse.data.result, "FINISHED").slice(0, 20);
      }
    } catch (cfError) {
      console.log("Codeforces API failed, using mock data:", cfError.message);
    }

    // If no contests from APIs, use mock data
    if (upcomingContests.length === 0 && pastContests.length === 0) {
      const mockData = getMockContests();
      upcomingContests = mockData.upcoming;
      pastContests = mockData.past;
    }

    // Add some mock contests from other platforms if Codeforces worked
    if (upcomingContests.length > 0) {
      const now = new Date();
      const additionalUpcoming = [
        {
          id: "lc-weekly-350",
          platform: "LeetCode",
          name: "LeetCode Weekly Contest 350",
          url: "https://leetcode.com/contest/weekly-contest-350",
          startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          duration: "1.5 hrs"
        },
        {
          id: "ac-abc-250",
          platform: "AtCoder",
          name: "AtCoder Beginner Contest 250",
          url: "https://atcoder.jp/contests/abc250",
          startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          duration: "1.5 hrs"
        }
      ];

      const additionalPast = [
        {
          id: "lc-weekly-345",
          platform: "LeetCode",
          name: "LeetCode Weekly Contest 345",
          url: "https://leetcode.com/contest/weekly-contest-345",
          startTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          duration: "1.5 hrs"
        }
      ];

      upcomingContests = [...upcomingContests, ...additionalUpcoming];
      pastContests = [...pastContests, ...additionalPast];
    }

    res.json({
      upcoming: upcomingContests,
      past: pastContests,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching contests:", error);

    // Return mock data as fallback
    const mockData = getMockContests();
    res.json({
      upcoming: mockData.upcoming,
      past: mockData.past,
      lastUpdated: new Date().toISOString(),
      error: "Using fallback data due to API issues"
    });
  }
});

module.exports = router;
