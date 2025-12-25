from flask import Flask, jsonify, render_template_string
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import pytz
import logging
import json
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_codechef_user_stats(username):
    """
    Fetch user statistics from CodeChef profile page
    """
    try:
        url = f"https://www.codechef.com/users/{username}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
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
        if "Invalid username" in response.text or soup.find('title').text.strip() == "CodeChef":
            return None

        # Extract rating
        rating = None
        rating_element = soup.find('div', class_='rating-number')
        if rating_element:
            rating = int(rating_element.text.strip())

        # Extract global rank
        rank = None
        rank_element = soup.find('div', class_='rating-ranks')
        if rank_element:
            rank_items = rank_element.find_all('a')
            for item in rank_items:
                if 'Global Rank' in item.text:
                    rank = int(item.find('strong').text.strip().replace(',', ''))
                    break

        # Extract solved problems count
        solved_problems = 0
        solved_element = soup.find('h5', string='Fully Solved')
        if solved_element:
            solved_problems = int(solved_element.find_next('div').text.strip().replace(',', ''))

        # CodeChef doesn't have easy/medium/hard breakdown like LeetCode
        problem_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}

        return {
            'platform': 'CodeChef',
            'handle': username,
            'rating': rating,
            'rank': rank,
            'solvedProblems': solved_problems,
            'problemBreakdown': problem_breakdown,
            'profileUrl': f'https://www.codechef.com/users/{username}',
            'success': True
        }

    except Exception as e:
        print(f"Error fetching CodeChef data for {username}: {e}")
        return None

def get_codechef_contests():
    """
    Fetch CodeChef contests using API-like approach with improved error handling
    """
    try:
        logger.info("Fetching CodeChef contests...")

        # CodeChef contest API endpoint (undocumented but works)
        url = "https://www.codechef.com/api/contests"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.codechef.com/contests',
            'X-Requested-With': 'XMLHttpRequest'
        }

        # Try API first
        try:
            response = requests.get(url, headers=headers, timeout=15)
            if response.status_code == 200:
                data = response.json()
                return parse_codechef_api_response(data)
        except (requests.exceptions.RequestException, json.JSONDecodeError):
            logger.info("API approach failed, falling back to scraping...")

        # Fallback to scraping
        return get_codechef_contests_scraping()

    except Exception as e:
        logger.error(f"Unexpected error fetching CodeChef contests: {e}")
        return {'upcoming': [], 'past': []}

def parse_codechef_api_response(data):
    """
    Parse CodeChef API response
    """
    upcoming_contests = []
    past_contests = []

    current_time = datetime.now()

    # Process future contests
    for contest in data.get('future_contests', []):
        try:
            contest_info = {
                'platform': 'CodeChef',
                'contest_name': contest.get('contest_name', ''),
                'contest_code': contest.get('contest_code', ''),
                'start_time': contest.get('contest_start_date_iso', ''),
                'end_time': contest.get('contest_end_date_iso', ''),
                'duration': calculate_duration(contest.get('contest_duration', 0)),
                'contest_link': f"https://www.codechef.com/{contest.get('contest_code', '')}"
            }
            upcoming_contests.append(contest_info)
        except Exception as e:
            logger.error(f"Error processing future contest: {e}")
            continue

    # Process past contests (limit to recent ones)
    for contest in data.get('past_contests', [])[:30]:
        try:
            contest_info = {
                'platform': 'CodeChef',
                'contest_name': contest.get('contest_name', ''),
                'contest_code': contest.get('contest_code', ''),
                'start_time': contest.get('contest_start_date_iso', ''),
                'end_time': contest.get('contest_end_date_iso', ''),
                'duration': calculate_duration(contest.get('contest_duration', 0)),
                'contest_link': f"https://www.codechef.com/{contest.get('contest_code', '')}"
            }
            past_contests.append(contest_info)
        except Exception as e:
            logger.error(f"Error processing past contest: {e}")
            continue

    logger.info(f"Successfully fetched {len(upcoming_contests)} upcoming and {len(past_contests)} past CodeChef contests from API")
    return {'upcoming': upcoming_contests, 'past': past_contests}

def get_codechef_contests_scraping():
    """
    Fallback scraping method for CodeChef contests
    """
    url = "https://www.codechef.com/contests"

    try:
        logger.info("Falling back to scraping CodeChef contests...")

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

        # Look for contest tables with multiple fallback selectors
        upcoming_table = None
        table_selectors = [
            'table[data-tab="contests"]',
            '.contest-table',
            'table.tablesorter',
            'table.dataTable'
        ]

        for selector in table_selectors:
            upcoming_table = soup.select_one(selector)
            if upcoming_table:
                break

        if not upcoming_table:
            # Try finding any table with contest-related content
            tables = soup.find_all('table')
            for table in tables:
                if table.find(text=re.compile(r'contest', re.I)):
                    upcoming_table = table
                    break

        if not upcoming_table:
            logger.warning("Could not find contest table on CodeChef")
            return {'upcoming': [], 'past': []}

        contests = []

        # Extract rows
        rows = upcoming_table.find_all('tr')[1:]  # Skip header

        for row in rows:
            try:
                cols = row.find_all('td')
                if len(cols) < 4:
                    continue

                # Extract contest name and link
                name_cell = cols[0]
                link_tag = name_cell.find('a')
                contest_name = name_cell.get_text(strip=True)
                contest_code = ""
                contest_link = ""

                if link_tag and link_tag.get('href'):
                    href = link_tag['href']
                    contest_link = f"https://www.codechef.com{href}" if href.startswith('/') else href
                    contest_code = href.split('/')[-1] if '/' in href else href

                # Extract timing information
                start_time = cols[1].get_text(strip=True) if len(cols) > 1 else ""
                end_time = cols[2].get_text(strip=True) if len(cols) > 2 else ""
                duration = cols[3].get_text(strip=True) if len(cols) > 3 else ""

                contests.append({
                    'platform': 'CodeChef',
                    'contest_name': contest_name,
                    'contest_code': contest_code,
                    'start_time': start_time,
                    'end_time': end_time,
                    'duration': duration,
                    'contest_link': contest_link
                })

            except Exception as e:
                logger.error(f"Error processing CodeChef contest row: {e}")
                continue

        logger.info(f"Successfully scraped {len(contests)} CodeChef contests")
        return {'upcoming': contests, 'past': []}

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error scraping CodeChef: {e}")
        return {'upcoming': [], 'past': []}
    except Exception as e:
        logger.error(f"Unexpected error scraping CodeChef: {e}")
        return {'upcoming': [], 'past': []}

def calculate_duration(seconds):
    """
    Convert seconds to readable duration format
    """
    if not seconds:
        return "Unknown"

    hours = seconds // 3600
    minutes = (seconds % 3600) // 60

    if hours > 0:
        return f"{hours}h {minutes}m"
    else:
        return f"{minutes}m"
