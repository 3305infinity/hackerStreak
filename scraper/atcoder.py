# import requests
# from bs4 import BeautifulSoup
# import json
# from datetime import datetime, timedelta
# import pytz
# import re
# import logging

# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# def get_atcoder_user_stats(username):
#     """
#     Fetch user statistics from AtCoder profile page
#     """
#     try:
#         url = f"https://atcoder.jp/users/{username}"

#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
#             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
#             'Accept-Language': 'en-US,en;q=0.5',
#             'DNT': '1',
#             'Connection': 'keep-alive',
#             'Upgrade-Insecure-Requests': '1',
#             'Cache-Control': 'max-age=0'
#         }

#         response = requests.get(url, headers=headers, timeout=15)
#         response.raise_for_status()

#         soup = BeautifulSoup(response.text, 'html.parser')

#         # Check if user exists
#         if "ユーザーが見つかりません" in response.text or soup.find('title').text.strip() == "AtCoder":
#             return None

#         # Extract rating
#         rating = None
#         rating_element = soup.find('table', class_='dl-table')
#         if rating_element:
#             rows = rating_element.find_all('tr')
#             for row in rows:
#                 th = row.find('th')
#                 td = row.find('td')
#                 if th and td and 'Rating' in th.text:
#                     rating_text = td.text.strip()
#                     rating_match = re.search(r'\d+', rating_text)
#                     if rating_match:
#                         rating = int(rating_match.group())
#                     break

#         # Extract rank (AtCoder doesn't have global rank like Codeforces)
#         rank = None

#         # Extract solved problems count
#         solved_problems = 0
#         # AtCoder shows solved problems in the submissions table
#         # We'll count unique accepted problems

#         # Get submission history to count solved problems
#         submissions_url = f"https://atcoder.jp/contests"
#         try:
#             submissions_response = requests.get(submissions_url, headers=headers, timeout=15)
#             if submissions_response.status_code == 200:
#                 # This is a rough estimate - AtCoder doesn't show total solved count prominently
#                 solved_problems = 0  # We'll set this to 0 for now as it's hard to extract
#         except:
#             pass

#         # AtCoder doesn't have easy/medium/hard breakdown like LeetCode
#         problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

#         return {
#             'platform': 'AtCoder',
#             'handle': username,
#             'rating': rating,
#             'rank': rank,
#             'solvedProblems': solved_problems,
#             'problemBreakdown': problem_breakdown,
#             'profileUrl': f'https://atcoder.jp/users/{username}',
#             'success': True
#         }

#     except Exception as e:
#         print(f"Error fetching AtCoder data for {username}: {e}")
#         return None

# def get_atcoder_contests():
#     """
#     Scrape AtCoder website to get information about upcoming contests.
#     Returns a list of dictionaries with contest details.
#     """
#     # URL for AtCoder's contest page
#     url = "https://atcoder.jp/contests"

#     try:
#         # Send HTTP request with a more browser-like User-Agent
#         logger.info(f"Fetching data from {url}")
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
#             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
#             'Accept-Language': 'en-US,en;q=0.5',
#             'DNT': '1',
#             'Connection': 'keep-alive',
#             'Upgrade-Insecure-Requests': '1',
#             'Cache-Control': 'max-age=0'
#         }
#         response = requests.get(url, headers=headers, timeout=15)
#         response.raise_for_status()  # Raise exception for HTTP errors

#         # Parse HTML content
#         soup = BeautifulSoup(response.text, 'html.parser')

#         contests = []

#         # Find upcoming contests table
#         upcoming_table = soup.find('div', id='contest-table-upcoming')
#         if upcoming_table:
#             tbody = upcoming_table.find('tbody')
#             if tbody:
#                 rows = tbody.find_all('tr')
#                 for row in rows:
#                     try:
#                         cols = row.find_all('td')
#                         if len(cols) >= 4:
#                             # Extract contest details
#                             time_element = cols[0].find('time')
#                             start_time_str = time_element['datetime'] if time_element else cols[0].text.strip()

#                             contest_link = cols[1].find('a')
#                             contest_name = contest_link.text.strip() if contest_link else cols[1].text.strip()
#                             contest_code = contest_link['href'].split('/')[-1] if contest_link else ""

