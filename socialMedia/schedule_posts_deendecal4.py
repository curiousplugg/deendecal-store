#!/usr/bin/env python3
"""
Late API Social Media Post Scheduler - DeenDecal4

This script schedules posts to Instagram, TikTok, and YouTube using the Late API.
It schedules 10 posts per day at random times within specified windows until the first of next month.
"""

import os
import sys
import random
import json
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
LATE_API_KEY = os.getenv("LATE_API_KEY", "sk_55e25039cc98ac51fc1970f287832d8eb2a1ee6ea08dfc771ad49e5309d68f35")
LATE_API_BASE = "https://getlate.dev/api/v1"
PROFILE_NAME = os.getenv("LATE_PROFILE_NAME", "deendecal4")
TIMEZONE = os.getenv("TIMEZONE", "America/New_York")
VIDEO_DIR = Path(__file__).parent / os.getenv("VIDEO_DIR", "used2")

# Posting time windows (hour ranges) - same as deendecal1
POSTING_WINDOWS = [
    (5, 6),   # 5-6 AM
    (7, 8),   # 7-8 AM
    (10, 11), # 10-11 AM
    (12, 13), # 12-1 PM
    (14, 15), # 2-3 PM
    (15, 16), # 3-4 PM
    (17, 18), # 5-6 PM
    (19, 20), # 7-8 PM
    (21, 22), # 9-10 PM
    (23, 24), # 11-12 PM
]

# Account IDs (hardcoded for deendecal4)
TIKTOK_ACCOUNT_ID = "6928a2e61ee87fa9e6455369"
INSTAGRAM_ACCOUNT_ID = "6928a2d7f43160a0bc9994f8"
YOUTUBE_ACCOUNT_ID = "6928a2edb4b8de4f936839b7"
PROFILE_ID = "6928a29fd855b28fc35d41a9"

# Hashtags (used in all captions)
HASHTAGS = "#car #decal #shahada #islam #muslim #metal #emblem #deendecal"

# Varied captions (will cycle through these)
CAPTIONS = [
    "Transform your ride with premium Islamic decals! 🚗✨ Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Show your faith with style! Check out our latest designs 🔥 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Quality decals for your car, made with care 🎨 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "New designs dropping! Get yours today 🚀 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Express your identity with our premium decals 💪 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Beautiful Islamic decals for your vehicle 🌟 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Upgrade your car's look with our latest collection 🎯 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Faith meets style! Shop our decals now 🛒 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Premium quality, authentic designs ✨ Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Make a statement with DeenDecal! 🎨 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Your car deserves the best! Check out our decals 🚗💎 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Islamic decals that last! Quality guaranteed 🔒 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "New video! See our decals in action 🎥 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Stand out with our unique designs 🌈 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Shop now and transform your ride today! 🛍️ Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Quality you can trust, designs you'll love ❤️ Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Express yourself with our premium decals 🎭 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Beautiful designs for beautiful cars 🚙✨ Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Check out what's new! Fresh designs available now 🆕 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
    "Your style, your faith, your decal 🎨 Link in bio 📲\n\ndeendecal.com 📲\n\n{HASHTAGS}",
]


