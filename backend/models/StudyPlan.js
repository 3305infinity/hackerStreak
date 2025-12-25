const mongoose = require('mongoose');

const DailyPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  focus: {
    type: String,
    enum: ['study', 'revision', 'mock_contest'],
    required: true
  },
  topics: [{
    topic: {
      type: String,
      enum: ['DP', 'Graphs', 'Greedy', 'Math', 'Strings', 'DataStructures', 'BinarySearch', 'Misc', 'Mixed'],
      required: true
    },
    questionCount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  problems: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },
    topic: {
      type: String,
      enum: ['DP', 'Graphs', 'Greedy', 'Math', 'Strings', 'DataStructures', 'BinarySearch', 'Misc'],
      required: true
    },
    estimatedTime: {
      type: Number, // in minutes
      default: 30
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  }
}, { _id: false });

const StudyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Smart Study Plan'
  },
  description: {
    type: String,
    default: 'Personalized study plan based on your contest performance'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  totalDays: {
    type: Number,
    default: 7
  },
  dailyPlans: [DailyPlanSchema],
  overallStats: {
    totalProblems: {
      type: Number,
      default: 0
    },
    completedProblems: {
      type: Number,
      default: 0
    },
    topicsCovered: [{
      type: String,
      enum: ['DP', 'Graphs', 'Greedy', 'Math', 'Strings', 'DataStructures', 'BinarySearch', 'Misc', 'Mixed']
    }],
    averageDifficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    }
  },
  generationParams: {
    userRating: Number,
    contestsAnalyzed: Number,
    topWeakTopics: [String],
    focusAreas: [{
      topic: String,
      weaknessScore: Number,
      allocatedQuestions: Number
    }]
  },
  llmExplanation: {
    summary: String,
    topicBreakdown: [{
      topic: String,
      reasoning: String,
      recommendations: String
    }],
    overallStrategy: String,
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  progressTracking: {
    currentDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 7
    },
    daysCompleted: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date,
    streakDays: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
StudyPlanSchema.index({ user: 1, status: 1 });
StudyPlanSchema.index({ user: 1, startDate: -1 });
StudyPlanSchema.index({ status: 1, createdAt: -1 });

// Virtual for completion percentage
StudyPlanSchema.virtual('completionPercentage').get(function() {
  if (this.overallStats.totalProblems === 0) return 0;
  return Math.round((this.overallStats.completedProblems / this.overallStats.totalProblems) * 100);
});

// Pre-save hook to update stats
StudyPlanSchema.pre('save', function(next) {
  // Update total problems count
  this.overallStats.totalProblems = this.dailyPlans.reduce((total, day) => {
    return total + day.problems.length;
  }, 0);

  // Update completed problems count
  this.overallStats.completedProblems = this.dailyPlans.reduce((total, day) => {
    return total + day.problems.filter(p => p.completed).length;
  }, 0);

  // Update topics covered
  const topicsSet = new Set();
  this.dailyPlans.forEach(day => {
    day.problems.forEach(problem => {
      if (problem.topic) topicsSet.add(problem.topic);
    });
  });
  this.overallStats.topicsCovered = Array.from(topicsSet);

  next();
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
