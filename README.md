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
