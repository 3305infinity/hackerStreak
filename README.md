# HackStreak - Smart Competitive Programming Tracker

## 🎯 Project Overview

HackStreak is a comprehensive full-stack web application designed for competitive programmers to track their progress, analyze performance, and receive AI-powered personalized study plans. The platform integrates with multiple competitive programming platforms (Codeforces, LeetCode, AtCoder, CodeChef) to provide unified analytics, contest tracking, and intelligent learning recommendations.

### Core Philosophy
- **Unified Platform Integration**: Single dashboard for multiple coding platforms
- **AI-Powered Insights**: ML-driven performance analysis and study plan generation
- **Real-time Analytics**: Live data scraping and performance tracking
- **Personalized Learning**: Adaptive study plans based on individual performance patterns

## 🚀 Key Features

### 🤖 AI-Powered Study Plans
- **ML-Driven Recommendations**: Uses Random Forest ML model trained on competitive programming data
- **Topic Classification**: 8-category problem classification (DP, Graphs, Greedy, Math, Strings, DataStructures, BinarySearch, Misc)
- **Weakness Detection**: Automated identification of weak areas through submission analysis
- **Adaptive Learning**: Dynamic plan adjustments based on progress and performance

### 📊 Performance Analytics
- **Cross-Platform Aggregation**: Unified metrics from Codeforces, LeetCode, AtCoder
- **Advanced Metrics**: Consistency scoring, improvement rate, recent performance analysis
- **Predictive Insights**: ML-based rating predictions with confidence intervals
- **100-Point Scoring System**: Comprehensive performance evaluation

### 🏆 Contest Management
- **Real-time Tracking**: Upcoming and past contests from all major platforms
- **Email Reminders**: Automated contest notifications
- **Bookmark System**: Save contests with custom reminders
- **Platform Filtering**: Filter contests by platform and time

### 🔐 Authentication & Security
- **OTP-Based Registration**: Secure email verification system
- **JWT Authentication**: 7-day session tokens
- **Password Security**: bcrypt hashing with 12 rounds
- **Protected Routes**: Middleware-based access control

## 🛠️ Technology Stack

### Backend (Node.js/Express)
- **Runtime**: Node.js v14+
- **Framework**: Express.js with CORS and body parsing
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Email Service**: Nodemailer with SMTP configuration
- **Validation**: Custom middleware with regex patterns

### Frontend (React)
- **Framework**: React 17+ with Create React App
- **Routing**: React Router v6 for SPA navigation
- **State Management**: React Context API for global state
- **HTTP Client**: Axios for API communication
- **Styling**: CSS3 with responsive design patterns

### AI/ML Service (Python/Flask)
- **Runtime**: Python 3.8+
- **Framework**: Flask with REST API
- **ML Library**: scikit-learn (Random Forest Classifier)
- **Data Processing**: pandas & numpy
- **Model Persistence**: joblib for model serialization

### Web Scraping (Python)
- **Libraries**: BeautifulSoup4, requests, selenium (optional)
- **Platforms**: Codeforces, LeetCode, AtCoder, CodeChef
- **Data Storage**: JSON files with structured output

### DevOps & Tools
- **Version Control**: Git with conventional commits
- **Package Management**: npm (backend/frontend), pip (ML service)
- **Environment**: dotenv for configuration management
- **Process Management**: PM2 for production deployment

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ML Service    │    │   Scrapers      │    │   Email Service │
│   (Python)      │    │   (Python)      │    │   (SMTP)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Breakdown

#### Frontend Architecture
- **Component Structure**: Modular components with separation of concerns
- **Routing**: Protected and public routes with authentication guards
- **State Management**: Context API for user session and bookmarks
- **API Integration**: Centralized Axios configuration with interceptors

#### Backend Architecture
- **MVC Pattern**: Models, Views (Routes), Controllers (Services)
- **Middleware Stack**: Authentication, validation, error handling, CORS
- **Service Layer**: Business logic separation from routes
- **Database Layer**: Mongoose schemas with validation and indexing

