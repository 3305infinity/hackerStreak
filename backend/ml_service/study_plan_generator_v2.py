import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os
import json
from datetime import datetime

class StudyPlanGenerator:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoders = {}
        self.models_dir = os.path.join(os.path.dirname(__file__), 'ml_service', 'models')

        # Ensure models directory exists
        os.makedirs(self.models_dir, exist_ok=True)

    def load_training_data(self):
        """Load and preprocess training data"""
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'training_data.csv')

        if not os.path.exists(data_path):
            print(f"Training data not found at {data_path}")
            return None

        df = pd.read_csv(data_path)

        # Handle missing values
        df = df.fillna({
            'rating': df['rating'].median(),
            'max_rating': df['max_rating'].median(),
            'solved_problems': 0,
            'easy_count': 0,
            'medium_count': 0,
            'hard_count': 0
        })

        return df

    def preprocess_data(self, df):
        """Preprocess data for training"""
        # Encode categorical variables
        categorical_cols = ['platform', 'current_rank', 'target_rank']
        for col in categorical_cols:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                df[col] = self.label_encoders[col].fit_transform(df[col])

        # Features for training
        feature_cols = ['rating', 'max_rating', 'solved_problems', 'easy_count', 'medium_count', 'hard_count', 'platform']
        X = df[feature_cols]

        # Target variable
        y = df['recommended_topic']

        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        return X_scaled, y

    def train_model(self):
        """Train the study plan recommendation model"""
        print("Loading training data...")
        df = self.load_training_data()

        if df is None:
            print("No training data available. Skipping model training.")
            return False

        print("Preprocessing data...")
        X, y = self.preprocess_data(df)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train model
        print("Training model...")
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)

        # Evaluate model
        y_pred = self.model.predict(X_test)
        print("Model evaluation:")
        print(classification_report(y_test, y_pred))

        # Save model and preprocessors
        self.save_model()

        return True

    def save_model(self):
        """Save trained model and preprocessors"""
        if self.model:
            joblib.dump(self.model, os.path.join(self.models_dir, 'study_plan_model.pkl'))
        if self.scaler:
            joblib.dump(self.scaler, os.path.join(self.models_dir, 'scaler.pkl'))
        if self.label_encoders:
            joblib.dump(self.label_encoders, os.path.join(self.models_dir, 'label_encoders.pkl'))

        print("Model and preprocessors saved successfully.")

    def load_model(self):
        """Load trained model and preprocessors"""
        model_path = os.path.join(self.models_dir, 'study_plan_model.pkl')
        scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
        encoders_path = os.path.join(self.models_dir, 'label_encoders.pkl')

        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)
        if os.path.exists(encoders_path):
            self.label_encoders = joblib.load(encoders_path)

        return self.model is not None

    def generate_study_plan(self, user_data):
        """Generate personalized study plan based on user data"""
        if not self.model:
            if not self.load_model():
                return {"error": "Model not available. Please train the model first."}

        # Prepare user data for prediction
        user_df = pd.DataFrame([user_data])

        # Encode categorical variables
        for col, encoder in self.label_encoders.items():
            if col in user_df.columns:
                try:
                    user_df[col] = encoder.transform(user_df[col])
                except ValueError:
                    # Handle unseen categories
                    user_df[col] = encoder.transform([encoder.classes_[0]])[0]

        # Scale features
        feature_cols = ['rating', 'max_rating', 'solved_problems', 'easy_count', 'medium_count', 'hard_count', 'platform']
        X = user_df[feature_cols]
        X_scaled = self.scaler.transform(X)

        # Make prediction
        predicted_topic = self.model.predict(X_scaled)[0]

        # Generate study plan based on prediction
        study_plan = self.create_study_plan(predicted_topic, user_data)

        return study_plan

    def create_study_plan(self, topic, user_data):
        """Create detailed study plan for the recommended topic"""
        topic_plans = {
            'DP': {
                'name': 'Dynamic Programming',
                'description': 'Master dynamic programming techniques',
                'duration_weeks': 4,
                'topics': [
                    '1D DP', '2D DP', 'Knapsack Problems',
                    'Longest Common Subsequence', 'Matrix Chain Multiplication'
                ],
                'resources': [
                    'GeeksforGeeks DP articles',
                    'LeetCode DP tagged problems',
                    'CLRS Chapter 15'
                ]
            },
            'Graphs': {
                'name': 'Graph Algorithms',
                'description': 'Learn graph traversal and algorithms',
                'duration_weeks': 3,
                'topics': [
                    'DFS/BFS', 'Shortest Paths', 'Minimum Spanning Tree',
                    'Topological Sort', 'Strongly Connected Components'
                ],
                'resources': [
                    'GeeksforGeeks Graph algorithms',
                    'LeetCode Graph tagged problems',
                    'Introduction to Algorithms'
                ]
            },
            'Greedy': {
                'name': 'Greedy Algorithms',
                'description': 'Understand greedy algorithm design',
                'duration_weeks': 2,
                'topics': [
                    'Activity Selection', 'Huffman Coding',
                    'Fractional Knapsack', 'Job Scheduling'
                ],
                'resources': [
                    'GeeksforGeeks Greedy algorithms',
                    'LeetCode Greedy tagged problems'
                ]
            },
            'Math': {
                'name': 'Mathematical Algorithms',
                'description': 'Build mathematical problem-solving skills',
                'duration_weeks': 3,
                'topics': [
                    'Number Theory', 'Combinatorics', 'Probability',
                    'Game Theory', 'Linear Algebra basics'
                ],
                'resources': [
                    'GeeksforGeeks Mathematical algorithms',
                    'LeetCode Math tagged problems'
                ]
            },
            'Strings': {
                'name': 'String Algorithms',
                'description': 'Master string manipulation techniques',
                'duration_weeks': 2,
                'topics': [
                    'String Matching', 'Trie', 'Suffix Arrays',
                    'Manacher\'s Algorithm', 'Z-algorithm'
                ],
                'resources': [
                    'GeeksforGeeks String algorithms',
                    'LeetCode String tagged problems'
                ]
            },
            'DataStructures': {
                'name': 'Advanced Data Structures',
                'description': 'Learn advanced data structure implementations',
                'duration_weeks': 4,
                'topics': [
                    'Segment Trees', 'Fenwick Trees', 'Disjoint Sets',
                    'Trie', 'Suffix Tree', 'AVL Trees'
                ],
                'resources': [
                    'GeeksforGeeks Advanced DS',
                    'LeetCode data structure problems'
                ]
            },
            'BinarySearch': {
                'name': 'Binary Search and Applications',
                'description': 'Master binary search techniques',
                'duration_weeks': 2,
                'topics': [
                    'Basic Binary Search', 'Search in Rotated Array',
                    'Search in 2D Matrix', 'Median of Arrays'
                ],
                'resources': [
                    'GeeksforGeeks Binary Search',
                    'LeetCode Binary Search tagged problems'
                ]
            },
            'Misc': {
                'name': 'Miscellaneous Topics',
                'description': 'Cover remaining important topics',
                'duration_weeks': 2,
                'topics': [
                    'Bit Manipulation', 'Backtracking', 'Two Pointers',
                    'Sliding Window', 'Divide and Conquer'
                ],
                'resources': [
                    'GeeksforGeeks various topics',
                    'LeetCode mixed problems'
                ]
            }
        }

        plan = topic_plans.get(topic, topic_plans['Misc'])
        plan['recommended_topic'] = topic
        plan['generated_at'] = datetime.now().isoformat()
        plan['user_rating'] = user_data.get('rating', 'Unknown')

        return plan

def main():
    """Main function to train and test the model"""
    generator = StudyPlanGenerator()

    # Train model
    print("Training study plan generator...")
    success = generator.train_model()

    if success:
        print("Model trained successfully!")

        # Test with sample data
        sample_user = {
            'rating': 1500,
            'max_rating': 1600,
            'solved_problems': 200,
            'easy_count': 50,
            'medium_count': 120,
            'hard_count': 30,
            'platform': 'Codeforces',
            'current_rank': 'Specialist',
            'target_rank': 'Expert'
        }

        print("Generating sample study plan...")
        plan = generator.generate_study_plan(sample_user)
        print(json.dumps(plan, indent=2))
    else:
        print("Model training failed.")

if __name__ == "__main__":
    main()
