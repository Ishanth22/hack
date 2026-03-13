from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime
from app.database import get_db
from app.schemas.startup_schema import StartupCreate, StartupResponse
from app.utils.helpers import serialize_doc, serialize_docs, validate_object_id

router = APIRouter()

# In-memory fallback store
_in_memory_startups = {}
_startup_counter = 0


def get_storage():
    db = get_db()
    return db, db is None


@router.post("/startups", status_code=status.HTTP_201_CREATED)
async def create_startup(startup: StartupCreate):
    global _startup_counter
    db, use_memory = get_storage()

    data = startup.model_dump()
    data["created_at"] = datetime.utcnow()

    if use_memory:
        _startup_counter += 1
        id_str = f"startup_{_startup_counter}"
        data["id"] = id_str
        _in_memory_startups[id_str] = data
        return data
    else:
        result = db.startups.insert_one(data)
        inserted = db.startups.find_one({"_id": result.inserted_id})
        return serialize_doc(inserted)


@router.get("/startups")
async def get_all_startups():
    db, use_memory = get_storage()

    if use_memory:
        return list(_in_memory_startups.values())
    
    startups = list(db.startups.find())
    return serialize_docs(startups)


@router.get("/startups/{startup_id}")
async def get_startup(startup_id: str):
    db, use_memory = get_storage()

    if use_memory:
        startup = _in_memory_startups.get(startup_id)
        if not startup:
            raise HTTPException(status_code=404, detail="Startup not found")
        return startup

    if not validate_object_id(startup_id):
        raise HTTPException(status_code=400, detail="Invalid startup ID")

    startup = db.startups.find_one({"_id": ObjectId(startup_id)})
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return serialize_doc(startup)


@router.delete("/startups/{startup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_startup(startup_id: str):
    db, use_memory = get_storage()

    if use_memory:
        if startup_id not in _in_memory_startups:
            raise HTTPException(status_code=404, detail="Startup not found")
        del _in_memory_startups[startup_id]
        return

    if not validate_object_id(startup_id):
        raise HTTPException(status_code=400, detail="Invalid startup ID")

    result = db.startups.delete_one({"_id": ObjectId(startup_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Startup not found")