#### ML Service Architecture
- **HTTP API**: RESTful endpoints for topic classification and study plan generation
- **Model Pipeline**: Data preprocessing → Feature engineering → Prediction
- **Fallback System**: Rule-based classification when ML fails
- **Caching**: In-memory model loading for performance

#### Data Flow Pipeline
1. **User Registration**: Email → OTP Generation → Verification → Password Hashing → User Creation → JWT Generation → Response
2. **Platform Integration**: Handle Input → Validation → Scraping → Data Parsing → Database Storage → Profile URL Generation → Update History → Response
3. **Performance Analysis**: User Data → ML Processing → Topic Classification → Weakness Analysis → Score Calculation → Insights Generation → Response
4. **Study Plan Generation**: Performance Data → ML Analysis → Topic Prioritization → Problem Selection → Plan Structure → Time Estimation → Database Storage → Response

## 📋 Database Models

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique),
  password: String (required, hashed),
  profilePicture: String (optional URL),
  bio: String (optional, max 500 chars),
  socialLinks: {
    githubUrl: String,
    linkedinUrl: String,
    portfolioUrl: String
  },
  contestsParticipated: Number (default: 0),
  notificationPreferences: {
    email: Boolean (default: true),
    browser: Boolean (default: false)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Platform Model
```javascript
{
  user: ObjectId (ref: User),
  platformName: String (enum: codeforces, leetcode, atcoder, codechef),
  handle: String (required),
  rating: Number,
  maxRating: Number,
  rank: String,
  solvedProblems: Number,
  problemBreakdown: {
    easy: Number,
    medium: Number,
    hard: Number
  },
  profileUrl: String,
  lastUpdated: Date,
  updateHistory: [{
    rating: Number,
    timestamp: Date
  }]
}
```

### StudyPlan Model
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  description: String,
  topics: [{
    topic: String,
    problems: [{
      platform: String,
      problemId: String,
      title: String,
      difficulty: String,
      url: String
    }],
    estimatedTime: Number,
    completed: Boolean
  }],
  totalProblems: Number,
  completedProblems: Number,
  startDate: Date,
  targetDate: Date,
  progress: Number,
  aiGenerated: Boolean,
  mlInsights: Object
}
```

## 🔗 API Documentation

### Authentication Endpoints

#### POST /api/auth/send-otp
**Send OTP for registration**
```json
Request Body:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### POST /api/auth/register
**Register new user**
```json
Request Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePass123",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### POST /api/auth/login
**User login**
```json
Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### GET /api/auth/me
**Get current user profile**
```
Headers: x-auth-token: jwt_token
```

### Platform Management Endpoints

#### GET /api/platform
**Get user's platforms**
```
Headers: x-auth-token: jwt_token
Response: Array of platform objects
```

#### POST /api/platform
**Add new platform**
```json
Request Body:
{
  "platformName": "codeforces",
  "handle": "user_handle"
}
```

#### PUT /api/platform/:id
**Update platform handle**
```json
Request Body:
{
  "handle": "new_handle"
}
```

#### DELETE /api/platform/:id
**Delete platform**

#### POST /api/platform/update-stats/:id
**Update single platform stats**

#### POST /api/platform/update-all-stats
**Update all platforms stats**

### Performance Analysis Endpoints

#### GET /api/performance/analyze
**Get detailed performance analysis**
```
Response:
{
  "success": true,
  "analysis": {
    "performanceScore": 85,
    "insights": {...},
    "aggregatedMetrics": {...},
    "topicAnalysis": {...},
    "advancedMetrics": {...},
    "mlInsights": {...}
  }
}
```

#### GET /api/performance/summary
**Get performance summary**

#### POST /api/performance
**Analyze performance by handles (no auth required)**
```json
Request Body:
{
  "handles": {
    "codeforces": "user_handle",
    "leetcode": "user_handle"
  }
}
```

### Study Plan Endpoints

#### GET /api/study-plan
**Get user's study plans**

#### POST /api/study-plan/generate
**Generate AI study plan**
```json
Request Body:
{
  "targetRating": 1800,
  "timeframe": 30,
  "focusTopics": ["DP", "Graphs"]
}
```

