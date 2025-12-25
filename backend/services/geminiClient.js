const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_gemini_api_key_here');

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate a study plan using Gemini AI with enhanced ML context
 * @param {Object} context - Enhanced context with ML insights
 * @returns {Promise<Object>} - Generated study plan
 */
async function generateStudyPlanWithGemini(context) {
  try {
    const {
      durationDays,
      focusAreas,
      topWeakTopics,
      currentRating,
      targetRating,
      platformRatings,
      mlInsights,
      totals,
      advancedMetrics,
      recentPerformance
    } = context;

    const prompt = `
You are an expert competitive programming coach. Generate a personalized ${durationDays}-day study plan for a user with the following profile:

CURRENT STATUS:
- Current Rating: ${currentRating}
- Target Rating: ${targetRating}
- Platforms: ${platformRatings.map(p => `${p.platform}: ${p.rating}`).join(', ')}

PERFORMANCE ANALYSIS:
- Total Problems Attempted: ${totals.totalProblemsAttempted}
- Total Problems Solved: ${totals.totalProblemsSolved}
- Problems in Last 30 Days: ${recentPerformance.last30Days}
- Improvement Rate: ${recentPerformance.improvementRate}
- Consistency Score: ${recentPerformance.consistencyScore}

WEAK AREAS (Top 5):
${focusAreas.map(area => `- ${area.topic}: ${Math.round(area.weaknessScore * 100)}% weakness, ${area.allocatedQuestions} questions needed`).join('\n')}

ML INSIGHTS:
- Predicted Rating: ${mlInsights.predictedRating}
- Expected Rating Change: ${mlInsights.expectedRatingChange}
- Confidence: ${Math.round(mlInsights.confidence * 100)}%

TOP WEAK TOPICS: ${topWeakTopics.join(', ')}

REQUIREMENTS:
1. Create a ${durationDays}-day study plan
2. Focus on weak areas while maintaining balance
3. Include 15-25 problems per day
4. Distribute topics across days
5. Provide clear daily focus and strategy
6. Include time estimates (2-4 hours per day)

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "startDate": "2024-01-01",
  "totalDays": ${durationDays},
  "dailyPlans": [
    {
      "day": 1,
      "focus": "String describing day's focus",
      "topics": [
        {
          "topic": "Topic Name",
          "questionCount": 5
        }
      ],
      "totalQuestions": 20,
      "estimatedDuration": "3 hours"
    }
  ],
  "llmExplanation": {
    "summary": "Brief summary of the plan",
    "overallStrategy": "Overall strategy explanation",
    "topicBreakdown": [
      "Topic 1: Why this topic and how many questions",
      "Topic 2: Why this topic and how many questions"
    ]
  }
}

Make the plan realistic, progressive, and focused on the user's weak areas.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract JSON
    let jsonText = text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    // Parse the JSON
    const planData = JSON.parse(jsonText);

    // Validate the structure
    if (!planData.dailyPlans || !Array.isArray(planData.dailyPlans)) {
      throw new Error('Invalid plan structure: missing dailyPlans array');
    }

    // Ensure all required fields are present
    planData.startDate = planData.startDate || new Date().toISOString().split('T')[0];
    planData.totalDays = planData.totalDays || durationDays;

    // Validate each daily plan
    planData.dailyPlans.forEach((day, index) => {
      if (!day.day || !day.focus || !day.topics || !Array.isArray(day.topics)) {
        throw new Error(`Invalid daily plan structure for day ${index + 1}`);
      }
    });

    return planData;

  } catch (error) {
    console.error('Error generating study plan with Gemini:', error);

    // Fallback plan generation
    return generateFallbackPlan(context);
  }
}

/**
 * Generate a fallback study plan when Gemini fails
 * @param {Object} context - Context data
 * @returns {Object} - Fallback study plan
 */
function generateFallbackPlan(context) {
  const { durationDays, focusAreas, currentRating, targetRating } = context;

  const dailyPlans = [];
  const topics = focusAreas.slice(0, 5);

  for (let day = 1; day <= durationDays; day++) {
    const dayTopics = topics.slice((day - 1) % topics.length, ((day - 1) % topics.length) + 2);
    const totalQuestions = dayTopics.reduce((sum, topic) => sum + (topic.allocatedQuestions || 5), 0);

    dailyPlans.push({
      day,
      focus: `Focus on ${dayTopics.map(t => t.topic).join(' and ')}`,
      topics: dayTopics.map(topic => ({
        topic: topic.topic,
        questionCount: Math.min(topic.allocatedQuestions || 5, 10)
      })),
      totalQuestions: Math.min(totalQuestions, 25),
      estimatedDuration: totalQuestions > 15 ? '4 hours' : '3 hours'
    });
  }

  return {
    startDate: new Date().toISOString().split('T')[0],
    totalDays: durationDays,
    dailyPlans,
    llmExplanation: {
      summary: `Fallback ${durationDays}-day study plan from ${currentRating} to ${targetRating}`,
      overallStrategy: 'Balanced approach focusing on weak areas with progressive difficulty',
      topicBreakdown: topics.map(topic =>
        `${topic.topic}: ${topic.allocatedQuestions || 5} questions to improve ${Math.round(topic.weaknessScore * 100)}% weakness`
      )
    }
  };
}

module.exports = {
  generateStudyPlanWithGemini
};
