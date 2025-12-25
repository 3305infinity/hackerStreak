const mongoose = require('mongoose');

const contestSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'LeetCode', 'AtCoder', 'CodeChef']
  },
  contestId: {
    type: String,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  contestStartTime: {
    type: Date,
    required: true
  },
  problemId: {
    type: String,
    required: true
  },
  problemName: {
    type: String,
    required: true
  },
  problemRating: {
    type: Number,
    default: null
  },
  problemTags: [{
    type: String
  }],
  submissionId: {
    type: String,
    required: true
  },
  submissionTime: {
    type: Date,
    required: true
  },
  verdict: {
    type: String,
    required: true,
    enum: ['OK', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'PE', 'FAILED']
  },
  programmingLanguage: {
    type: String,
    default: null
  },
  executionTime: {
    type: Number, // in milliseconds
    default: null
  },
  memoryUsed: {
    type: Number, // in KB
    default: null
  },
  testCasesPassed: {
    type: Number,
    default: null
  },
  totalTestCases: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
contestSubmissionSchema.index({ userId: 1, platform: 1, contestId: 1 });
contestSubmissionSchema.index({ userId: 1, submissionTime: -1 });
contestSubmissionSchema.index({ userId: 1, verdict: 1 });

// Virtual for solve rate calculation
contestSubmissionSchema.virtual('isSolved').get(function() {
  return this.verdict === 'OK';
});

// Instance method to check if submission is accepted
contestSubmissionSchema.methods.isAccepted = function() {
  return this.verdict === 'OK';
};

// Static method to get contest statistics
contestSubmissionSchema.statics.getContestStats = async function(userId, contestId) {
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        contestId: contestId
      }
    },
    {
      $group: {
        _id: '$verdict',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get user's contest history
contestSubmissionSchema.statics.getUserContestHistory = async function(userId, limit = 20) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          contestId: '$contestId',
          platform: '$platform',
          contestName: '$contestName'
        },
        submissions: { $sum: 1 },
        solved: {
          $sum: {
            $cond: [{ $eq: ['$verdict', 'OK'] }, 1, 0]
          }
        },
        maxRating: { $max: '$problemRating' },
        contestDate: { $first: '$contestStartTime' }
      }
    },
    {
      $project: {
        contestId: '$_id.contestId',
        platform: '$_id.platform',
        contestName: '$_id.contestName',
        submissions: 1,
        solved: 1,
        maxRating: 1,
        contestDate: 1,
        solveRate: {
          $multiply: [
            { $divide: ['$solved', '$submissions'] },
            100
          ]
        }
      }
    },
    { $sort: { contestDate: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('ContestSubmission', contestSubmissionSchema);