#### PUT /api/study-plan/:id/progress
**Update study plan progress**

### Contest Endpoints

#### GET /api/contests
**Get all contests**

#### GET /api/upcoming
**Get upcoming contests**

#### GET /api/past
**Get past contests**

#### POST /api/send-reminder
**Send contest reminder**
```json
Request Body:
{
  "email": "user@example.com",
  "contestName": "Codeforces Round #123",
  "platform": "Codeforces",
  "startTime": "2024-01-01T10:00:00Z",
  "contestUrl": "https://codeforces.com/contest/123"
}
```

### Profile Endpoints

#### GET /api/profile
**Get user profile**

#### PUT /api/profile
**Update user profile**

## 🔐 Authentication Flow

### Registration Flow
1. **Frontend**: User submits email
2. **Backend**: Generate 6-digit OTP, store temporarily (10min expiry)
3. **Email Service**: Send OTP via SMTP
4. **Frontend**: User enters OTP + password
5. **Backend**: Verify OTP, hash password (bcrypt, 12 rounds), create user
6. **JWT**: Generate token (7-day expiry), return to frontend
7. **Frontend**: Store token in localStorage, redirect to dashboard

### Login Flow
1. **Frontend**: User submits email + password
2. **Backend**: Find user, compare password hash
3. **JWT**: Generate new token, return to frontend
4. **Session**: Frontend stores token, sets auth headers for future requests

### Protected Route Access
1. **Frontend**: Include `x-auth-token` header in requests
2. **Middleware**: Verify JWT token, decode user ID
3. **Database**: Fetch user data, attach to request object
4. **Route Handler**: Access authenticated user via `req.user`

## 🔄 Data Pipeline

### User Registration Pipeline
```
User Input → Email Validation → OTP Generation → Email Sending → OTP Verification → Password Hashing → User Creation → JWT Generation → Response
```

### Platform Integration Pipeline
```
Handle Input → Validation → Scraping Service → Data Parsing → Database Storage → Profile URL Generation → Update History → Response
```

### Performance Analysis Pipeline
```
User Data → ML Processing → Topic Classification → Weakness Analysis → Score Calculation → Insights Generation → Response
```

### Study Plan Generation Pipeline
```
Performance Data → ML Analysis → Topic Prioritization → Problem Selection → Plan Structure → Time Estimation → Database Storage → Response
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v14+ (https://nodejs.org/)
- **Python** 3.8+ (https://python.org/)
- **MongoDB** (local or Atlas) (https://mongodb.com/)
- **Git** (https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/hackerstreak.git
cd hackerstreak
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cd ..
```

### 4. ML Service Setup
```bash
cd backend/ml_service
pip install -r requirements.txt
cd ../..
```

### 5. Environment Configuration
Create `.env` file in `backend/` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/hackerstreak

# Server
PORT=5000

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email Service
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your-email@example.com

# ML Service
ML_SERVICE_URL=http://localhost:5002

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key_here
```

### 6. Database Setup
```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb/brew/mongodb-community

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env accordingly
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start ML Service (Terminal 1)
```bash
cd backend/ml_service
python run_ml_service.py
# Runs on http://localhost:5002
```

#### Start Backend Server (Terminal 2)
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

#### Start Frontend (Terminal 3)
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm run prod
```

## 🕷️ Running Scrapers

### Individual Platform Scrapers
```bash
# Codeforces User Data
python scraper/scrape_codeforces_user.py

# LeetCode User Data
python scraper/scrape_leetcode_user.py

# AtCoder User Data
python scraper/scrape_atcoder_user.py

# CodeChef Contests
python scraper/scrape_codechef.py

# LeetCode Contests
python scraper/scrape_leetcode.py

# AtCoder Contests
python scraper/scrapeatcoder.py
```

### Batch Scraping
```bash
# Run all scrapers
python scraper/run_all.py
```

### Scraper Output
- `scraper/output/all_contests.json` - All contest data
- `scraper/output/user_stats.json` - User statistics
- `scraper/output/full_scraped_data.json` - Complete scraped data

## 🤖 ML Service Details

### Available Endpoints

#### POST /classify_topic
**Classify problem topic**
```json
Request:
{
  "title": "Two Sum",
  "description": "Given array, find two numbers...",
  "tags": ["array", "hash-table"]
}

