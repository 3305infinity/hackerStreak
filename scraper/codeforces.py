# import requests
# import json
# from datetime import datetime

# def get_codeforces_user_stats(username):
#     """
#     Fetch user statistics from CodeForces API
#     """
#     try:
#         # CodeForces API endpoint for user info
#         url = f"https://codeforces.com/api/user.info?handles={username}"

#         response = requests.get(url, timeout=10)
#         response.raise_for_status()

#         data = response.json()

#         if data['status'] != 'OK' or not data['result']:
#             return None

#         user_info = data['result'][0]

#         # Get rating and rank
#         rating = user_info.get('rating')
#         max_rating = user_info.get('maxRating')
#         rank = user_info.get('rank')
#         max_rank = user_info.get('maxRank')

#         # Get submission stats
#         submissions_url = f"https://codeforces.com/api/user.status?handle={username}&from=1&count=10000"
#         submissions_response = requests.get(submissions_url, timeout=10)
#         submissions_response.raise_for_status()

#         submissions_data = submissions_response.json()

#         if submissions_data['status'] != 'OK':
#             return None

#         submissions = submissions_data['result']

#         # Count solved problems by difficulty
#         solved_problems = set()
#         problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

#         for submission in submissions:
#             if submission['verdict'] == 'OK':
#                 problem = submission['problem']
#                 problem_id = f"{problem['contestId']}{problem['index']}"

#                 if problem_id not in solved_problems:
#                     solved_problems.add(problem_id)

#                     # Classify by rating (CodeForces difficulty proxy)
#                     rating = problem.get('rating')
#                     if rating:
#                         if rating < 1200:
#                             problem_breakdown['easy'] += 1
#                         elif rating < 1600:
#                             problem_breakdown['medium'] += 1
#                         else:
#                             problem_breakdown['hard'] += 1

#         total_solved = len(solved_problems)

#         return {
#             'platform': 'Codeforces',
#             'handle': username,
#             'rating': rating,
#             'maxRating': max_rating,
#             'rank': rank,
#             'maxRank': max_rank,
#             'solvedProblems': total_solved,
#             'problemBreakdown': problem_breakdown,
#             'profileUrl': f'https://codeforces.com/profile/{username}',
#             'success': True
#         }

#     except Exception as e:
#         print(f"Error fetching CodeForces data for {username}: {e}")
#         return None

# def get_codeforces_contests():
#     """
#     Fetch upcoming and recent contests from CodeForces API
#     """
#     try:
#         # Get upcoming contests
#         upcoming_url = "https://codeforces.com/api/contest.list?gym=false"
#         response = requests.get(upcoming_url, timeout=10)
#         response.raise_for_status()

#         data = response.json()

#         if data['status'] != 'OK':
#             return []

#         contests = data['result']

#         upcoming_contests = []
#         past_contests = []

#         for contest in contests:
#             contest_data = {
#                 'platform': 'Codeforces',
#                 'contestId': contest['id'],
#                 'name': contest['name'],
#                 'startTimeSeconds': contest['startTimeSeconds'],
#                 'durationSeconds': contest['durationSeconds'],
#                 'phase': contest['phase'],
#                 'url': f"https://codeforces.com/contest/{contest['id']}"
#             }

#             # Convert timestamp to ISO format
#             if contest['startTimeSeconds']:
#                 start_time = datetime.fromtimestamp(contest['startTimeSeconds'])
#                 contest_data['startTime'] = start_time.isoformat()

#             # Convert duration to hours/minutes
#             if contest['durationSeconds']:
#                 hours = contest['durationSeconds'] // 3600
#                 minutes = (contest['durationSeconds'] % 3600) // 60
#                 contest_data['duration'] = f"{hours}h {minutes}m"

#             if contest['phase'] == 'BEFORE':
#                 upcoming_contests.append(contest_data)
#             else:
#                 past_contests.append(contest_data)

#         return {
#             'upcoming': upcoming_contests,
#             'past': past_contests[:20]  # Limit past contests to 20
#         }

#     except Exception as e:
#         print(f"Error fetching CodeForces contests: {e}")
#         return {'upcoming': [], 'past': []}


