# import time
# import json
# import re
# from datetime import datetime, timedelta
# import pytz
# from flask import Flask, jsonify
# from flask_cors import CORS
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.by import By
# from bs4 import BeautifulSoup
# from webdriver_manager.chrome import ChromeDriverManager
# # Setup Flask app
# app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend access
# # Function: Setup Selenium WebDriver
# def setup_driver():
#     options = Options() 
#     options.add_argument("--headless=new")  # Run without UI
#     options.add_argument("--disable-gpu")
#     options.add_argument("--no-sandbox")
#     options.add_argument("--disable-dev-shm-usage")
#     options.add_argument("--disable-blink-features=AutomationControlled")
#     options.add_experimental_option("excludeSwitches", ["enable-automation"])
#     options.add_experimental_option('useAutomationExtension', False)
#     options.add_argument('--ignore-certificate-errors')
#     options.add_argument('--ignore-ssl-errors')
#     options.add_argument('--disable-notifications')
#     user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
#     options.add_argument(f'user-agent={user_agent}')
#     service = Service(ChromeDriverManager().install())
#     try:
#         driver = webdriver.Chrome(service=service, options=options)
#         return driver
#     except Exception as e:
#         print(f"Driver initialization failed: {e}")
#         raise
# # Function: Parse contest time
# def parse_contest_time(time_str):
#     try:
#         match = re.match(r"(\w+)\s+(\d+:\d+)\s+(AM|PM)\s+GMT([+-]\d+:\d+)", time_str)
#         if not match:
#             return None
#         day, time, ampm, tz_offset = match.groups()
#         hour, minute = map(int, time.split(':'))
#         if ampm == 'PM' and hour != 12:
#             hour += 12
#         elif ampm == 'AM' and hour == 12:
#             hour = 0
#         tz_sign = -1 if tz_offset[0] == '-' else 1
#         tz_h, tz_m = map(int, tz_offset[1:].split(':'))
#         tz_offset_min = tz_sign * (tz_h * 60 + tz_m)
#         tz = pytz.FixedOffset(tz_offset_min)
#         now = datetime.now(tz)
#         contest_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
#         while contest_time < now or contest_time.strftime('%A') != day:
#             contest_time += timedelta(days=1)
#         return contest_time.isoformat()
#     except Exception as e:
#         print(f"Time parsing error: {e}")
#         return None
# def scrape_leetcode(driver):
#     try:
#         print("Scraping LeetCode...")
#         driver.get("https://leetcode.com/contest")
        
#         WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.CSS_SELECTOR, "div.swiper-slide > div > a"))
#         )
#         time.sleep(2)
#         soup = BeautifulSoup(driver.page_source, 'html.parser')
#         contests = []
#         for card in soup.select('div.swiper-slide > div > a')[:2]:
#             try:
#                 name = card.select_one('div.truncate span').text.strip()
#                 time_str = card.select_one('div.flex.items-center.text-\\[14px\\]').text.strip()
#                 start_time = parse_contest_time(time_str)
#                 if not start_time:
#                     continue
#                 contests.append({
#                     "platform": "LeetCode",
#                     "name": name,
#                     "url": f"https://leetcode.com{card['href']}",
#                     "start_time": start_time,
#                     "duration": "90m" if "Weekly" in name else "120m"
#                 })
#             except Exception as e:
#                 print(f"Error processing LeetCode contest: {e}")
#                 continue
#         return contests
#     except Exception as e:
#         print(f"LeetCode scraping failed: {e}")
#         return []


# # Function: Scrape contests from all platforms
# def scrape_all_contests():
#     driver = None
#     try:
#         driver = setup_driver()
#         leetcode = scrape_leetcode(driver)
#         all_contests = leetcode
#         all_contests.sort(key=lambda x: x['start_time'])
#         for i, contest in enumerate(all_contests):
#             contest['id'] = f"{contest['platform'].lower()}-{i}"
#         return all_contests
#     except Exception as e:
#         print(f"Scraping failed: {e}")
#         return []
#     finally:
#         if driver:
#             driver.quit()
# # Flask API Route: Serve Contests
# @app.route('/contests/leetcode', methods=['GET'])
# def get_contests():
#     contests = scrape_all_contests()
#     return jsonify(contests)
# # Run Flask on port 5001
# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5001, debug=True)















