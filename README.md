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
Frontend:

bash
Copy
Edit
cd ../frontend
npm start
The frontend will be available at http://localhost:3000, and the backend API will run on http://localhost:5000.

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
