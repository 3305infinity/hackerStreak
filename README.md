HackStreak
HackStreak is a full stack web application designed to track and visualize coding streaks, helping developers maintain consistent coding habits and monitor their progress over time.

🚀 Features
Streak Tracking: Monitor daily coding activities and maintain streaks.

Data Visualization: Graphical representation of coding patterns and streaks.

User Authentication: Secure login and registration system.

Responsive Design: Optimized for various devices and screen sizes.

🛠️ Tech Stack
Frontend: React.js (bootstrapped with Create React App)

Backend: Node.js, Express.js

Database: MongoDB

Web Scraping: Custom scripts (located in the scraper directory)

📂 Project Structure
bash
Copy
Edit
hackerStreak/
├── backend/       # Backend server code (Node.js, Express)
├── frontend/      # Frontend application (React.js)
├── scraper/       # Web scraping scripts
├── .gitignore
└── README.md



🧑‍💻 Getting Started
Prerequisites
Node.js (v14 or above)

npm or yarn

MongoDB instance (local or cloud-based)

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/3305infinity/hackerStreak.git
cd hackerStreak
Install dependencies:

Backend:

bash
Copy
Edit
cd backend
npm install
Frontend:

bash
Copy
Edit
cd ../frontend
npm install
Set up environment variables:

Create a .env file in the backend directory with the following content:

env
Copy
Edit
MONGODB_URI=your_mongodb_connection_string
PORT=5000
Run the application:

Backend:

bash
Copy
Edit
cd backend
npm start  


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

📄 License
This project is licensed under the MIT License.

📬 Contact
For any inquiries or feedback, please reach out to your-email@example.com.
