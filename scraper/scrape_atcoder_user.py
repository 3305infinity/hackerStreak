import requests
from bs4 import BeautifulSoup
import json
from flask import Flask, jsonify

app = Flask(__name__)

def get_atcoder_user_stats(username):
    """
    Fetch user statistics from AtCoder profile page
    """
    try:
        url = f"https://atcoder.jp/users/{username}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Check if user exists
        if "ユーザーが見つかりません" in response.text or soup.find('title').text.strip() == "AtCoder":
            return None

        # Extract rating
        rating = None
        rating_element = soup.find('div', class_='col-md-3 col-sm-6')
        if rating_element:
            rating_text = rating_element.find('span', class_='user-gray')
            if rating_text:
                rating = int(rating_text.text.strip().replace(',', ''))

        # Extract rank (AtCoder doesn't have global rank like CodeForces)
        rank = None

        # Extract solved problems count
        solved_problems = 0
        # Look for the solved problems section
        solved_section = soup.find('div', class_='col-md-3 col-sm-6')
        if solved_section:
            solved_text = solved_section.find_all('span', class_='user-gray')
            if len(solved_text) > 1:
                solved_problems = int(solved_text[1].text.strip().replace(',', ''))

        # AtCoder doesn't have easy/medium/hard breakdown like LeetCode
        # We'll distribute based on contest participation or leave as is
        problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

        return {
            'platform': 'AtCoder',
            'handle': username,
            'rating': rating,
            'rank': rank,
            'solvedProblems': solved_problems,
            'problemBreakdown': problem_breakdown,
            'profileUrl': f'https://atcoder.jp/users/{username}',
            'success': True
        }

    except Exception as e:
        print(f"Error fetching AtCoder data for {username}: {e}")
        return None

@app.route('/api/atcoder/user/<username>', methods=['GET'])
def get_user_stats(username):
    stats = get_atcoder_user_stats(username)
    if stats:
        return jsonify(stats)
    else:
        return jsonify({'error': 'User not found or scraping error'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007, debug=True)
