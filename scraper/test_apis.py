#!/usr/bin/env python3
"""
Test script to check if various platform APIs are working
"""
import requests
import json
import sys

def test_leetcode_api():
    """Test LeetCode contest fetching with multiple fallback methods"""
    try:
        print("Testing LeetCode contest fetching...")
        from leetcode import get_leetcode_contests
        result = get_leetcode_contests()
        upcoming_count = len(result.get('upcoming', []))
        past_count = len(result.get('past', []))
        total_contests = upcoming_count + past_count
        print(f"Found {upcoming_count} upcoming and {past_count} past contests")
        if total_contests > 0:
            print("LeetCode contest fetching working")
            return True
        else:
            print("LeetCode contest fetching failed - no contests found")
            return False
    except Exception as e:
        print(f"LeetCode contest fetching error: {e}")
        return False

def test_codeforces_api():
    """Test Codeforces API"""
    try:
        print("Testing Codeforces API...")
        url = "https://codeforces.com/api/contest.list?gym=false"
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'OK':
                contests = data.get('result', [])
                print(f"Found {len(contests)} contests")
                return True
            else:
                print("Codeforces API returned error status")
                return False
        else:
            print("Codeforces API failed")
            return False
    except Exception as e:
        print(f"Codeforces API error: {e}")
        return False

def test_atcoder_scraping():
    """Test AtCoder scraping"""
    try:
        print("Testing AtCoder scraping...")
        url = "https://atcoder.jp/contests"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            if "contest-table-upcoming" in response.text:
                print("AtCoder page structure looks good")
                return True
            else:
                print("AtCoder page structure may have changed")
                return False
        else:
            print("AtCoder scraping failed")
            return False
    except Exception as e:
        print(f"AtCoder scraping error: {e}")
        return False

def test_codechef_scraping():
    """Test CodeChef scraping"""
    try:
        print("Testing CodeChef scraping...")
        url = "https://www.codechef.com/contests"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            if "contest" in response.text.lower():
                print("CodeChef page structure looks good")
                return True
            else:
                print("CodeChef page structure may have changed")
                return False
        else:
            print("CodeChef scraping failed")
            return False
    except Exception as e:
        print(f"CodeChef scraping error: {e}")
        return False

if __name__ == "__main__":
    print("Testing platform APIs and scraping...\n")

    results = {
        'LeetCode': test_leetcode_api(),
        'Codeforces': test_codeforces_api(),
        'AtCoder': test_atcoder_scraping(),
        'CodeChef': test_codechef_scraping()
    }

    print("\n" + "="*50)
    print("SUMMARY:")
    for platform, working in results.items():
        status = "✅ WORKING" if working else "❌ FAILED"
        print(f"{platform}: {status}")

    working_count = sum(results.values())
    print(f"\n{working_count}/{len(results)} platforms working")