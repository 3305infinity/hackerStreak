import requests
import json
import time
from flask import Flask, jsonify

app = Flask(__name__)

def get_leetcode_user_stats(username):
    """
    Fetch user statistics from LeetCode GraphQL API with improved error handling and fallback methods
    """
    try:
        # LeetCode GraphQL endpoint
        url = "https://leetcode.com/graphql"

        # Updated query for user profile data (more comprehensive)
        query = """
        query userProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    realName
                    aboutMe
                    userAvatar
                    reputation
                    ranking
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                    totalSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
                problemsSolvedBeatsStats {
                    difficulty
                    percentage
                }
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
                badges {
                    id
                    displayName
                }
                upcomingBadges {
                    name
                    icon
                }
                activeBadge {
                    id
                    displayName
                }
            }
        }
        """

        payload = {
            "query": query,
            "variables": {"username": username}
        }

        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://leetcode.com/',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://leetcode.com',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin'
        }

        # Add retry logic with exponential backoff
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = requests.post(url, json=payload, headers=headers, timeout=15)
                response.raise_for_status()
                break
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    raise e
                time.sleep(2 ** attempt)  # Exponential backoff

        data = response.json()

        # Check for API errors
        if 'errors' in data:
            print(f"LeetCode API errors for {username}: {data['errors']}")
            return None

        if 'data' not in data or 'matchedUser' not in data['data'] or not data['data']['matchedUser']:
            print(f"User {username} not found on LeetCode")
            return None

        user_data = data['data']['matchedUser']

        # Extract submission stats with better error handling
        submit_stats = user_data.get('submitStats', {}).get('acSubmissionNum', [])
        total_submissions = user_data.get('submitStats', {}).get('totalSubmissionNum', [])

        # Calculate total solved problems
        total_solved = 0
        total_attempted = 0
        problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}
        attempted_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

        for stat in submit_stats:
            difficulty = stat.get('difficulty', '').lower()
            count = stat.get('count', 0)
            total_solved += count
            if difficulty in problem_breakdown:
                problem_breakdown[difficulty] = count

        for stat in total_submissions:
            difficulty = stat.get('difficulty', '').lower()
            count = stat.get('count', 0)
            total_attempted += count
            if difficulty in attempted_breakdown:
                attempted_breakdown[difficulty] = count

        # Get ranking
        ranking = user_data.get('profile', {}).get('ranking')

        # Get reputation
        reputation = user_data.get('profile', {}).get('reputation')

        # Get beats stats for additional insights
        beats_stats = user_data.get('problemsSolvedBeatsStats', [])

        # Calculate acceptance rate
        acceptance_rate = (total_solved / total_attempted * 100) if total_attempted > 0 else 0

        return {
            'platform': 'LeetCode',
            'handle': username,
            'rating': None,  # LeetCode doesn't have traditional rating
            'rank': ranking,
            'reputation': reputation,
            'solvedProblems': total_solved,
            'totalAttempted': total_attempted,
            'acceptanceRate': round(acceptance_rate, 2),
            'problemBreakdown': problem_breakdown,
            'attemptedBreakdown': attempted_breakdown,
            'profileUrl': f'https://leetcode.com/{username}',
            'success': True,
            'lastUpdated': time.time()
        }

    except requests.exceptions.Timeout:
        print(f"Timeout error fetching LeetCode data for {username}")
        return None
    except requests.exceptions.ConnectionError:
        print(f"Connection error fetching LeetCode data for {username}")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching LeetCode data for {username}: {e}")
        return None
    except json.JSONDecodeError:
        print(f"JSON decode error for LeetCode data for {username}")
        return None
    except Exception as e:
        print(f"Unexpected error fetching LeetCode data for {username}: {e}")
        return None

@app.route('/api/leetcode/user/<username>', methods=['GET'])
def get_user_stats(username):
    stats = get_leetcode_user_stats(username)
    if stats:
        return jsonify(stats)
    else:
        return jsonify({'error': 'User not found or API error'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)