Response:
{
  "topic": "DataStructures",
  "confidence": 0.85
}
```

#### POST /generate_study_plan
**Generate personalized study plan**
```json
Request:
{
  "user_performance": {...},
  "target_rating": 1800,
  "timeframe_days": 30
}

Response:
{
  "study_plan": {...},
  "recommendations": [...]
}
```

### ML Model Details
- **Algorithm**: Random Forest Classifier
- **Features**: Problem title, description, tags, difficulty
- **Accuracy**: ~85% on validation set
- **Training Data**: 10,000+ labeled competitive programming problems

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Or use MongoDB Compass to verify connection
```

#### ML Service Not Starting
```bash
# Check Python version
python --version

# Install missing dependencies
cd backend/ml_service
pip install -r requirements.txt

# Check model files exist
ls ml_service/models/
```

#### Email OTP Not Received
```bash
# Check SMTP configuration in .env
# Use Mailtrap for testing: https://mailtrap.io/
# Verify firewall allows SMTP port (587/2525)
```

#### Frontend Build Errors
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check Node.js version compatibility
node --version
```

#### CORS Errors
```bash
# Verify backend CORS configuration
# Check if frontend is running on correct port (3000)
# Ensure backend allows frontend origin
```

### Performance Optimization
- **Database Indexing**: Ensure MongoDB indexes on frequently queried fields
- **ML Caching**: Models loaded in memory for faster inference
- **API Rate Limiting**: Implement rate limiting for scraping endpoints
- **Compression**: Enable gzip compression for API responses

## 📊 Monitoring & Analytics

### Application Metrics
- **User Registration**: Daily/weekly signup trends
- **Platform Integration**: Most popular platforms
- **API Usage**: Endpoint usage statistics
- **ML Performance**: Model accuracy and response times

### Error Tracking
- **Sentry Integration**: Real-time error monitoring
- **Log Aggregation**: Centralized logging with Winston
- **Performance Monitoring**: Response time tracking

## 🔒 Security Considerations

### Authentication Security
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Expiration**: 7-day token expiry
- **OTP Security**: 6-digit codes with 10-minute expiry
- **Rate Limiting**: Prevent brute force attacks

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Frontend input escaping
- **HTTPS Enforcement**: SSL/TLS in production

### API Security
- **CORS Configuration**: Restricted origins
- **Helmet.js**: Security headers
- **Input Validation**: Joi schema validation
- **Error Handling**: Generic error messages

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackerstreak
JWT_SECRET=production_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### PM2 Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Code Standards
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Jest**: Unit testing framework

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# ML service tests
cd backend/ml_service
python -m pytest
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/hackerstreak/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hackerstreak/discussions)
- **Email**: support@hackerstreak.com

## 🙏 Acknowledgments

- **Competitive Programming Communities**: Codeforces, LeetCode, AtCoder, CodeChef
- **Open Source Libraries**: Express.js, React, scikit-learn, BeautifulSoup
- **Contributors**: All developers who contribute to this project

---

**Happy Coding! 🚀**



## 🧑‍💻 Getting Started

### Prerequisites
- **Node.js** (v14 or above)
- **npm** or **yarn**
- **Python 3.8+** (for ML service and scrapers)
- **MongoDB** instance (local or cloud-based)
- **Git** for cloning the repository

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/3305infinity/hackerStreak.git
cd hackerStreak
```

2. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
cd ..
```

4. **Install Python Dependencies for ML Service:**
```bash
cd backend/ml_service
pip install -r requirements.txt
cd ../..
```

5. **Set up Environment Variables:**

Create a `.env` file in the `backend` directory with the following content:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hackerstreak
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/hackerstreak

# Server
PORT=5000

# Email Service (for OTP and reminders)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your-email@example.com

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# ML Service URL (optional, defaults to localhost:5002)
ML_SERVICE_URL=http://localhost:5002

# OpenAI API Key (optional, for advanced topic classification)
OPENAI_API_KEY=your_openai_api_key_here
```