#                             duration = cols[2].text.strip()
#                             rated_for = cols[3].text.strip() if len(cols) > 3 else ""

#                             # Parse start time
#                             try:
#                                 # AtCoder uses ISO format in datetime attribute
#                                 if time_element and 'datetime' in time_element.attrs:
#                                     start_time = time_element['datetime']
#                                 else:
#                                     # Fallback parsing
#                                     start_time = start_time_str
#                             except:
#                                 start_time = start_time_str

#                             contests.append({
#                                 'contest_name': contest_name,
#                                 'contest_code': contest_code,
#                                 'start_time': start_time,
#                                 'end_time': "",  # AtCoder doesn't show end time directly
#                                 'duration': duration,
#                                 'contest_link': f"https://atcoder.jp{contest_link['href']}" if contest_link else "",
#                                 'rated_for': rated_for
#                             })
#                             logger.info(f"Extracted upcoming contest: {contest_name}")
#                     except Exception as e:
#                         logger.error(f"Error processing upcoming contest row: {e}")
#                         continue

#         # Find recent contests table for past contests
#         recent_table = soup.find('div', id='contest-table-recent')
#         past_contests = []
#         if recent_table:
#             tbody = recent_table.find('tbody')
#             if tbody:
#                 rows = tbody.find_all('tr')
#                 for row in rows[:10]:  # Get last 10 recent contests
#                     try:
#                         cols = row.find_all('td')
#                         if len(cols) >= 4:
#                             time_element = cols[0].find('time')
#                             start_time_str = time_element['datetime'] if time_element else cols[0].text.strip()

#                             contest_link = cols[1].find('a')
#                             contest_name = contest_link.text.strip() if contest_link else cols[1].text.strip()
#                             contest_code = contest_link['href'].split('/')[-1] if contest_link else ""

#                             duration = cols[2].text.strip()
#                             rated_for = cols[3].text.strip() if len(cols) > 3 else ""

#                             try:
#                                 if time_element and 'datetime' in time_element.attrs:
#                                     start_time = time_element['datetime']
#                                 else:
#                                     start_time = start_time_str
#                             except:
#                                 start_time = start_time_str

#                             past_contests.append({
#                                 'contest_name': contest_name,
#                                 'contest_code': contest_code,
#                                 'start_time': start_time,
#                                 'end_time': "",
#                                 'duration': duration,
#                                 'contest_link': f"https://atcoder.jp{contest_link['href']}" if contest_link else "",
#                                 'rated_for': rated_for
#                             })
#                             logger.info(f"Extracted past contest: {contest_name}")
#                     except Exception as e:
#                         logger.error(f"Error processing past contest row: {e}")
#                         continue

#         logger.info(f"Successfully fetched {len(contests)} upcoming contests and {len(past_contests)} past contests")
#         return {'upcoming': contests, 'past': past_contests}

#     except requests.exceptions.RequestException as e:
#         logger.error(f"Error fetching data: {e}")
#         return {'upcoming': [], 'past': []}
#     except Exception as e:
#         logger.error(f"Error processing data: {e}")
#         return {'upcoming': [], 'past': []}