import time
import json
import re
from datetime import datetime, timedelta
import pytz
from flask import Flask, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

# Setup Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Function: Setup Selenium WebDriver
def setup_driver():
    options = Options()
    options.add_argument("--headless=new")  # Run without UI
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--ignore-ssl-errors')
    options.add_argument('--disable-notifications')
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    options.add_argument(f'user-agent={user_agent}')
    
    service = Service(ChromeDriverManager().install())
    try:
        driver = webdriver.Chrome(service=service, options=options)
        return driver
    except Exception as e:
        print(f"Driver initialization failed: {e}")
        raise

# Function: Parse contest time
def parse_contest_time(time_str):
    try:
        match = re.match(r"(\w+)\s+(\d+:\d+)\s+(AM|PM)\s+GMT([+-]\d+:\d+)", time_str)
        if not match:
            # Try to match the date format from the example
            date_match = re.match(r"(\w+)\s+(\d+),\s+(\d+)\s+(\d+:\d+)\s+(AM|PM)\s+GMT([+-]\d+:\d+)", time_str)
            if date_match:
                # Format: "May 11, 2025 8:00 AM GMT+5:30"
                month_str, day_str, year_str, time, ampm, tz_offset = date_match.groups()
                month_map = {
                    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
                }
                month = month_map.get(month_str[:3], 1)
                day = int(day_str)
                year = int(year_str)
                hour, minute = map(int, time.split(':'))
                
                if ampm == 'PM' and hour != 12:
                    hour += 12
                elif ampm == 'AM' and hour == 12:
                    hour = 0
                
                tz_sign = -1 if tz_offset[0] == '-' else 1
                tz_h, tz_m = map(int, tz_offset[1:].split(':'))
                tz_offset_min = tz_sign * (tz_h * 60 + tz_m)
                tz = pytz.FixedOffset(tz_offset_min)
                
                contest_time = datetime(year, month, day, hour, minute, 0, 0, tz)
                return contest_time.isoformat()
            return None
        
        day, time, ampm, tz_offset = match.groups()
        hour, minute = map(int, time.split(':'))
        
        if ampm == 'PM' and hour != 12:
            hour += 12
        elif ampm == 'AM' and hour == 12:
            hour = 0
            
        tz_sign = -1 if tz_offset[0] == '-' else 1
        tz_h, tz_m = map(int, tz_offset[1:].split(':'))
        tz_offset_min = tz_sign * (tz_h * 60 + tz_m)
        tz = pytz.FixedOffset(tz_offset_min)
        
        now = datetime.now(tz)
        contest_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        
        while contest_time < now or contest_time.strftime('%A') != day:
            contest_time += timedelta(days=1)
            
        return contest_time.isoformat()
    except Exception as e:
        print(f"Time parsing error: {e}")
        return None

# Function: Parse past contest time
def parse_past_contest_time(time_str):
    try:
        # Format: "May 11, 2025 8:00 AM GMT+5:30"
        match = re.match(r"(\w+)\s+(\d+),\s+(\d+)\s+(\d+:\d+)\s+(AM|PM)\s+GMT([+-]\d+:\d+)", time_str)
        if not match:
            return None
            
        month_str, day_str, year_str, time, ampm, tz_offset = match.groups()
        month_map = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        }
        month = month_map.get(month_str[:3], 1)
        day = int(day_str)
        year = int(year_str)
        hour, minute = map(int, time.split(':'))
        
        if ampm == 'PM' and hour != 12:
            hour += 12
        elif ampm == 'AM' and hour == 12:
            hour = 0
        
        tz_sign = -1 if tz_offset[0] == '-' else 1
        tz_h, tz_m = map(int, tz_offset[1:].split(':'))
        tz_offset_min = tz_sign * (tz_h * 60 + tz_m)
        tz = pytz.FixedOffset(tz_offset_min)
        
        contest_time = datetime(year, month, day, hour, minute, 0, 0, tz)
        return contest_time.isoformat()
    except Exception as e:
        print(f"Past time parsing error: {e}")
        return None

