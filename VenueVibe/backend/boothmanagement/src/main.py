from fastapi import FastAPI, HTTPException, status, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from config.firebase_db import FirestoreClient
from services.booth_service import BoothService
from models.booth import Booth, BoothCreate, BoothUpdate
from typing import List
import uvicorn

app = FastAPI(title="Booth Listing Microservice")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:80", "http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router and prefix it with "/api"
router = APIRouter(prefix="/api")

firestore_client = FirestoreClient()
db = firestore_client.get_client()
booth_service = BoothService(db)

@router.post("/booths", response_model=Booth, status_code=status.HTTP_201_CREATED)
def create_booth(booth: BoothCreate, user_id: str = Query(..., description="ID of the user creating the booth")):
    """
    Create a new booth.
    Only the user who is the organizer can create a booth with their organizer_id.
    """
    if booth.organizer_id != user_id:
        raise HTTPException(status_code=403, detail="Organizer ID does not match the authenticated user.")
    created_booth = booth_service.create_booth(booth)
    return created_booth

@router.get("/booths/{booth_id}", response_model=Booth)
def get_booth(booth_id: str):
    """
    Retrieve a booth by its ID.
    """
    booth = booth_service.get_booth(booth_id)
    if not booth:
        raise HTTPException(status_code=404, detail="Booth not found.")
    return booth

@router.put("/booths/{booth_id}", response_model=Booth)
def update_booth(
    booth_id: str,
    booth_update: BoothUpdate,
    user_id: str = Query(..., description="ID of the user attempting to update the booth")
):
    """
    Update a booth.
    Only the organizer can update their booth.
    """
    try:
        updated_booth = booth_service.update_booth(booth_id, booth_update, user_id)
        if not updated_booth:
            raise HTTPException(status_code=404, detail="Booth not found.")
        return updated_booth
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))

@router.delete("/booths/{booth_id}", status_code=status.HTTP_200_OK)
def delete_booth(
    booth_id: str,
    user_id: str = Query(..., description="ID of the user attempting to delete the booth")
):
    """
    Delete a booth.
    Only the organizer can delete their booth.
    """
    try:
        success = booth_service.delete_booth(booth_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Booth not found.")
        return 
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))

@router.get("/booths", response_model=List[Booth])
def list_booths(limit: int = Query(100, ge=1, le=1000, description="Number of booths to retrieve")):
    """
    List all booths with an optional limit.
    """
    booths = booth_service.list_booths(limit)
    return booths

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)