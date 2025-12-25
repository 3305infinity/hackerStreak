# Smart Study Plan Generator - ML Service

This directory contains the Python-based Machine Learning service for generating personalized study plans for competitive programming.

## 🚀 Features

- **Personalized Study Plans**: Uses ML to analyze contest performance and create tailored study schedules
- **Weakness Detection**: Identifies weak topics based on failure rates and exposure
- **Topic Classification**: Automatically categorizes problems into 8 competitive programming topics
- **Progress Tracking**: Monitors study plan completion and adjusts recommendations
- **REST API**: Flask-based API for integration with the main Node.js backend

## 🧠 ML Algorithm

The service uses a **Random Forest Regressor** to predict weakness scores for each topic:

### Input Features
- Total contests analyzed
- Total problems attempted/solved
- Current rating
- Topic-specific metrics (attempted, solved, failure rate, weakness score)
- Recent performance (last 30 days)

### Output
- Weakness scores for 8 topics: DP, Graphs, Greedy, Math, Strings, DataStructures, BinarySearch, Misc
- Personalized 7-day study plan with daily focus areas

### Algorithm Flow
1. **Data Preprocessing**: Clean and normalize user contest data
2. **Feature Engineering**: Calculate topic-wise performance metrics
3. **ML Prediction**: Predict weakness scores using trained model
4. **Plan Generation**: Create balanced study schedule based on predictions

## 📊 Supported Topics

- **DP** (Dynamic Programming)
- **Graphs** (Graph Algorithms)
- **Greedy** (Greedy Algorithms)
- **Math** (Mathematics & Number Theory)
- **Strings** (String Algorithms)
- **DataStructures** (Data Structures)
- **BinarySearch** (Binary Search & Parametric Search)
- **Misc** (Miscellaneous Topics)

## 🛠 Installation & Setup

### Prerequisites
- Python 3.8+
- pip package manager

### 1. Install Dependencies
```bash
cd backend/ml_service
pip install -r requirements.txt
```

### 2. Run the Service
```bash
# Option 1: Using the run script (recommended)
python run_ml_service.py

# Option 2: Direct Flask run
export FLASK_APP=study_plan_generator.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5002
```

### 3. Verify Service is Running
```bash
curl http://localhost:5002/health
# Should return: {"status": "healthy", "service": "study_plan_ml"}
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Generate Study Plan
```
POST /generate_plan
Content-Type: application/json

{
  "user_analytics": {...},
  "contest_submissions": [...],
  "duration_days": 7
}
```
Generates a personalized study plan based on user data.

### Train Model
```
POST /train
```
Retrains the ML model (for development/admin use).

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Required for LLM-based topic classification (optional, falls back to rule-based)
- `FLASK_ENV`: Set to 'development' for debug mode

### Model Files
- `models/study_plan_model.pkl`: Trained Random Forest model
- `models/scaler.pkl`: Feature scaler
- `models/label_encoders.pkl`: Label encoders for categorical features

## 📈 Model Training

The model is trained on synthetic data representing typical competitive programming performance patterns. In production, you would:

1. Collect real user data (with consent)
2. Label effective study plans
3. Train on actual performance improvements
4. Continuously update the model

### Training Data Format
```csv
user_id,total_contests,total_problems_attempted,total_problems_solved,current_rating,dp_attempted,dp_solved,dp_failure_rate,dp_weakness_score,...
```

## 🔄 Integration with Main Backend

The ML service communicates with the Node.js backend via HTTP calls:

1. **Node.js Backend** (`/api/study-plan/generate`) → **ML Service** (`/generate_plan`)
2. **ML Service** returns study plan → **Node.js Backend** saves to MongoDB
3. **Frontend** displays the personalized plan

## 🧪 Testing

### Unit Tests
```bash
cd backend/ml_service
python -m pytest tests/  # (if you add test files)
```

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5002/health

# Test plan generation with sample data
curl -X POST http://localhost:5002/generate_plan \
  -H "Content-Type: application/json" \
  -d @test_data.json
```

## 🚀 Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5002

CMD ["python", "run_ml_service.py"]
```

### Scaling Considerations
- **Caching**: Implement Redis for model predictions
- **Async Processing**: Use Celery for long-running training jobs
- **Load Balancing**: Deploy multiple ML service instances
- **Model Updates**: Implement A/B testing for model improvements

## 📝 Development Notes

- The current implementation uses synthetic training data
- Rule-based topic classification works without OpenAI API
- Model can be improved with real user data and feedback loops
- Consider implementing model versioning for gradual rollouts

## 🤝 Contributing

1. Add new features to `study_plan_generator.py`
2. Update tests and documentation
3. Ensure backward compatibility with existing API
4. Test integration with the main backend

## 📞 Support

For issues related to the ML service:
1. Check service logs for errors
2. Verify all dependencies are installed
3. Ensure the service is running on port 5002
4. Check network connectivity between Node.js and Python services
