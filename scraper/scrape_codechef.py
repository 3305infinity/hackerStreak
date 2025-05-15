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

app = Flask(__name__)

def get_upcoming_contests():
    """
    Scrape CodeChef website to get information about upcoming contests.
    Returns a list of dictionaries with contest details.
    """
    # URL for CodeChef's contest page
    url = "https://www.codechef.com/contests"
    
    try:
        # Send HTTP request with a more browser-like User-Agent
        logger.info(f"Fetching data from {url}")
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
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Save HTML content for debugging if needed
        with open("codechef_debug.html", "w", encoding="utf-8") as f:
            f.write(response.text)
        logger.info("Saved HTML content to codechef_debug.html for inspection")
        
        # Parse HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try multiple selectors as CodeChef might have changed their structure
        # Method 1: Look for table with data-tab attribute (original approach)
        upcoming_table = soup.find('table', {'data-tab': 'contests'})
        
        # Method 2: Look for tables inside specific container divs
        if not upcoming_table:
            logger.info("Method 1 failed, trying method 2...")
            contest_containers = soup.select('div.contest-container')
            for container in contest_containers:
                tables = container.find_all('table')
                if tables and len(tables) > 0:
                    upcoming_table = tables[0]
                    break
        
        # Method 3: Look for any tables with specific class names
        if not upcoming_table:
            logger.info("Method 2 failed, trying method 3...")
            table_classes = ['dataTable', 'contestTable', 'tablesorter']
            for class_name in table_classes:
                upcoming_table = soup.find('table', {'class': class_name})
                if upcoming_table:
                    break
        
        # Method 4: Find tables with contest-related headers
        if not upcoming_table:
            logger.info("Method 3 failed, trying method 4...")
            tables = soup.find_all('table')
            for table in tables:
                headers = table.find_all('th')
                header_texts = [h.text.strip().lower() for h in headers]
                if any(keyword in ' '.join(header_texts) for keyword in ['contest', 'name', 'start', 'end', 'duration']):
                    upcoming_table = table
                    break
        
        if not upcoming_table:
            logger.warning("Could not find the upcoming contests table. The website structure may have changed.")
            # Dump HTML structure for analysis
            structure = []
            for i, table in enumerate(soup.find_all('table')):
                headers = [th.text.strip() for th in table.find_all('th')]
                structure.append(f"Table #{i+1}: Headers = {headers}")
            logger.info(f"Found {len(structure)} tables: {structure}")
            return []
        
        # Extract contest information
        contests = []
        
        # Try to find the rows - first look for tbody
        tbody = upcoming_table.find('tbody')
        if tbody:
            rows = tbody.find_all('tr')
        else:
            # If no tbody, get rows directly from table but skip header row
            rows = upcoming_table.find_all('tr')
            if rows and len(rows) > 0:
                rows = rows[1:]  # Skip header row
        
        logger.info(f"Found {len(rows)} contest rows to process")
        
        for row in rows:
            try:
                cols = row.find_all('td')
                if len(cols) >= 4:  # We need at least name, start, end, duration
                    # Try to extract contest details with fallbacks
                    contest_name = cols[0].text.strip() if cols[0].text else "Unknown"
                    
                    # Try to get contest code from link
                    contest_link = "N/A"
                    contest_code = "N/A"
                    link_tag = cols[0].find('a')
                    if link_tag and 'href' in link_tag.attrs:
                        href = link_tag['href']
                        if href.startswith('/'):
                            contest_link = f"https://www.codechef.com{href}"
                        else:
                            contest_link = href
                        # Try to extract contest code from URL
                        parts = href.rstrip('/').split('/')
                        contest_code = parts[-1] if parts else "N/A"
                    
                    # Get other details with column index fallbacks
                    start_time = cols[1].text.strip() if len(cols) > 1 else "Unknown"
                    end_time = cols[2].text.strip() if len(cols) > 2 else "Unknown"
                    duration = cols[3].text.strip() if len(cols) > 3 else "Unknown"
                    
                    contests.append({
                        'contest_name': contest_name,
                        'contest_code': contest_code,
                        'start_time': start_time,
                        'end_time': end_time,
                        'duration': duration,
                        'contest_link': contest_link
                    })
                    logger.info(f"Extracted contest: {contest_name}")
            except Exception as e:
                logger.error(f"Error processing row: {e}")
                continue
        
        logger.info(f"Successfully fetched {len(contests)} contests")
        return contests
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data: {e}")
        return []
    except Exception as e:
        logger.error(f"Error processing data: {e}")
        return []