import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import re
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_atcoder_user_stats(username):
    """
    Fetch user statistics from AtCoder profile page
    """
    try:
        logger.info(f"Fetching AtCoder user data for: {username}")
        
        url = f"https://atcoder.jp/users/{username}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }

        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Check if user exists
        if "ユーザーが見つかりません" in response.text or "User not found" in response.text:
            logger.warning(f"User {username} not found on AtCoder")
            return None

        # Extract rating
        rating = None
        highest_rating = None
        rank = None
        highest_rank = None
        
        # Find the dl-table which contains user info
        dl_table = soup.find('table', class_='dl-table')
        if dl_table:
            rows = dl_table.find_all('tr')
            for row in rows:
                th = row.find('th')
                td = row.find('td')
                if th and td:
                    header = th.text.strip()
                    value = td.text.strip()
                    
                    if 'Rating' in header:
                        # Extract current rating
                        rating_match = re.search(r'(\d+)', value)
                        if rating_match:
                            rating = int(rating_match.group(1))
                        
                        # Extract highest rating
                        highest_match = re.search(r'Highest:\s*(\d+)', value)
                        if highest_match:
                            highest_rating = int(highest_match.group(1))
                    
                    elif 'Rank' in header:
                        # Extract current rank (color/title like "cyan" or "3 dan")
                        rank = value.split('(')[0].strip() if '(' in value else value
                        
                        # Extract highest rank
                        highest_match = re.search(r'Highest:\s*([^)]+)', value)
                        if highest_match:
                            highest_rank = highest_match.group(1).strip()

        # Get detailed stats from history/json endpoint
        solved_problems = 0
        try:
            # Try to get problem count from user's submission page
            history_url = f"https://atcoder.jp/users/{username}/history/json"
            history_response = requests.get(history_url, headers=headers, timeout=10)
            
            if history_response.status_code == 200:
                history_data = history_response.json()
                # Count unique problems solved
                if isinstance(history_data, list):
                    solved_problems = len(history_data)
        except Exception as e:
            logger.warning(f"Could not fetch submission history: {e}")
            
            # Fallback: scrape from profile page
            try:
                # Look for problem count in various possible locations
                stats_section = soup.find('div', class_='row')
                if stats_section:
                    for elem in stats_section.find_all(['h3', 'h4', 'span', 'div']):
                        text = elem.text.strip()
                        # Look for patterns like "Solved: 123" or "123 problems"
                        match = re.search(r'(\d+)\s*(?:problems?|Solved)', text, re.IGNORECASE)
                        if match:
                            solved_problems = int(match.group(1))
                            break
            except:
                pass

        # Get participation stats
        competitions_participated = 0
        try:
            comp_table = soup.find('table', class_='table')
            if comp_table:
                comp_rows = comp_table.find_all('tr')[1:]  # Skip header
                competitions_participated = len(comp_rows)
        except:
            pass

        # AtCoder doesn't have easy/medium/hard breakdown like LeetCode
        # Instead, problems are rated by difficulty points
        problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}
        
        logger.info(f"Successfully fetched data for {username}: Rating {rating}, {solved_problems} problems solved")

        return {
            'platform': 'AtCoder',
            'handle': username,
            'rating': rating,
            'highestRating': highest_rating,
            'rank': rank,
            'highestRank': highest_rank,
            'solvedProblems': solved_problems,
            'competitionsParticipated': competitions_participated,
            'problemBreakdown': problem_breakdown,
            'profileUrl': f'https://atcoder.jp/users/{username}',
            'success': True
        }

    except requests.exceptions.Timeout:
        logger.error(f"Timeout error fetching AtCoder data for {username}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error fetching AtCoder data for {username}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching AtCoder data for {username}: {e}")
        return None

