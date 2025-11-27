# Late API Social Media Post Scheduler

This script automatically schedules posts to Instagram, TikTok, and YouTube using the Late API. It schedules 10 posts per day at random times within specified windows until the first of next month.

## Features

- ✅ Posts to Instagram, TikTok, and YouTube simultaneously
- ✅ 10 posts per day at random times within specified windows
- ✅ Cycles through videos sequentially
- ✅ Automatically schedules from today until the first of next month
- ✅ Uploads videos to Late's media endpoint
- ✅ Repeats videos if needed to reach 10 posts per day

## Setup

✅ **Everything is already configured!** Your API key, account IDs, and profile are all set up.

### Quick Start

1. **Activate the virtual environment (if not already active):**
   ```bash
   cd socialMedia
   source venv/bin/activate
   ```

2. **Run the script:**
   ```bash
   python schedule_posts.py
   ```

That's it! The script will:
- Upload all videos from `used2/` folder
- Schedule 10 posts per day until the end of the month
- Post to Instagram, TikTok, and YouTube simultaneously

### What's Already Configured

✅ **API Key**: Already set in script and `.env` file  
✅ **Account IDs**: TikTok, Instagram, YouTube IDs are hardcoded  
✅ **Profile ID**: `692847c0f209987ce22ce1d8`  
✅ **Videos**: 31 videos found in `used2/` folder  
✅ **Dependencies**: Installed in virtual environment  

### Configuration (Optional)

If you need to change settings, edit `.env`:
- `LATE_API_KEY`: Your Late API key (already set)
- `LATE_PROFILE_NAME`: Profile name (default: deendecal1)
- `TIMEZONE`: Timezone for scheduling (default: America/New_York)
- `VIDEO_DIR`: Directory containing videos (default: used2)

## Usage

Run the script:
```bash
python schedule_posts.py
```

The script will:
1. Connect to your Late profile
2. Find connected Instagram, TikTok, and YouTube accounts
3. Upload all videos from the `used2` directory
4. Schedule 10 posts per day at random times within these windows:
   - 5-6 AM
   - 7-8 AM
   - 10-11 AM
   - 12-1 PM
   - 2-3 PM
   - 3-4 PM
   - 5-6 PM
   - 7-8 PM
   - 9-10 PM
   - 11-12 PM
5. Continue scheduling until the first of next month

## Posting Windows

Posts are scheduled at random times within these windows:
- 5-6 AM
- 7-8 AM
- 10-11 AM
- 12-1 PM
- 2-3 PM
- 3-4 PM
- 5-6 PM
- 7-8 PM
- 9-10 PM
- 11-12 PM

## Customization

### Change Caption
Edit the `DEFAULT_CAPTION` variable in `schedule_posts.py`:
```python
DEFAULT_CAPTION = "Your custom caption here! 🎥✨"
```

### Change Posting Windows
Edit the `POSTING_WINDOWS` list in `schedule_posts.py`:
```python
POSTING_WINDOWS = [
    (5, 6),   # 5-6 AM
    (7, 8),   # 7-8 AM
    # ... add more windows
]
```

## Notes

- Videos are uploaded once and reused for scheduling
- If you run the script multiple times, it will create duplicate posts (Late API doesn't prevent this)
- The script schedules posts, it doesn't publish them immediately
- Make sure your Late account has sufficient post quota for the number of posts being scheduled

## Troubleshooting

**Error: Profile not found**
- Verify the profile name in `.env` matches your Late profile name

**Error: No active accounts found**
- Ensure Instagram, TikTok, and/or YouTube accounts are connected to the profile
- Check that accounts are active in the Late dashboard

**Error: Video directory not found**
- Verify the `VIDEO_DIR` path in `.env` is correct
- Ensure the directory contains video files

**Error: API rate limit**
- The script may hit rate limits if scheduling many posts
- Consider running it during off-peak hours or splitting into multiple runs
