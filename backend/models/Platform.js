const mongoose = require('mongoose');

const ProblemBreakdownSchema = new mongoose.Schema({
  easy: { type: Number, default: 0 },
  medium: { type: Number, default: 0 },
  hard: { type: Number, default: 0 }
}, { _id: false });

const PlatformSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platformName: {
    type: String,
    required: true,
    enum: [
      'Codeforces', 
      'LeetCode', 
      'CodeChef', 
      'HackerRank', 
      'AtCoder', 
      'HackerEarth', 
      'GeeksForGeeks'
    ]
  },
  handle: { 
    type: String, 
    required: true,
    trim: true
  },
  rating: { 
    type: Number, 
    default: null 
  },
  maxRating: {
    type: Number,
    default: null
  },
  rank: { 
    type: String, 
    default: null 
  },
  solvedProblems: { 
    type: Number, 
    default: 0 
  },
  problemBreakdown: {
    type: ProblemBreakdownSchema,
    default: () => ({})
  },
  profileUrl: { 
    type: String, 
    default: null 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  updateHistory: [{
    updatedAt: Date,
    rating: Number,
    solvedProblems: Number
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
PlatformSchema.index({ user: 1, platformName: 1 }, { unique: true });
PlatformSchema.index({ platformName: 1, rating: -1 });

// Virtual for platform URL
PlatformSchema.virtual('platformUrl').get(function() {
  const urls = {
    'LeetCode': `https://leetcode.com/${this.handle}`,
    'Codeforces': `https://codeforces.com/profile/${this.handle}`,
    'CodeChef': `https://www.codechef.com/users/${this.handle}`,
    'HackerRank': `https://www.hackerrank.com/${this.handle}`,
    'AtCoder': `https://atcoder.jp/users/${this.handle}`,
    'HackerEarth': `https://www.hackerearth.com/@${this.handle}`,
    'GeeksForGeeks': `https://auth.geeksforgeeks.org/user/${this.handle}`
  };
  return urls[this.platformName] || null;
});

// Pre-save hook to set profileUrl if not provided
PlatformSchema.pre('save', function(next) {
  if (!this.profileUrl) {
    this.profileUrl = this.platformUrl;
  }
  next();
});

module.exports = mongoose.model('Platform', PlatformSchema);