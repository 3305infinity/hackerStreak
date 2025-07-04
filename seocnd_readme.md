
# 🚀 HackStreak

**HackStreak** is a full-stack web application that helps developers track their coding streaks, monitor contest performance, and stay consistent with daily problem-solving.

---

## 📌 Features

- 🔥 **Streak Tracking** – Monitor daily coding activity
- 📊 **Analytics Dashboard** – Problem breakdowns, heatmaps, ratings
- 🧠 **Contest Management** – Browse, bookmark, and get email reminders
- 🔐 **Secure Authentication** – OTP-based signup and JWT login
- 🌐 **Platform Stats Integration** – Codeforces, LeetCode & more
- 📱 **Responsive UI** – Seamless experience across devices

---

## 🛠️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React.js, Axios, React Router |
| Backend     | Node.js, Express.js           |
| Database    | MongoDB, Mongoose             |
| Scraping    | Node.js Scripts               |
| Email       | Nodemailer (SMTP)             |
| Auth        | JWT, Bcrypt, OTP Verification |

---

## 📁 Project Structure

```
hackStreak/
├── backend/        # Express server, routes, models
├── frontend/       # React client
├── scraper/        # Scraping logic for contests
├── .gitignore
└── README.md
```

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/3305infinity/hackStreak.git
cd hackStreak
```

### Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

### Environment Setup

Create a `.env` file inside `/backend/` with:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### Run the App

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd ../frontend
npm start
```

---

## 🔧 Backend Overview

### Main Routes

- `POST /api/auth/send-otp` – Send OTP for email verification
- `POST /api/auth/register` – Register with OTP
- `POST /api/auth/login` – Login
- `GET /api/contests` – Fetch contests
- `POST /api/platform` – Add platform handle
- `GET /api/profile` – Get/update profile
- `POST /api/send-reminder` – Send contest reminder email

### Models

- **User**: name, email, password, platforms, stats, social links
- **Platform**: handle, platform name, ratings, problem stats
- **Validation**: URLs, regex handles, uniqueness

---

## 🎨 Frontend Overview

### Key Pages

- `/` – Home
- `/allcontests` – All coding contests
- `/bookmark` – Saved contests
- `/profile` – User profile with charts
- `/addplatform` – Connect handles
- `/login`, `/signup` – Auth flow

### Components

- **Navbar** – Responsive with dropdowns
- **ContestCard** – Countdown, bookmark, reminder
- **BookmarkCard** – Past/upcoming, platform badge
- **Profile** – Heatmap, stats, problem chart
- **Forms** – OTP auth, platform input validation

### State Management

- `BookmarkContext` – Bookmark persistence
- `AuthContext` – Auth session tracking

---

## 🌐 Scraper Directory

Custom scripts to fetch contest data from:

- Codeforces
- LeetCode
- CodeChef *(extendable)*

Run manually or via cron job for updates.

---

## 📬 Email Service

- Contest reminders (platform, time, link)
- OTP delivery (HTML styled, 10-min expiry)
- SMTP-based using Nodemailer
- Error handling + fallback

---

## 📈 Usage

- **Signup/Login** – Email + OTP verification
- **Connect Platforms** – Validate handles
- **Explore Contests** – Browse, bookmark, filter
- **Set Reminders** – Email notifications
- **Track Progress** – Charts, streaks, stats

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
git checkout -b feature/your-feature-name
# Make your changes
git commit -m "Add feature: XYZ"
git push origin feature/your-feature-name
# Open a pull request 🎉
```

---

## 📬 Contact

For questions or feedback, feel free to reach out at:

📧 your-email@example.com  
🔗 [LinkedIn](https://linkedin.com/in/your-profile)  
🐙 [GitHub](https://github.com/3305infinity)

---

> Made with 💻 + ☕ by Team HackStreak