### 🚀 Running the Application

#### Option 1: Quick Start (All Services)
```bash
# Start all services with a single command
npm run start:all
```

#### Option 2: Manual Start (Recommended for Development)

1. **Start MongoDB** (if using local instance):
```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows (as Administrator)
net start MongoDB
```

2. **Start the ML Service** (in a new terminal):
```bash
cd backend/ml_service
python run_ml_service.py
# Service will run on http://localhost:5002
```

3. **Start the Backend Server** (in a new terminal):
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

4. **Start the Frontend** (in a new terminal):
```bash
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

### 🕷️ Running the Scrapers

The scrapers are Python scripts that fetch contest data and user profiles from various platforms. Run them as needed:

#### Individual Scrapers:
```bash
# Codeforces User Data
python scraper/scrape_codeforces_user.py

# LeetCode User Data
python scraper/scrape_leetcode_user.py

# AtCoder User Data
python scraper/scrape_atcoder_user.py

# CodeChef Contests
python scraper/scrape_codechef.py

# LeetCode Contests
python scraper/scrape_leetcode.py

# AtCoder Contests
python scraper/scrapeatcoder.py
```

#### Batch Run All Scrapers:
```bash
# Run all scrapers sequentially
python -c "
import subprocess
import os
scrapers = [
    'scraper/scrape_codeforces_user.py',
    'scraper/scrape_leetcode_user.py',
    'scraper/scrape_atcoder_user.py',
    'scraper/scrape_codechef.py',
    'scraper/scrape_leetcode.py',
    'scraper/scrapeatcoder.py'
]
for scraper in scrapers:
    print(f'Running {scraper}...')
    subprocess.run(['python', scraper], cwd=os.getcwd())
    print(f'Completed {scraper}')
"
```

### 🔧 Troubleshooting

#### Common Issues:

1. **Port Already in Use:**
```bash
# Find process using port 3000, 5000, or 5002
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
lsof -ti:5002 | xargs kill -9
```

2. **MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# Or
ps aux | grep mongod

# Start MongoDB if not running
brew services start mongodb/brew/mongodb-community
```

3. **Python Dependencies Issues:**
```bash
# Upgrade pip
pip install --upgrade pip

# Install in virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r backend/ml_service/requirements.txt
```

4. **ML Service Not Starting:**
```bash
# Check Python version
python --version

# Install missing dependencies
cd backend/ml_service
pip install flask scikit-learn pandas numpy joblib

# Run directly
python study_plan_generator.py
```

### 🌐 Accessing the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5002
- **MongoDB**: localhost:27017 (if local)

### 📱 Key Features to Test

1. **User Registration/Login** with OTP verification
2. **Contest Browsing** - upcoming and past contests
3. **Platform Integration** - add Codeforces/LeetCode profiles
4. **AI Study Plans** - generate personalized study schedules
5. **Bookmark System** - save contests and set reminders
6. **Email Notifications** - contest reminders

### 🔄 Development Workflow

```bash
# Make changes to backend
cd backend && npm run dev

# Make changes to frontend
cd frontend && npm start

# Test API endpoints
curl http://localhost:5000/api/auth/me \
  -H "x-auth-token: YOUR_JWT_TOKEN"

# Test ML service
curl http://localhost:5002/health
```


LETS DIVE INTO THE BACKEND PART

Table of Contents

1.Server Configuration
2.Database Models
3.Authentication System
4.Routes
5.Validation Utilities
6.Email Service
7.Code Flow

Server Configuration (server.js)
Entry Point: Main application setup and configuration

Key Components:
Express Setup:
CORS configured for frontend (localhost:3000)
Body parsing middleware (JSON and URL-encoded)
Error handling middleware

Notable Features:
Email Transporter: Nodemailer configured with SMTP settings from environment variables

API Routes:
/api/auth - Authentication endpoints
/api/contests - Contest-related endpoints
/api/platform - Coding platform management
/api/profile - User profile management
/api/platforms/update - Platform update specific endpoints

Email Reminder Endpoint:

