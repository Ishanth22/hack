from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import get_db
from app.utils.helpers import serialize_doc, serialize_docs, validate_object_id
from app.analytics.scoring import calculate_health_score, calculate_startup_momentum
from app.analytics.risk_detection import detect_risks, estimate_risk_probability
from app.analytics.runway import calculate_runway
from app.analytics.sentiment import fetch_startup_news, aggregate_sentiment
from app.routes.startup_routes import _in_memory_startups
from app.routes.metrics_routes import _in_memory_metrics

router = APIRouter()


def get_storage():
    db = get_db()
    return db, db is None


def _get_metrics_for_startup(startup_id: str, db, use_memory: bool):
    if use_memory:
        startup_metrics = _in_memory_metrics.get(startup_id, {})
        return sorted(startup_metrics.values(), key=lambda x: x["month"])
    return serialize_docs(list(db.metrics.find({"startup_id": startup_id}, sort=[("month", 1)])))


def _get_all_startups_list(db, use_memory: bool):
    if use_memory:
        return list(_in_memory_startups.values())
    return serialize_docs(list(db.startups.find()))


@router.get("/startup/{startup_id}/analysis")
async def get_startup_analysis(startup_id: str):
    """Full analysis for a startup: health score, momentum, risks, news."""
    db, use_memory = get_storage()

    # Get startup info
    if use_memory:
        startup = _in_memory_startups.get(startup_id)
    else:
        if not validate_object_id(startup_id):
            raise HTTPException(status_code=400, detail="Invalid startup ID")
        startup_doc = db.startups.find_one({"_id": ObjectId(startup_id)})
        startup = serialize_doc(startup_doc) if startup_doc else None

    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    # Get metrics
    metrics = _get_metrics_for_startup(startup_id, db, use_memory)

    # Calculate analytics
    health_score = calculate_health_score(metrics)
    momentum = calculate_startup_momentum(metrics)
    risks = detect_risks(metrics)
    risk_estimate = estimate_risk_probability(metrics)

    # Latest metrics
    latest = metrics[-1] if metrics else {}
    runway = None
    if latest:
        runway = calculate_runway(latest.get("funding_raised", 0), latest.get("burn_rate", 1))

    # News sentiment
    news = fetch_startup_news(startup["name"])
    sentiment = aggregate_sentiment(news)

    return {
        "startup": startup,
        "metrics_history": metrics,
        "analytics": {
            "health_score": health_score,
            "momentum": momentum,
            "runway_months": runway,
            "risk_probability": risk_estimate,
            "alerts": risks,
            "sentiment": sentiment,
            "news": news
        }
    }


@router.get("/leaderboard")
async def get_leaderboard():
    """Ranked list of startups by health score and momentum."""
    db, use_memory = get_storage()
    startups = _get_all_startups_list(db, use_memory)

    ranked = []
    for startup in startups:
        sid = startup.get("id") or str(startup.get("_id", ""))
        metrics = _get_metrics_for_startup(sid, db, use_memory)

        health_score = calculate_health_score(metrics)
        momentum = calculate_startup_momentum(metrics)
        risk_estimate = estimate_risk_probability(metrics)

        latest = metrics[-1] if metrics else {}
        runway = None
        if latest:
            runway = calculate_runway(
                latest.get("funding_raised", 0),
                latest.get("burn_rate", 1)
            )

        ranked.append({
            "id": sid,
            "name": startup["name"],
            "sector": startup["sector"],
            "stage": startup["stage"],
            "location": startup["location"],
            "health_score": health_score,
            "momentum": momentum,
            "runway_months": runway,
            "risk_level": risk_estimate["risk_level"],
            "metrics_count": len(metrics)
        })

    ranked.sort(key=lambda x: (x["health_score"], x["momentum"]), reverse=True)
    for i, item in enumerate(ranked):
        item["rank"] = i + 1

    return ranked


@router.get("/analytics/overview")
async def get_overview():
    """System-wide overview stats."""
    db, use_memory = get_storage()
    startups = _get_all_startups_list(db, use_memory)

    total_startups = len(startups)
    sectors = {}
    stages = {}

    scores = []
    momentums = []

    for startup in startups:
        sid = startup.get("id") or str(startup.get("_id", ""))
        metrics = _get_metrics_for_startup(sid, db, use_memory)

        sectors[startup["sector"]] = sectors.get(startup["sector"], 0) + 1
        stages[startup["stage"]] = stages.get(startup["stage"], 0) + 1

        if metrics:
            scores.append(calculate_health_score(metrics))
            momentums.append(calculate_startup_momentum(metrics))

    avg_health = round(sum(scores) / len(scores), 1) if scores else 0
    avg_momentum = round(sum(momentums) / len(momentums), 1) if momentums else 0

    return {
        "total_startups": total_startups,
        "avg_health_score": avg_health,
        "avg_momentum": avg_momentum,
        "sector_distribution": sectors,
        "stage_distribution": stages,
    }


@router.get("/analytics/sentiment/{startup_id}")
async def get_startup_sentiment(startup_id: str):
    """Get news sentiment for a startup."""
    db, use_memory = get_storage()

    if use_memory:
        startup = _in_memory_startups.get(startup_id)
    else:
        if not validate_object_id(startup_id):
            raise HTTPException(status_code=400, detail="Invalid startup ID")
        doc = db.startups.find_one({"_id": ObjectId(startup_id)})
        startup = serialize_doc(doc) if doc else None

    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    news = fetch_startup_news(startup["name"])
    sentiment = aggregate_sentiment(news)
    return {"startup_name": startup["name"], "sentiment": sentiment, "articles": news}
