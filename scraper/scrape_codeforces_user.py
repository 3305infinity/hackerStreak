import requests
import json
from flask import Flask, jsonify

app = Flask(__name__)

def get_codeforces_user_stats(username):
    """
    Fetch user statistics from CodeForces API
    """
    try:
        # CodeForces API endpoint for user info
        url = f"https://codeforces.com/api/user.info?handles={username}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if data['status'] != 'OK' or not data['result']:
            return None

        user_info = data['result'][0]

        # Get rating and rank
        rating = user_info.get('rating')
        max_rating = user_info.get('maxRating')
        rank = user_info.get('rank')
        max_rank = user_info.get('maxRank')

        # Get submission stats
        submissions_url = f"https://codeforces.com/api/user.status?handle={username}&from=1&count=10000"
        submissions_response = requests.get(submissions_url, timeout=10)
        submissions_response.raise_for_status()

        submissions_data = submissions_response.json()

        if submissions_data['status'] != 'OK':
            return None

        submissions = submissions_data['result']

        # Count solved problems by difficulty
        solved_problems = set()
        problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

        for submission in submissions:
            if submission['verdict'] == 'OK':
                problem = submission['problem']
                problem_id = f"{problem['contestId']}{problem['index']}"

                if problem_id not in solved_problems:
                    solved_problems.add(problem_id)

                    # Classify by rating (CodeForces difficulty proxy)
                    rating = problem.get('rating')
                    if rating:
                        if rating < 1200:
                            problem_breakdown['easy'] += 1
                        elif rating < 1600:
                            problem_breakdown['medium'] += 1
                        else:
                            problem_breakdown['hard'] += 1

        total_solved = len(solved_problems)

        return {
            'platform': 'Codeforces',
            'handle': username,
            'rating': rating,
            'maxRating': max_rating,
            'rank': rank,
            'maxRank': max_rank,
            'solvedProblems': total_solved,
            'problemBreakdown': problem_breakdown,
            'profileUrl': f'https://codeforces.com/profile/{username}',
            'success': True
        }

    except Exception as e:
        print(f"Error fetching CodeForces data for {username}: {e}")
        return None

@app.route('/api/codeforces/user/<username>', methods=['GET'])
def get_user_stats(username):
    stats = get_codeforces_user_stats(username)
    if stats:
        return jsonify(stats)
    else:
        return jsonify({'error': 'User not found or API error'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