Sends contest reminders with details (contest name, platform, start time, URL)
Validates required fields before sending

Security:
Credentials allowed in CORS
Auth token exposed in headers
Environment variables for sensitive data

Database Models
1. User Model (models/User.js)
Schema Fields:

Basic info: name, email (unique), password
Profile: profilePicture, bio, social links (githubUrl, linkedinUrl, portfolioUrl)
Stats: contestsParticipated
Preferences: notificationPreferences (email/browser)
Relationships: platforms array (references Platform model)

Features:

Timestamps for creation/updates
Password excluded from queries by default


2. Platform Model (models/Platform.js)
Schema Fields:

Relationship: user (reference to User)
Platform info: platformName (enum), handle
Stats: rating, maxRating, rank, solvedProblems
Problem breakdown: problemBreakdown (easy/medium/hard counts)
History: updateHistory array tracking changes over time



Advanced Features:
Compound unique index: Ensures one handle per platform per user
Virtual field: platformUrl automatically generates profile URL
Pre-save hook: Sets profileUrl if not provided
Indexes for ranking/leaderboard queries


Authentication System (routes/auth.js)
Key Components:
OTP Verification:
Generates 6-digit OTP
Stores temporarily (in-memory, with 10min expiry)
Sends via email with HTML template


Registration:
Requires OTP verification
Password requirements: 8+ chars, 1 uppercase, 1 number
Bcrypt hashing (12 rounds)
JWT token generation (7-day expiry)

Login:
Email/password authentication
Bcrypt comparison
Returns JWT token


Protected Routes:

authMiddleware verifies JWT
/me endpoint for current user data


Security Features:
Token expiration handling
Error handling for invalid/expired tokens
Password never returned in responses


Routes
1. Auth Routes (routes/auth.js)
Covered in Authentication System section

2. Contest Routes (routes/contests.js)
   Key Features (from code):

           Fetches contests from coding platforms
           Processing logic for Codeforces contests
           Filtering by contest phase
   
3. Platform Routes (routes/platform.js)
Expected Functionality:
CRUD operations for user's coding platforms
Handle verification
Profile data fetching

4. Profile Routes (routes/profile.js)
Expected Functionality:
Update user profile info
Manage social links
Notification preferences

5. Platform Update Routes (routes/platformUpdate.js)
Specialized Purpose:
Handles periodic updates of platform stats
Likely interacts with scraping services




Validation Utilities
Validation Middlewares:
Profile Update:
Name: 2-50 chars
Bio: <500 chars
URL validation for social links
Platform-specific handle validation



Platform Operations:
Validates platformName against enum
Handle format checks per platform
Unique handle enforcement


Ownership verification

Helper Functions:
isValidUrl: Proper URL validation
validateHandle: Platform-specific regex checks
Error formatting for consistent API responses


Email Service
Implementations:
Reminder Emails (server.js):
Customizable HTML templates
Contest details formatting



Error handling

OTP Emails (auth.js):
Styled HTML templates
Expiration notices


Security warnings
Configuration:
SMTP settings from environment variables
Mailtrap sandbox fallback
Dedicated email routes




Code Flow
Typical Request Journey:
Authentication:

Frontend → /api/auth/send-otp

User submits OTP → /api/auth/register

Receives JWT token

Platform Setup:
Authenticated request to /api/platform
Handle validated per platform rules
Data stored with user association


Contest Interaction:
Fetch contests → /api/contests
Set reminder → /api/send-reminder
Email queued via Nodemailer


Profile Management:
Updates via /api/profile
Strict validation before saving


Error Handling:
Consistent JSON error responses
Server logs with stack traces
Client-friendly error messages

Status codes:
400: Validation errors
401: Auth failures
404: Not found
500: Server errors






LETS DIVE INTO THE FRONTEND PART


Application Structure
Main Directories:
components/: Reusable UI components
pages/: Main page components
context/: React context providers
styles/: CSS files

Key Architectural Patterns:
Component-based architecture
Context API for state management
React Router for navigation
Modular CSS styling
Axios for API calls


