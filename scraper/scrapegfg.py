# from flask import Flask, jsonify
# import requests
# from bs4 import BeautifulSoup
# from datetime import datetime

# app = Flask(__name__)

# GFG_URL = "https://practice.geeksforgeeks.org/contest/"

# def fetch_gfg_contests():
#     response = requests.get(GFG_URL)
#     if response.status_code != 200:
#         return []
    
#     soup = BeautifulSoup(response.text, "html.parser")
#     contest_divs = soup.find_all("div", class_="eventsLanding_eachEventContainer__O5VyK")  # Extract contest cards
    
#     contests = []
    
#     for contest_div in contest_divs:
#         try:
#             # Extract contest name
#             contest_name = contest_div.find("p", class_="eventsLanding_eventCardTitle__byiHw").text.strip()

#             # Extract contest link
#             contest_link = contest_div.find("a")["href"]
#             contest_url = f"https://practice.geeksforgeeks.org{contest_link}"

#             # Extract contest date and time
#             date_text = contest_div.find("div", class_="eventsLanding_eventDateContainer__Z1zke").find_all("p")
#             contest_date = date_text[0].text.strip()  # Example: April 06, 2025
#             contest_time = date_text[1].text.strip()  # Example: 07:00 PM IST
            
#             # Convert date & time into ISO format
#             dt_obj = datetime.strptime(contest_date + " " + contest_time, "%B %d, %Y %I:%M %p IST")
#             start_time_iso = dt_obj.strftime("%Y-%m-%dT%H:%M:%S")

#             # Store contest details
#             contests.append({
#                 "platform": "GeeksforGeeks",
#                 "name": contest_name,
#                 "url": contest_url,
#                 "start_time": start_time_iso
#             })
        
#         except Exception as e:
#             print(f"Error processing contest: {e}")
    
#     return contests

# @app.route("/contests/gfg", methods=["GET"])
# def get_gfg_contests():
#     contests = fetch_gfg_contests()
#     return jsonify(contests)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5005, debug=True)
from flask import Flask, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
from datetime import datetime

app = Flask(__name__)

GFG_URL = "https://practice.geeksforgeeks.org/contest/"

def fetch_gfg_contests():
    options = Options()
    options.add_argument("--headless")  # Run in headless mode (no browser window)
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    
    driver = webdriver.Chrome(options=options)
    driver.get(GFG_URL)
    
    time.sleep(5)  # Wait for JavaScript to load contests

    contests = []
    
    contest_divs = driver.find_elements(By.CLASS_NAME, "eventsLanding_eachEventContainer__O5VyK")
    
    for contest_div in contest_divs:
        try:
            # Extract contest name
            contest_name = contest_div.find_element(By.CLASS_NAME, "eventsLanding_eventCardTitle__byiHw").text.strip()
            
            # Extract contest link
            contest_link = contest_div.find_element(By.TAG_NAME, "a").get_attribute("href")
            
            # Extract contest date and time
            date_elements = contest_div.find_elements(By.CLASS_NAME, "sofia-pro")
            contest_date = date_elements[0].text.strip()  # Example: April 06, 2025
            contest_time = date_elements[1].text.strip()  # Example: 07:00 PM IST

            # Convert date & time to ISO format
            dt_obj = datetime.strptime(contest_date + " " + contest_time, "%B %d, %Y %I:%M %p IST")
            start_time_iso = dt_obj.strftime("%Y-%m-%dT%H:%M:%S")

            # Store contest details
            contests.append({
                "platform": "GeeksforGeeks",
                "name": contest_name,
                "url": contest_link,
                "start_time": start_time_iso
            })
        
        except Exception as e:
            print(f"Error processing contest: {e}")
    
    driver.quit()
    return contests

@app.route("/contests/gfg", methods=["GET"])
def get_gfg_contests():
    contests = fetch_gfg_contests()
    return jsonify(contests)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005, debug=True)