import requests
import json
from datetime import datetime, timezone
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_codeforces_user_stats(username):
    """
    Fetch user statistics from CodeForces API
    """
    try:
        # CodeForces API endpoint for user info
        url = f"https://codeforces.com/api/user.info?handles={username}"
        
        logger.info(f"Fetching Codeforces user data for: {username}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if data['status'] != 'OK' or not data['result']:
            logger.warning(f"User {username} not found on Codeforces")
            return None

        user_info = data['result'][0]

        # Get rating and rank
        rating = user_info.get('rating')
        max_rating = user_info.get('maxRating')
        rank = user_info.get('rank', 'Unrated')
        max_rank = user_info.get('maxRank', 'Unrated')

        # Get submission stats
        logger.info(f"Fetching submission history for: {username}")
        submissions_url = f"https://codeforces.com/api/user.status?handle={username}&from=1&count=10000"
        submissions_response = requests.get(submissions_url, timeout=15)
        submissions_response.raise_for_status()

        submissions_data = submissions_response.json()

        if submissions_data['status'] != 'OK':
            logger.warning(f"Could not fetch submissions for {username}")
            return None

        submissions = submissions_data['result']

        # Count solved problems by difficulty
        solved_problems = set()
        problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

        for submission in submissions:
            if submission.get('verdict') == 'OK':
                problem = submission.get('problem', {})
                contest_id = problem.get('contestId', '')
                problem_index = problem.get('index', '')
                problem_id = f"{contest_id}{problem_index}"

                if problem_id not in solved_problems and contest_id and problem_index:
                    solved_problems.add(problem_id)

                    # Classify by rating (CodeForces difficulty proxy)
                    prob_rating = problem.get('rating')
                    if prob_rating:
                        if prob_rating < 1200:
                            problem_breakdown['easy'] += 1
                        elif prob_rating < 1600:
                            problem_breakdown['medium'] += 1
                        else:
                            problem_breakdown['hard'] += 1

        total_solved = len(solved_problems)
        
        logger.info(f"Successfully fetched data for {username}: {total_solved} problems solved")

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

    except requests.exceptions.Timeout:
        logger.error(f"Timeout error fetching Codeforces data for {username}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error fetching Codeforces data for {username}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching Codeforces data for {username}: {e}")
        return None

def get_codeforces_contests():
    """
    Fetch upcoming and recent contests from CodeForces API
    """
    try:
        logger.info("Fetching Codeforces contests...")
        
        # Get all contests
        url = "https://codeforces.com/api/contest.list?gym=false"
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if data['status'] != 'OK':
            logger.error("Failed to fetch Codeforces contests")
            return {'upcoming': [], 'past': []}

        contests = data['result']

        upcoming_contests = []
        past_contests = []
        current_time = datetime.now(timezone.utc).timestamp()

        for contest in contests:
            try:
                contest_start = contest.get('startTimeSeconds', 0)
                contest_duration = contest.get('durationSeconds', 0)
                contest_end = contest_start + contest_duration
                
                contest_data = {
                    'platform': 'Codeforces',
                    'contestId': contest['id'],
                    'name': contest['name'],
                    'startTimeSeconds': contest_start,
                    'durationSeconds': contest_duration,
                    'phase': contest['phase'],
                    'url': f"https://codeforces.com/contest/{contest['id']}",
                    'type': contest.get('type', 'Unknown')
                }

                # Convert timestamp to ISO format
                if contest_start:
                    start_time = datetime.fromtimestamp(contest_start, tz=timezone.utc)
                    contest_data['startTime'] = start_time.isoformat()
                    
                    end_time = datetime.fromtimestamp(contest_end, tz=timezone.utc)
                    contest_data['endTime'] = end_time.isoformat()

                # Convert duration to readable format
                if contest_duration:
                    hours = contest_duration // 3600
                    minutes = (contest_duration % 3600) // 60
                    contest_data['duration'] = f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"

                # Categorize as upcoming or past
                if contest['phase'] == 'BEFORE':
                    upcoming_contests.append(contest_data)
                elif contest['phase'] in ['FINISHED', 'CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST']:
                    past_contests.append(contest_data)
                    
            except Exception as e:
                logger.error(f"Error processing Codeforces contest: {e}")
                continue

        # Sort contests
        upcoming_contests.sort(key=lambda x: x.get('startTimeSeconds', 0))
        past_contests.sort(key=lambda x: x.get('startTimeSeconds', 0), reverse=True)
        
        logger.info(f"Fetched {len(upcoming_contests)} upcoming and {len(past_contests)} past Codeforces contests")

        return {
            'upcoming': upcoming_contests,
            'past': past_contests[:30]  # Limit past contests to 30
        }

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error fetching Codeforces contests: {e}")
        return {'upcoming': [], 'past': []}
    except Exception as e:
        logger.error(f"Unexpected error fetching Codeforces contests: {e}")
        return {'upcoming': [], 'past': []}