def get_atcoder_contests():
    """
    Fetch AtCoder contests with improved error handling and multiple fallback methods
    """
    try:
        logger.info("Fetching AtCoder contests...")

        # Try API approach first (if available)
        api_url = "https://atcoder.jp/contests/api/list"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Referer': 'https://atcoder.jp/contests'
        }

        try:
            response = requests.get(api_url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return parse_atcoder_api_response(data)
        except (requests.exceptions.RequestException, json.JSONDecodeError):
            logger.info("AtCoder API not available, falling back to scraping...")

        # Fallback to scraping
        return get_atcoder_contests_scraping()

    except Exception as e:
        logger.error(f"Unexpected error fetching AtCoder contests: {e}")
        return {'upcoming': [], 'past': []}

def parse_atcoder_api_response(data):
    """
    Parse AtCoder API response (if API becomes available)
    """
    upcoming_contests = []
    past_contests = []

    current_time = datetime.now(pytz.UTC)

    for contest in data:
        try:
            start_time_seconds = contest.get('start_epoch_second', 0)
            start_time = datetime.fromtimestamp(start_time_seconds, tz=pytz.UTC)

            contest_info = {
                'platform': 'AtCoder',
                'contest_name': contest.get('title', ''),
                'contest_code': contest.get('id', ''),
                'start_time': start_time.isoformat(),
                'end_time': '',
                'duration': f"{contest.get('duration_second', 0) // 60}m",
                'rated_for': contest.get('rate_change', ''),
                'contest_link': f"https://atcoder.jp/contests/{contest.get('id', '')}"
            }

            if start_time > current_time:
                upcoming_contests.append(contest_info)
            else:
                past_contests.append(contest_info)

        except Exception as e:
            logger.error(f"Error processing AtCoder API contest: {e}")
            continue

    # Sort and limit
    upcoming_contests.sort(key=lambda x: x['start_time'])
    past_contests.sort(key=lambda x: x['start_time'], reverse=True)
    past_contests = past_contests[:50]

    logger.info(f"Successfully fetched {len(upcoming_contests)} upcoming and {len(past_contests)} past AtCoder contests from API")
    return {'upcoming': upcoming_contests, 'past': past_contests}

def get_atcoder_contests_scraping():
    """
    Improved scraping method for AtCoder contests with better error handling
    """
    url = "https://atcoder.jp/contests"

    try:
        logger.info("Scraping AtCoder contests...")

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }

        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        upcoming_contests = []
        past_contests = []

        # Find upcoming contests table with multiple selectors
        upcoming_div = None
        upcoming_selectors = [
            '#contest-table-upcoming',
            '.contest-table-upcoming',
            'div[id*="upcoming"]',
            'div[class*="upcoming"]'
        ]

        for selector in upcoming_selectors:
            upcoming_div = soup.select_one(selector)
            if upcoming_div:
                break

        if upcoming_div:
            tbody = upcoming_div.find('tbody')
            if tbody:
                rows = tbody.find_all('tr')
                for row in rows:
                    try:
                        cols = row.find_all('td')
                        if len(cols) < 4:
                            continue

                        contest_info = extract_atcoder_contest_row(cols)
                        if contest_info:
                            upcoming_contests.append(contest_info)

                    except Exception as e:
                        logger.error(f"Error processing upcoming AtCoder contest row: {e}")
                        continue

        # Find recent/past contests table
        recent_div = None
        recent_selectors = [
            '#contest-table-recent',
            '.contest-table-recent',
            'div[id*="recent"]',
            'div[class*="recent"]'
        ]

        for selector in recent_selectors:
            recent_div = soup.select_one(selector)
            if recent_div:
                break

        if recent_div:
            tbody = recent_div.find('tbody')
            if tbody:
                rows = tbody.find_all('tr')[:30]  # Limit to 30 recent contests
                for row in rows:
                    try:
                        cols = row.find_all('td')
                        if len(cols) < 4:
                            continue

                        contest_info = extract_atcoder_contest_row(cols)
                        if contest_info:
                            past_contests.append(contest_info)

                    except Exception as e:
                        logger.error(f"Error processing past AtCoder contest row: {e}")
                        continue

        logger.info(f"Successfully scraped {len(upcoming_contests)} upcoming and {len(past_contests)} past AtCoder contests")

        return {'upcoming': upcoming_contests, 'past': past_contests}

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error scraping AtCoder contests: {e}")
        return {'upcoming': [], 'past': []}
    except Exception as e:
        logger.error(f"Unexpected error scraping AtCoder contests: {e}")
        return {'upcoming': [], 'past': []}

def extract_atcoder_contest_row(cols):
    """
    Extract contest information from a table row
    """
    try:
        # Extract start time
        time_element = cols[0].find('time')
        if time_element and 'datetime' in time_element.attrs:
            start_time = time_element['datetime']
        else:
            start_time = cols[0].get_text(strip=True)

        # Extract contest name and link
        contest_link = cols[1].find('a')
        if not contest_link:
            return None

        contest_name = contest_link.get_text(strip=True)
        href = contest_link.get('href', '')
        contest_code = href.split('/')[-1] if href else ""
        contest_url = f"https://atcoder.jp{href}" if href.startswith('/') else href

        # Extract duration
        duration = cols[2].get_text(strip=True) if len(cols) > 2 else ""

        # Extract rated range
        rated_for = cols[3].get_text(strip=True) if len(cols) > 3 else ""

        return {
            'platform': 'AtCoder',
            'contest_name': contest_name,
            'contest_code': contest_code,
            'start_time': start_time,
            'end_time': "",  # AtCoder doesn't show end time directly
            'duration': duration,
            'rated_for': rated_for,
            'contest_link': contest_url
        }

    except Exception as e:
        logger.error(f"Error extracting AtCoder contest row: {e}")
        return None