Core Components
1. Navbar (Navbar.js)
Features:
Responsive design with mobile menu
Dynamic links based on auth state
Theme toggle (light/dark)
User dropdown menu
Active route highlighting

Key Props/State:
isLoggedIn: Tracks authentication state
isMobileMenuOpen: Controls mobile menu visibility
activeDropdown: Manages open dropdowns

2. ContestCard (ContestCard.js)
Features:
Displays contest details (name, platform, time)
Countdown timer component
Bookmark functionality
Reminder setting with email form
Platform-specific styling

Key Props:
contest: Contest data object
isBookmarked: Bookmark state
onBookmarkToggle: Bookmark handler

3. BookmarkCard (BookmarkCard.js)
Features:
Visual distinction between upcoming/past contests
Countdown timer for upcoming contests
Action buttons (delete, share, set reminder)
Platform badges with colors


5. ProfilePage (Profile.js)
Features:
User profile display with stats
Platform connection management
Activity heatmap visualization
Problem breakdown charts
Data refresh functionality

Pages
1. Home (Home.js)
Features:
Hero section with call-to-action
Upcoming contests preview
Feature highlights grid

Platform filtering

2. AllContests (AllContests.js)
Features:
Complete contest listing
Platform filtering
Upcoming/Past tabs
Pagination controls

3. Bookmarks (BookmarksPage.js)
Features:
Organized by upcoming/past contests
Uses BookmarkContext
Bookmark management

4. Authentication (Login.js, Signup.js)
Features:
Multi-step signup with OTP
Form validation
Password requirements
Error handling

5. AddPlatform (AddPlatform.js)
Features:
Platform connection interface
CRUD operations for platforms
Form validation
Success/error feedback

Context & State Management
BookmarkContext (BookmarkContext.js)
Functionality:
Manages bookmarked contests
Persists to localStorage

Provides:
bookmarkedContests: Array of contests
toggleBookmark: Add/remove function

Implementation:

javascript
const [bookmarkedContests, setBookmarkedContests] = useState([]);

// Persists to localStorage
useEffect(() => {
  localStorage.setItem('bookmarkedContests', JSON.stringify(bookmarkedContests));
}, [bookmarkedContests]);
Routing
App Router (App.js)
Routes:

/: Home page
/login: Authentication
/signup: Registration
/allcontests: Contest browser
/bookmark: Saved contests
/profile: User profile
/addplatform: Platform management
/study-plan: AI-powered study plan generator (NEW)

Protected Routes:
Profile, Bookmarks, etc. implicitly protected by checking auth token

Styling Approach
Methodology:
Component-scoped CSS files
Modular class names
Flexbox/Grid layouts
Responsive design principles

Key Techniques:
CSS variables for theming
Utility classes for common patterns
Mobile-first approach
Animation for interactive elements

API Integration
Key Endpoints Consumed:
Auth: /api/auth/login, /api/auth/register
Contests: /api/contests
Platforms: /api/platform
Profile: /api/profile
Reminders: /api/send-reminder

Axios Configuration:
Base URL: http://localhost:5000

Auth headers:

javascript
headers: {
  'x-auth-token': localStorage.getItem('token')
}
Error Handling:
Consistent error messages
Token expiration handling
Loading states

Key Features
1. Contest Management
Browse upcoming/past contests
Bookmark favorites
Set email reminders
Platform filtering



2. User Profile
Connected platforms display
Performance statistics
Activity visualization
Problem breakdowns

3. Authentication Flow
Email verification (OTP)
Password requirements
Session persistence
Protected routes


4. Platform Integration
Add/remove coding platforms
Handle validation
Automatic profile URLs
Stats tracking







📈 Usage
Register/Login: Create an account or log in with existing credentials.

Dashboard: View your current coding streak and historical data.

Analytics: Analyze your coding patterns and identify areas for improvement.

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch:

bash
Copy
Edit
git checkout -b feature/your-feature-name
Commit your changes:

bash
Copy
Edit
git commit -m "Add your message here"
Push to the branch:

bash
Copy
Edit
git push origin feature/your-feature-name
Open a pull request.

📬 Contact
For any inquiries or feedback, please reach out to your-email@example.com.
