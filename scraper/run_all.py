# #!/usr/bin/env python3
# """
# Unified scraper runner for all competitive programming platforms.
# This script runs all scrapers and aggregates contest and user data.
# """

# import json
# import os
# from datetime import datetime
# import sys

# # Import all scraper modules
# from codeforces import get_codeforces_user_stats, get_codeforces_contests
# from codechef import get_codechef_user_stats, get_codechef_contests
# from leetcode import get_leetcode_user_stats, get_leetcode_contests
# from atcoder import get_atcoder_user_stats, get_atcoder_contests

# def run_all_scrapers():
#     """
#     Run all scrapers and aggregate data
#     """
#     print("🚀 Starting unified scraper run...")
#     print("=" * 50)

#     # Initialize data structures
#     all_contests = {
#         'upcoming': [],
#         'past': []
#     }

#     all_user_stats = []

#     # Track execution time
#     start_time = datetime.now()

#     try:
#         # 1. Scrape Codeforces
#         print("📊 Scraping Codeforces...")
#         cf_contests = get_codeforces_contests()
#         all_contests['upcoming'].extend(cf_contests.get('upcoming', []))
#         all_contests['past'].extend(cf_contests.get('past', []))

#         # Test user stats with a sample user (you can modify this)
#         cf_user = get_codeforces_user_stats("tourist")  # Sample user
#         if cf_user:
#             all_user_stats.append(cf_user)

#         print(f"✅ Codeforces: {len(cf_contests.get('upcoming', []))} upcoming, {len(cf_contests.get('past', []))} past contests")

#         # 2. Scrape CodeChef
#         print("🍳 Scraping CodeChef...")
#         cc_contests = get_codechef_contests()
#         all_contests['upcoming'].extend(cc_contests.get('upcoming', []))
#         all_contests['past'].extend(cc_contests.get('past', []))

#         # Test user stats with a sample user
#         cc_user = get_codechef_user_stats("admin")  # Sample user
#         if cc_user:
#             all_user_stats.append(cc_user)

#         print(f"✅ CodeChef: {len(cc_contests.get('upcoming', []))} upcoming, {len(cc_contests.get('past', []))} past contests")

#         # 3. Scrape LeetCode
#         print("💡 Scraping LeetCode...")
#         lc_contests = get_leetcode_contests()
#         all_contests['upcoming'].extend(lc_contests.get('upcoming', []))
#         all_contests['past'].extend(lc_contests.get('past', []))

#         # Test user stats with a sample user
#         lc_user = get_leetcode_user_stats("leetcode")  # Sample user
#         if lc_user:
#             all_user_stats.append(lc_user)

#         print(f"✅ LeetCode: {len(lc_contests.get('upcoming', []))} upcoming, {len(lc_contests.get('past', []))} past contests")

#         # 4. Scrape AtCoder
#         print("🎌 Scraping AtCoder...")
#         ac_contests = get_atcoder_contests()
#         all_contests['upcoming'].extend(ac_contests.get('upcoming', []))
#         all_contests['past'].extend(ac_contests.get('past', []))

#         # Test user stats with a sample user
#         ac_user = get_atcoder_user_stats("chokudai")  # Sample user
#         if ac_user:
#             all_user_stats.append(ac_user)

#         print(f"✅ AtCoder: {len(ac_contests.get('upcoming', []))} upcoming, {len(ac_contests.get('past', []))} past contests")

#         # Sort contests by start time
#         all_contests['upcoming'].sort(key=lambda x: x.get('start_time', ''), reverse=True)
#         all_contests['past'].sort(key=lambda x: x.get('start_time', ''), reverse=True)

#         # Calculate execution time
#         end_time = datetime.now()
#         execution_time = end_time - start_time

#         # Prepare final data structure
#         final_data = {
#             'metadata': {
#                 'scraped_at': datetime.now().isoformat(),
#                 'execution_time_seconds': execution_time.total_seconds(),
#                 'platforms_scraped': ['Codeforces', 'CodeChef', 'LeetCode', 'AtCoder'],
#                 'total_upcoming_contests': len(all_contests['upcoming']),
#                 'total_past_contests': len(all_contests['past']),
#                 'total_user_stats': len(all_user_stats)
#             },
#             'contests': all_contests,
#             'user_stats': all_user_stats
#         }

#         # Save to JSON files
#         output_dir = os.path.join(os.path.dirname(__file__), 'output')
#         os.makedirs(output_dir, exist_ok=True)