class LateAPIClient:
    """Client for interacting with the Late API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        self.base_url = LATE_API_BASE
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make an API request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        
        # Handle different status codes
        if response.status_code == 401:
            raise Exception("Unauthorized: Invalid API key")
        elif response.status_code == 403:
            try:
                error_data = response.json()
                error_msg = error_data.get("error", "Forbidden: Check your plan limits")
                raise Exception(f"Forbidden: {error_msg}")
            except:
                raise Exception("Forbidden: Check your plan limits")
        elif response.status_code == 429:
            reset_time = response.headers.get("X-RateLimit-Reset", "unknown")
            raise Exception(f"Rate limit exceeded. Reset at: {reset_time}")
        
        response.raise_for_status()
        return response.json()
    
    def get_profiles(self) -> List[Dict]:
        """Get all profiles"""
        return self._request("GET", "/profiles")["profiles"]
    
    def get_profile_by_name(self, name: str) -> Optional[Dict]:
        """Get a profile by name"""
        profiles = self.get_profiles()
        for profile in profiles:
            if profile["name"] == name:
                return profile
        return None
    
    def get_accounts(self, profile_id: str) -> List[Dict]:
        """Get accounts for a profile"""
        return self._request("GET", f"/accounts?profileId={profile_id}")["accounts"]
    
    def upload_media(self, file_path: Path) -> Dict:
        """Upload a media file to Late"""
        url = f"{self.base_url}/media"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        
        # Check file size (4MB threshold for multipart vs large file upload)
        file_size = file_path.stat().st_size
        file_size_mb = file_size / (1024 * 1024)
        
        # Determine content type from file extension
        content_type = "video/mp4"
        if file_path.suffix.lower() in [".mov", ".quicktime"]:
            content_type = "video/quicktime"
        elif file_path.suffix.lower() == ".webm":
            content_type = "video/webm"
        elif file_path.suffix.lower() == ".avi":
            content_type = "video/x-msvideo"
        elif file_path.suffix.lower() == ".m4v":
            content_type = "video/x-m4v"
        
        # For files > 4MB, we'd need to use the large file upload flow
        # But for now, try multipart (works up to ~5GB per API docs)
        with open(file_path, "rb") as f:
            files = {"files": (file_path.name, f, content_type)}
            response = requests.post(url, headers=headers, files=files)
            
            # Handle different response codes
            if response.status_code == 413:
                raise Exception(f"File too large ({file_size_mb:.2f}MB). Large file upload flow not implemented in Python. Consider using Node.js @vercel/blob client.")
            
            response.raise_for_status()
            result = response.json()
            
            if "files" not in result or len(result["files"]) == 0:
                raise Exception("No files returned from upload")
            
            return result["files"][0]  # Return first file from response
    
    def create_post(self, content: str, platforms: List[Dict], scheduled_for: str, 
                   timezone: str, media_items: List[Dict]) -> Dict:
        """Create a scheduled post"""
        payload = {
            "content": content,
            "platforms": platforms,
            "scheduledFor": scheduled_for,
            "timezone": timezone,
            "mediaItems": media_items,
            "publishNow": False
        }
        return self._request("POST", "/posts", json=payload)


def get_random_time_in_window(start_hour: int, end_hour: int) -> Tuple[int, int]:
    """Get a random time within a window (hour, minute)"""
    hour = random.randint(start_hour, end_hour - 1)
    minute = random.randint(0, 59)
    return hour, minute


def get_next_month_start(current_date: datetime) -> datetime:
    """Get the first day of the next month"""
    if current_date.month == 12:
        return datetime(current_date.year + 1, 1, 1)
    return datetime(current_date.year, current_date.month + 1, 1)


def get_all_dates_until(target_date: datetime) -> List[datetime]:
    """Get all dates from today until (but not including) target_date"""
    dates = []
    current = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    while current < target_date:
        dates.append(current)
        current += timedelta(days=1)
    return dates


def get_video_files(directory: Path) -> List[Path]:
    """Get all video files from directory"""
    if not directory.exists():
        raise FileNotFoundError(f"Video directory not found: {directory}")
    
    video_extensions = {".mp4", ".mov", ".avi", ".webm", ".m4v"}
    videos = [f for f in directory.iterdir() 
              if f.is_file() and f.suffix.lower() in video_extensions]
    videos.sort()  # Sort for sequential cycling
    return videos


def cycle_videos(videos: List[Path], count: int) -> List[Path]:
    """Cycle through videos to get the requested count"""
    if not videos:
        raise ValueError("No videos found")
    
    result = []
    for i in range(count):
        result.append(videos[i % len(videos)])
    return result


def get_caption(index: int) -> str:
    """Get a caption from the list, cycling through and replacing hashtags placeholder"""
    caption_template = CAPTIONS[index % len(CAPTIONS)]
    return caption_template.replace("{HASHTAGS}", HASHTAGS)


def format_datetime_for_api(date: datetime, hour: int, minute: int, timezone: str) -> str:
    """Format datetime for Late API (local time without Z)"""
    dt = date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    # Return in format: YYYY-MM-DDTHH:mm (no Z, timezone specified separately)
    return dt.strftime("%Y-%m-%dT%H:%M")


def main():
    """Main execution function"""
    print("🚀 Starting Late API Post Scheduler - DeenDecal4")
    print(f"Profile: {PROFILE_NAME}")
    print(f"Timezone: {TIMEZONE}")
    print(f"Video Directory: {VIDEO_DIR}")
    print()
    
    # Initialize API client
    client = LateAPIClient(LATE_API_KEY)
    
    # Use hardcoded account IDs
    profile_id = PROFILE_ID
    print(f"✅ Using profile ID: {profile_id}")
    print(f"✅ Instagram Account ID: {INSTAGRAM_ACCOUNT_ID}")
    print(f"✅ TikTok Account ID: {TIKTOK_ACCOUNT_ID}")
    print(f"✅ YouTube Account ID: {YOUTUBE_ACCOUNT_ID}")
    print()
    
    # Get video files
    print("🎥 Loading video files...")
    video_files = get_video_files(VIDEO_DIR)
    print(f"✅ Found {len(video_files)} videos")
    print()
    
    # Calculate date range
    today = datetime.now()
    next_month_start = get_next_month_start(today)
    dates = get_all_dates_until(next_month_start)
    
    print(f"📅 Scheduling posts from {today.strftime('%Y-%m-%d')} to {next_month_start.strftime('%Y-%m-%d')}")
    print(f"📊 Total days: {len(dates)}")
    print(f"📊 Total posts: {len(dates) * 10}")
    print()
    
    # Upload videos and create media items cache
    print("📤 Uploading videos to Late...")
    media_cache = {}  # Cache uploaded media URLs by file path
    uploaded_count = 0
    
    for video_file in video_files:
        if video_file not in media_cache:
            try:
                print(f"  Uploading {video_file.name}...")
                media_info = client.upload_media(video_file)
                media_cache[video_file] = {
                    "type": "video",
                    "url": media_info["url"],
                    "filename": media_info.get("filename", video_file.name)
                }
                uploaded_count += 1
            except Exception as e:
                print(f"  ❌ Error uploading {video_file.name}: {e}")
                continue
    
    print(f"✅ Uploaded {uploaded_count} videos")
    print()
    
    # Schedule posts
    print("📝 Scheduling posts...")
    video_index = 0
    total_scheduled = 0
    errors = []
    
    for date in dates:
        print(f"\n📅 {date.strftime('%Y-%m-%d')}:")
        
        # Get 10 videos for this day (cycling through)
        day_videos = cycle_videos(video_files, 10)
        
        for i, window in enumerate(POSTING_WINDOWS):
            # Get random time in window
            hour, minute = get_random_time_in_window(window[0], window[1])
            scheduled_time = format_datetime_for_api(date, hour, minute, TIMEZONE)
            
            # Get video for this post
            video_file = day_videos[i]
            if video_file not in media_cache:
                print(f"  ⚠️  Skipping {scheduled_time} - video not uploaded")
                continue
            
            media_item = media_cache[video_file]
            
            # Build platforms array with hardcoded account IDs
            platforms = [
                {
                    "platform": "instagram",
                    "accountId": INSTAGRAM_ACCOUNT_ID
                },
                {
                    "platform": "tiktok",
                    "accountId": TIKTOK_ACCOUNT_ID,
                    "platformSpecificData": {
                        "tiktokSettings": {
                            "privacy_level": "PUBLIC_TO_EVERYONE",
                            "allow_comment": True,
                            "allow_duet": True,
                            "allow_stitch": True,
                            "commercial_content_type": "none",
                            "content_preview_confirmed": True,
                            "express_consent_given": True
                        }
                    }
                },
                {
                    "platform": "youtube",
                    "accountId": YOUTUBE_ACCOUNT_ID,
                    "platformSpecificData": {
                        "title": f"DeenDecal Content - {date.strftime('%B %d, %Y')}",
                        "visibility": "public"
                    }
                }
            ]
            
            # Get caption (cycle through captions)
            caption = get_caption(total_scheduled)
            
            # Create post
            try:
                post_response = client.create_post(
                    content=caption,
                    platforms=platforms,
                    scheduled_for=scheduled_time,
                    timezone=TIMEZONE,
                    media_items=[media_item]
                )
                
                # Handle response structure (could be wrapped in 'post' key or direct)
                post_id = None
                if isinstance(post_response, dict):
                    if "post" in post_response:
                        post_id = post_response["post"].get("_id")
                    elif "_id" in post_response:
                        post_id = post_response["_id"]
                
                total_scheduled += 1
                post_id_str = post_id[:8] + "..." if post_id else "N/A"
                print(f"  ✅ {scheduled_time} - Scheduled (Post ID: {post_id_str})")
            except Exception as e:
                error_msg = f"  ❌ {scheduled_time} - Error: {str(e)}"
                print(error_msg)
                errors.append((scheduled_time, str(e)))
                
                # If rate limited, wait a bit before continuing
                if "rate limit" in str(e).lower():
                    print(f"  ⏳ Waiting 60 seconds due to rate limit...")
                    time.sleep(60)
    
    print()
    print("=" * 60)
    print(f"✅ Scheduling complete!")
    print(f"📊 Total posts scheduled: {total_scheduled}")
    if errors:
        print(f"⚠️  Errors: {len(errors)}")
        for time, error in errors[:5]:  # Show first 5 errors
            print(f"   - {time}: {error}")
        if len(errors) > 5:
            print(f"   ... and {len(errors) - 5} more errors")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