def get_contest_data_alternative():
    """
    Alternative method to get contest data by directly parsing JavaScript objects
    from the CodeChef website.
    """
    url = "https://www.codechef.com/contests"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Check if we can find contest data in JavaScript objects
        json_data = re.search(r'var\s+contests\s*=\s*(\[.*?\]);', response.text, re.DOTALL)
        if json_data:
            # Found a contests array in JavaScript
            try:
                contests_str = json_data.group(1)
                # Clean up the string (CodeChef might use single quotes or other JS-specific syntax)
                contests_str = contests_str.replace("'", '"')
                contests_str = re.sub(r'(\w+):', r'"\1":', contests_str)  # Convert JS object keys to JSON format
                contests = json.loads(contests_str)
                
                # Transform into our standard format
                formatted_contests = []
                for contest in contests:
                    formatted_contests.append({
                        'contest_name': contest.get('name', 'Unknown'),
                        'contest_code': contest.get('code', 'N/A'),
                        'start_time': contest.get('startDate', 'Unknown'),
                        'end_time': contest.get('endDate', 'Unknown'),
                        'duration': contest.get('duration', 'Unknown'),
                        'contest_link': f"https://www.codechef.com/{contest.get('code', '')}"
                    })
                return formatted_contests
            except json.JSONDecodeError:
                logger.error("Found JavaScript data but couldn't parse it as JSON")
        
        # If we couldn't extract from JS, try to find the tables directly
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for the present and future contest sections
        present_section = soup.find(lambda tag: tag.name == 'h3' and tag.text and 'Present Contests' in tag.text)
        future_section = soup.find(lambda tag: tag.name == 'h3' and tag.text and 'Future Contests' in tag.text)
        
        contests = []
        
        # Helper function to extract contests from a section
        def extract_contests(section):
            result = []
            if not section:
                return result
                
            # Try to find the table that follows this heading
            table = section.find_next('table')
            if not table:
                return result
                
            rows = table.find_all('tr')[1:]  # Skip header
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 4:
                    name_col = cols[0]
                    name = name_col.text.strip()
                    link = name_col.find('a')
                    href = link['href'] if link and 'href' in link.attrs else ""
                    code = href.split('/')[-1] if href else "N/A"
                    
                    result.append({
                        'contest_name': name,
                        'contest_code': code,
                        'start_time': cols[1].text.strip() if len(cols) > 1 else "Unknown",
                        'end_time': cols[2].text.strip() if len(cols) > 2 else "Unknown",
                        'duration': cols[3].text.strip() if len(cols) > 3 else "Unknown",
                        'contest_link': f"https://www.codechef.com{href}" if href.startswith('/') else href
                    })
            return result
        
        # Extract contests from both present and future sections
        if present_section:
            contests.extend(extract_contests(present_section))
        if future_section:
            contests.extend(extract_contests(future_section))
            
        return contests
        
    except Exception as e:
        logger.error(f"Alternative method error: {e}")
        return []

@app.route('/api/codechef/contests', methods=['GET'])
def contests_api():
    """
    API endpoint to get upcoming CodeChef contests.
    Returns JSON data with contest information.
    """
    # Try the original method first
    contests = get_upcoming_contests()
    
    # If that fails, try the alternative method
    if not contests:
        logger.info("Original method returned no contests, trying alternative method...")
        contests = get_contest_data_alternative()
    
    response = {
        'status': 'success' if contests else 'error',
        'timestamp': datetime.now().isoformat(),
        'count': len(contests),
        'data': contests
    }
    
    # Adding CORS headers to make the API more accessible
    res = jsonify(response)
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res

@app.route('/', methods=['GET'])
def home():
    """
    Home page with basic information about the API.
    """
    return """
    <html>
        <head>
            <title>CodeChef Contests API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #333; }
                code { background: #f4f4f4; padding: 2px 5px; }
            </style>
        </head>
        <body>
            <h1>CodeChef Contests API</h1>
            <p>Use the following endpoint to get upcoming contests:</p>
            <code>/api/codechef/contests</code>
            <p>Example: <a href="/api/codechef/contests">/api/codechef/contests</a></p>
        </body>
    </html>
    """

@app.route('/debug', methods=['GET'])
def debug_page():
    """
    Debug page that shows HTML structure and extraction attempts
    """
    try:
        url = "https://www.codechef.com/contests"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all tables and their structure
        tables_info = []
        for i, table in enumerate(soup.find_all('table')):
            headers = [th.text.strip() for th in table.find_all('th')]
            row_count = len(table.find_all('tr'))
            tables_info.append({
                'index': i,
                'headers': headers,
                'row_count': row_count,
                'classes': table.get('class', []),
                'id': table.get('id', 'None')
            })
        
        # Generate debug info
        debug_html = f"""
        <html>
            <head>
                <title>CodeChef API Debugger</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }}
                    h1, h2 {{ color: #333; }}
                    pre {{ background: #f4f4f4; padding: 10px; overflow: auto; }}
                    .table-info {{ border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }}
                </style>
            </head>
            <body>
                <h1>CodeChef API Debugger</h1>
                <h2>Tables Found ({len(tables_info)})</h2>
                <div>
                    {''.join([f'''
                    <div class="table-info">
                        <h3>Table #{info['index'] + 1}</h3>
                        <p><strong>ID:</strong> {info['id']}</p>
                        <p><strong>Classes:</strong> {', '.join(info['classes']) if info['classes'] else 'None'}</p>
                        <p><strong>Headers:</strong> {', '.join(info['headers']) if info['headers'] else 'None'}</p>
                        <p><strong>Row Count:</strong> {info['row_count']}</p>
                    </div>
                    ''' for info in tables_info])}
                </div>
                
                <h2>API Response</h2>
                <pre>{jsonify(contests_api().get_json()).get_data(as_text=True)}</pre>
                
                <h2>Actions</h2>
                <a href="/api/codechef/contests">View API Response</a>
            </body>
        </html>
        """
        return debug_html
    except Exception as e:
        return f"<h1>Error</h1><p>{str(e)}</p>

if __name__ == "__main__":
    logger.info("Starting server at http://localhost:5002")
    app.run(host='0.0.0.0', port=5002, debug=True)