#         # Save contests
#         contests_file = os.path.join(output_dir, 'all_contests.json')
#         with open(contests_file, 'w', encoding='utf-8') as f:
#             json.dump(final_data['contests'], f, indent=2, ensure_ascii=False)
#         print(f"💾 Saved contests to: {contests_file}")

#         # Save user stats
#         user_stats_file = os.path.join(output_dir, 'user_stats.json')
#         with open(user_stats_file, 'w', encoding='utf-8') as f:
#             json.dump(final_data['user_stats'], f, indent=2, ensure_ascii=False)
#         print(f"💾 Saved user stats to: {user_stats_file}")

#         # Save full data
#         full_data_file = os.path.join(output_dir, 'full_scraped_data.json')
#         with open(full_data_file, 'w', encoding='utf-8') as f:
#             json.dump(final_data, f, indent=2, ensure_ascii=False)
#         print(f"💾 Saved full data to: {full_data_file}")

#         # Print summary
#         print("\n" + "=" * 50)
#         print("🎉 Scraping completed successfully!")
#         print(f"⏱️  Total execution time: {execution_time.total_seconds():.2f} seconds")
#         print(f"📅 Upcoming contests: {len(all_contests['upcoming'])}")
#         print(f"📚 Past contests: {len(all_contests['past'])}")
#         print(f"👥 User profiles: {len(all_user_stats)}")
#         print("=" * 50)

#         return final_data

#     except Exception as e:
#         print(f"❌ Error during scraping: {e}")
#         import traceback
#         traceback.print_exc()
#         return None

# def scrape_user_stats(username, platform):
#     """
#     Scrape user stats for a specific user on a specific platform
#     """
#     try:
#         if platform.lower() == 'codeforces':
#             return get_codeforces_user_stats(username)
#         elif platform.lower() == 'codechef':
#             return get_codechef_user_stats(username)
#         elif platform.lower() == 'leetcode':
#             return get_leetcode_user_stats(username)
#         elif platform.lower() == 'atcoder':
#             return get_atcoder_user_stats(username)
#         else:
#             print(f"❌ Unsupported platform: {platform}")
#             return None
#     except Exception as e:
#         print(f"❌ Error scraping {platform} user {username}: {e}")
#         return None

# if __name__ == "__main__":
#     # Check command line arguments
#     if len(sys.argv) > 1:
#         if len(sys.argv) == 3:
#             # Scrape specific user: python run_all.py <platform> <username>
#             platform = sys.argv[1]
#             username = sys.argv[2]
#             print(f"🔍 Scraping {platform} user: {username}")
#             result = scrape_user_stats(username, platform)
#             if result:
#                 print("✅ User stats retrieved:")
#                 print(json.dumps(result, indent=2))
#             else:
#                 print("❌ Failed to retrieve user stats")
#         else:
#             print("Usage:")
#             print("  python run_all.py                    # Run all scrapers")
#             print("  python run_all.py <platform> <username>  # Scrape specific user")
#             print("Platforms: codeforces, codechef, leetcode, atcoder")
#     else:
#         # Run all scrapers
#         run_all_scrapers()

#!/usr/bin/env python3
"""
Unified scraper runner for all competitive programming platforms.
This script runs all scrapers and aggregates contest and user data.
"""

import json
import os
from datetime import datetime
import sys
import traceback

# Import all scraper modules
try:
    from codeforces import get_codeforces_user_stats, get_codeforces_contests
    from codechef import get_codechef_user_stats, get_codechef_contests
    from leetcode import get_leetcode_user_stats, get_leetcode_contests
    from atcoder import get_atcoder_user_stats, get_atcoder_contests
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    print("Make sure all scraper files (codeforces.py, codechef.py, leetcode.py, atcoder.py) are in the same directory")
    sys.exit(1)

