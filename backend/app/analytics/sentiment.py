import os
import requests
from typing import List, Dict, Any, Optional

from dotenv import load_dotenv
# Load .env file from the project root (one level above backend directory)
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(dotenv_path)

try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False


NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
NEWS_API_URL = "https://newsapi.org/v2/everything"


def fetch_startup_news(startup_name: str, page_size: int = 5) -> List[Dict[str, Any]]:
    """Fetch recent news articles about a startup."""
    if not NEWS_API_KEY:
        return _mock_news(startup_name)

    try:
        resp = requests.get(
            NEWS_API_URL,
            params={
                "q": f'"{startup_name}" startup India',
                "apiKey": NEWS_API_KEY,
                "pageSize": page_size,
                "language": "en",
                "sortBy": "publishedAt"
            },
            timeout=5
        )
        if resp.status_code != 200:
            return _mock_news(startup_name)

        articles = resp.json().get("articles", [])
        return [
            {
                "title": a.get("title", ""),
                "source": a.get("source", {}).get("name", "Unknown"),
                "url": a.get("url", ""),
                "published_at": a.get("publishedAt", ""),
                "sentiment": _analyze_sentiment(a.get("title", ""))
            }
            for a in articles if a.get("title")
        ]
    except Exception:
        return _mock_news(startup_name)


def _analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze sentiment of text."""
    if not TEXTBLOB_AVAILABLE or not text:
        return {"polarity": 0.0, "label": "Neutral", "score": 0.5}

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        label = "Positive"
    elif polarity < -0.1:
        label = "Negative"
    else:
        label = "Neutral"

    # Normalize to 0-1
    score = (polarity + 1) / 2

    return {
        "polarity": round(polarity, 3),
        "label": label,
        "score": round(score, 3)
    }


def _mock_news(startup_name: str) -> List[Dict[str, Any]]:
    """Return mock news when API key is not available."""
    mock_articles = [
        {
            "title": f"{startup_name} raises Series B funding to expand operations",
            "source": "Economic Times",
            "url": "#",
            "published_at": "2025-01-15T10:00:00Z",
            "sentiment": {"polarity": 0.4, "label": "Positive", "score": 0.7}
        },
        {
            "title": f"{startup_name} reports 3x revenue growth in Q4 2024",
            "source": "YourStory",
            "url": "#",
            "published_at": "2025-01-10T08:30:00Z",
            "sentiment": {"polarity": 0.6, "label": "Positive", "score": 0.8}
        },
        {
            "title": f"{startup_name} faces regulatory scrutiny amid market expansion",
            "source": "Mint",
            "url": "#",
            "published_at": "2025-01-05T12:00:00Z",
            "sentiment": {"polarity": -0.2, "label": "Negative", "score": 0.4}
        }
    ]
    return mock_articles


def aggregate_sentiment(articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate overall sentiment from list of articles."""
    if not articles:
        return {"overall": "Neutral", "score": 0.5, "positive": 0, "neutral": 0, "negative": 0}

    sentiments = [a["sentiment"] for a in articles if "sentiment" in a]
    avg_polarity = sum(s["polarity"] for s in sentiments) / len(sentiments)
    avg_score = sum(s["score"] for s in sentiments) / len(sentiments)

    counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    for s in sentiments:
        counts[s["label"]] = counts.get(s["label"], 0) + 1

    if avg_polarity > 0.05:
        overall = "Positive"
    elif avg_polarity < -0.05:
        overall = "Negative"
    else:
        overall = "Neutral"

    return {
        "overall": overall,
        "score": round(avg_score, 3),
        "polarity": round(avg_polarity, 3),
        "positive": counts.get("Positive", 0),
        "neutral": counts.get("Neutral", 0),
        "negative": counts.get("Negative", 0),
        "total": len(articles)
    }
