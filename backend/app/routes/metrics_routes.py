from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime
from app.database import get_db
from app.schemas.metrics_schema import MetricsCreate
from app.utils.helpers import serialize_doc, serialize_docs, validate_object_id

router = APIRouter()

_in_memory_metrics = {}
_metrics_counter = 0


def get_storage():
    db = get_db()
    return db, db is None


@router.post("/metrics", status_code=status.HTTP_201_CREATED)
async def submit_metrics(metrics: MetricsCreate):
    global _metrics_counter
    db, use_memory = get_storage()

    data = metrics.model_dump()
    data["created_at"] = datetime.utcnow()

    if use_memory:
        _metrics_counter += 1
        id_str = f"metric_{_metrics_counter}"
        data["id"] = id_str
        if data["startup_id"] not in _in_memory_metrics:
            _in_memory_metrics[data["startup_id"]] = {}
        _in_memory_metrics[data["startup_id"]][data["month"]] = data
        return data
    else:
        # Check for duplicate month entry
        existing = db.metrics.find_one({
            "startup_id": data["startup_id"],
            "month": data["month"]
        })
        if existing:
            # Update instead
            db.metrics.update_one(
                {"startup_id": data["startup_id"], "month": data["month"]},
                {"$set": data}
            )
            updated = db.metrics.find_one({"startup_id": data["startup_id"], "month": data["month"]})
            return serialize_doc(updated)

        result = db.metrics.insert_one(data)
        inserted = db.metrics.find_one({"_id": result.inserted_id})
        return serialize_doc(inserted)


@router.get("/metrics/{startup_id}")
async def get_startup_metrics(startup_id: str):
    db, use_memory = get_storage()

    if use_memory:
        startup_metrics = _in_memory_metrics.get(startup_id, {})
        return sorted(startup_metrics.values(), key=lambda x: x["month"])

    metrics = list(db.metrics.find(
        {"startup_id": startup_id},
        sort=[("month", 1)]
    ))
    return serialize_docs(metrics)