def run_all_scrapers(test_users=None):
    """
    Run all scrapers and aggregate data
    
    Args:
        test_users: Dictionary with platform names as keys and usernames as values
                   Example: {'codeforces': 'tourist', 'leetcode': 'leetcode'}
    """
    print("🚀 Starting unified scraper run...")
    print("=" * 50)

    # Initialize data structures
    all_contests = {
        'upcoming': [],
        'past': []
    }

    all_user_stats = []
    scraping_stats = {
        'successful': [],
        'failed': [],
        'total_contests': 0,
        'total_users': 0
    }

    # Default test users if none provided
    if test_users is None:
        test_users = {
            'codeforces': 'tourist',
            'codechef': 'gennady_korotkevich',
            'leetcode': 'leetcode',
            'atcoder': 'tourist'
        }

    # Track execution time
    start_time = datetime.now()

    # 1. Scrape Codeforces
    print("\n📊 Scraping Codeforces...")
    print("-" * 50)
    try:
        cf_contests = get_codeforces_contests()
        all_contests['upcoming'].extend(cf_contests.get('upcoming', []))
        all_contests['past'].extend(cf_contests.get('past', []))
        
        cf_user = get_codeforces_user_stats(test_users.get('codeforces', 'tourist'))
        if cf_user:
            all_user_stats.append(cf_user)
            scraping_stats['total_users'] += 1

        print(f"✅ Codeforces: {len(cf_contests.get('upcoming', []))} upcoming, {len(cf_contests.get('past', []))} past contests")
        scraping_stats['successful'].append('Codeforces')
    except Exception as e:
        print(f"❌ Codeforces scraping failed: {e}")
        scraping_stats['failed'].append('Codeforces')
        traceback.print_exc()

    # 2. Scrape CodeChef
    print("\n🍳 Scraping CodeChef...")
    print("-" * 50)
    try:
        cc_contests = get_codechef_contests()
        all_contests['upcoming'].extend(cc_contests.get('upcoming', []))
        all_contests['past'].extend(cc_contests.get('past', []))

        cc_user = get_codechef_user_stats(test_users.get('codechef', 'gennady_korotkevich'))
        if cc_user:
            all_user_stats.append(cc_user)
            scraping_stats['total_users'] += 1

        print(f"✅ CodeChef: {len(cc_contests.get('upcoming', []))} upcoming, {len(cc_contests.get('past', []))} past contests")
        scraping_stats['successful'].append('CodeChef')
    except Exception as e:
        print(f"❌ CodeChef scraping failed: {e}")
        scraping_stats['failed'].append('CodeChef')
        traceback.print_exc()

    # 3. Scrape LeetCode
    print("\n💡 Scraping LeetCode...")
    print("-" * 50)
    try:
        lc_contests = get_leetcode_contests()
        all_contests['upcoming'].extend(lc_contests.get('upcoming', []))
        all_contests['past'].extend(lc_contests.get('past', []))

        lc_user = get_leetcode_user_stats(test_users.get('leetcode', 'leetcode'))
        if lc_user:
            all_user_stats.append(lc_user)
            scraping_stats['total_users'] += 1

        print(f"✅ LeetCode: {len(lc_contests.get('upcoming', []))} upcoming, {len(lc_contests.get('past', []))} past contests")
        scraping_stats['successful'].append('LeetCode')
    except Exception as e:
        print(f"❌ LeetCode scraping failed: {e}")
        scraping_stats['failed'].append('LeetCode')
        traceback.print_exc()

    # 4. Scrape AtCoder
    print("\n🎌 Scraping AtCoder...")
    print("-" * 50)
    try:
        ac_contests = get_atcoder_contests()
        all_contests['upcoming'].extend(ac_contests.get('upcoming', []))
        all_contests['past'].extend(ac_contests.get('past', []))

        ac_user = get_atcoder_user_stats(test_users.get('atcoder', 'tourist'))
        if ac_user:
            all_user_stats.append(ac_user)
            scraping_stats['total_users'] += 1

        print(f"✅ AtCoder: {len(ac_contests.get('upcoming', []))} upcoming, {len(ac_contests.get('past', []))} past contests")
        scraping_stats['successful'].append('AtCoder')
    except Exception as e:
        print(f"❌ AtCoder scraping failed: {e}")
        scraping_stats['failed'].append('AtCoder')
        traceback.print_exc()

    # Sort contests by start time
    try:
        all_contests['upcoming'].sort(key=lambda x: x.get('start_time', x.get('startTime', '')), reverse=False)
        all_contests['past'].sort(key=lambda x: x.get('start_time', x.get('startTime', '')), reverse=True)
    except Exception as e:
        print(f"⚠️ Warning: Could not sort contests: {e}")

    # Calculate execution time
    end_time = datetime.now()
    execution_time = end_time - start_time

    # Update scraping stats
    scraping_stats['total_contests'] = len(all_contests['upcoming']) + len(all_contests['past'])

    # Prepare final data structure
    final_data = {
        'metadata': {
            'scraped_at': datetime.now().isoformat(),
            'execution_time_seconds': execution_time.total_seconds(),
            'platforms_scraped': scraping_stats['successful'],
            'platforms_failed': scraping_stats['failed'],
            'total_upcoming_contests': len(all_contests['upcoming']),
            'total_past_contests': len(all_contests['past']),
            'total_user_stats': len(all_user_stats),
            'test_users': test_users
        },
        'contests': all_contests,
        'user_stats': all_user_stats
    }

    # Save to JSON files
    try:
        output_dir = os.path.join(os.path.dirname(__file__), 'output')
        os.makedirs(output_dir, exist_ok=True)

        # Save contests
        contests_file = os.path.join(output_dir, 'all_contests.json')
        with open(contests_file, 'w', encoding='utf-8') as f:
            json.dump(final_data['contests'], f, indent=2, ensure_ascii=False)
        print(f"\n💾 Saved contests to: {contests_file}")

        # Save user stats
        user_stats_file = os.path.join(output_dir, 'user_stats.json')
        with open(user_stats_file, 'w', encoding='utf-8') as f:
            json.dump(final_data['user_stats'], f, indent=2, ensure_ascii=False)
        print(f"💾 Saved user stats to: {user_stats_file}")

        # Save full data
        full_data_file = os.path.join(output_dir, 'full_scraped_data.json')
        with open(full_data_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved full data to: {full_data_file}")

    except Exception as e:
        print(f"❌ Error saving files: {e}")
        traceback.print_exc()

    # Print summary
    print("\n" + "=" * 50)
    print("🎉 Scraping completed!")
    print(f"⏱️  Total execution time: {execution_time.total_seconds():.2f} seconds")
    print(f"✅ Successful platforms: {', '.join(scraping_stats['successful'])}")
    if scraping_stats['failed']:
        print(f"❌ Failed platforms: {', '.join(scraping_stats['failed'])}")
    print(f"📅 Upcoming contests: {len(all_contests['upcoming'])}")
    print(f"📚 Past contests: {len(all_contests['past'])}")
    print(f"👥 User profiles fetched: {len(all_user_stats)}")
    print("=" * 50)

    return final_data

def scrape_user_stats(username, platform):
    """
    Scrape user stats for a specific user on a specific platform
    """
    try:
        platform_lower = platform.lower()
        print(f"🔍 Scraping {platform} user: {username}")
        
        if platform_lower == 'codeforces':
            return get_codeforces_user_stats(username)
        elif platform_lower == 'codechef':
            return get_codechef_user_stats(username)
        elif platform_lower == 'leetcode':
            return get_leetcode_user_stats(username)
        elif platform_lower == 'atcoder':
            return get_atcoder_user_stats(username)
        else:
            print(f"❌ Unsupported platform: {platform}")
            print("Supported platforms: codeforces, codechef, leetcode, atcoder")
            return None
    except Exception as e:
        print(f"❌ Error scraping {platform} user {username}: {e}")
        traceback.print_exc()
        return None

def scrape_platform_contests(platform):
    """
    Scrape contests for a specific platform
    """
    try:
        platform_lower = platform.lower()
        print(f"🔍 Scraping {platform} contests...")
        
        if platform_lower == 'codeforces':
            return get_codeforces_contests()
        elif platform_lower == 'codechef':
            return get_codechef_contests()
        elif platform_lower == 'leetcode':
            return get_leetcode_contests()
        elif platform_lower == 'atcoder':
            return get_atcoder_contests()
        else:
            print(f"❌ Unsupported platform: {platform}")
            print("Supported platforms: codeforces, codechef, leetcode, atcoder")
            return None
    except Exception as e:
        print(f"❌ Error scraping {platform} contests: {e}")
        traceback.print_exc()
        return None

if __name__ == "__main__":
    # Check command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'user' and len(sys.argv) == 4:
            # Scrape specific user: python run_all.py user <platform> <username>
            platform = sys.argv[2]
            username = sys.argv[3]
            result = scrape_user_stats(username, platform)
            if result:
                print("\n✅ User stats retrieved:")
                print(json.dumps(result, indent=2))
            else:
                print("\n❌ Failed to retrieve user stats")
                
        elif command == 'contests' and len(sys.argv) == 3:
            # Scrape contests: python run_all.py contests <platform>
            platform = sys.argv[2]
            result = scrape_platform_contests(platform)
            if result:
                print("\n✅ Contests retrieved:")
                print(json.dumps(result, indent=2))
            else:
                print("\n❌ Failed to retrieve contests")
                
        else:
            print("Usage:")
            print("  python run_all.py                              # Run all scrapers")
            print("  python run_all.py user <platform> <username>   # Scrape specific user")
            print("  python run_all.py contests <platform>          # Scrape platform contests")
            print("\nPlatforms: codeforces, codechef, leetcode, atcoder")
    else:
        # Run all scrapers
        run_all_scrapers()