def scrape_leetcode(driver):
    try:
        print("Scraping LeetCode...")
        driver.get("https://leetcode.com/contest")
        
        # Wait for the upcoming contests to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.swiper-slide > div > a"))
        )
        time.sleep(2)
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        contests = []
        
        # Scrape upcoming contests
        print("Scraping upcoming contests...")
        for card in soup.select('div.swiper-slide > div > a')[:2]:
            try:
                name = card.select_one('div.truncate span').text.strip()
                time_str = card.select_one('div.flex.items-center.text-\\[14px\\]').text.strip()
                start_time = parse_contest_time(time_str)
                if not start_time:
                    continue
                
                contests.append({
                    "platform": "LeetCode",
                    "name": name,
                    "url": f"https://leetcode.com{card['href']}",
                    "start_time": start_time,
                    "duration": "90m" if "Weekly" in name else "120m",
                    "status": "upcoming"
                })
            except Exception as e:
                print(f"Error processing LeetCode upcoming contest: {e}")
                continue
        
        # Find and scrape past contests
        print("Scraping past contests...")
        past_contests = []
        
        # Look for past contests (they're typically in the main content area)
        print("Scraping past contests...")
        contest_divs = soup.select('div.mt-\\[11px\\] > div > div.px-4')
        
        for div in contest_divs:
            try:
                link = div.select_one('a[data-contest-title-slug]')
                if not link:
                    continue
                    
                name = link.select_one('span.line-clamp-2').get('title', '').strip()
                if not name:
                    name = link.select_one('span.line-clamp-2').text.strip()
                
                time_str = link.select_one('div.text-\\[11px\\]').text.strip()
                start_time = parse_past_contest_time(time_str)
                
                if not start_time:
                    continue
                
                contests.append({
                    "platform": "LeetCode",
                    "name": name,
                    "url": f"https://leetcode.com{link['href']}",
                    "start_time": start_time,
                    "duration": "90m" if "Weekly" in name else "120m",
                    "status": "past"
                })
            except Exception as e:
                print(f"Error processing LeetCode past contest: {e}")
                continue
        
        
        # Combine upcoming and past contests
        all_contests = contests + past_contests
        return all_contests
    except Exception as e:
        print(f"LeetCode scraping failed: {e}")
        return []

# Function: Scrape contests from all platforms
def scrape_all_contests():
    driver = None
    try:
        driver = setup_driver()
        leetcode = scrape_leetcode(driver)
        all_contests = leetcode
        all_contests.sort(key=lambda x: x['start_time'], reverse=True)  # Sort by start time (newest first)
        
        for i, contest in enumerate(all_contests):
            contest['id'] = f"{contest['platform'].lower()}-{i}"
            
        return all_contests
    except Exception as e:
        print(f"Scraping failed: {e}")
        return []
    finally:
        if driver:
            driver.quit()

# Flask API Routes
@app.route('/contests/leetcode', methods=['GET'])
def get_contests():
    contests = scrape_all_contests()
    return jsonify(contests)

@app.route('/contests/leetcode/upcoming', methods=['GET'])
def get_upcoming_contests():
    contests = scrape_all_contests()
    upcoming = [contest for contest in contests if contest.get('status') == 'upcoming']
    return jsonify(upcoming)

@app.route('/contests/leetcode/past', methods=['GET'])
def get_past_contests():
    contests = scrape_all_contests()
    past = [contest for contest in contests if contest.get('status') == 'past']
    return jsonify(past)

# Run Flask on port 5001
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)