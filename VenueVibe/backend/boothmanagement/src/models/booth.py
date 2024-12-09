# models/booth.py
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import datetime, timedelta

class AvailabilityStatus(str, Enum):
    AVAILABLE = "available"
    BOOKED = "booked"
    UNAVAILABLE = "unavailable"

class BoothBase(BaseModel):
    event_id: str
    organizer_id: str
    booth_title: str
    booth_image: Optional[str] = None
    description: Optional[str] = None
    price: float
    size: int
    duration: int  # in days, now inferred
    date_from: datetime
    date_to: datetime
    availability_status: AvailabilityStatus = AvailabilityStatus.AVAILABLE
    postal_code: str = Field(..., pattern="^\d{6}$")

    @model_validator(mode="before")
    def calculate_duration(cls, values):
        date_from = values.get('date_from')
        date_to = values.get('date_to')
        if date_from and date_to:
            # Ensure at least 1 day duration for same-day events
            values['duration'] = max((date_to - date_from).days + 1, 1)
        return values

    model_config = ConfigDict(from_attributes=True)

class BoothCreate(BoothBase):
    model_config = ConfigDict(from_attributes=True)

class BoothUpdate(BaseModel):
    booth_title: Optional[str] = None
    booth_image: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    size: Optional[int] = None
    duration: Optional[int] = None
    date_from: Optional[datetime] = None  
    date_to: Optional[datetime] = None
    availability_status: Optional[AvailabilityStatus] = None
    postal_code: str = Field(..., pattern="^\d{6}$")

    model_config = ConfigDict(from_attributes=True)

class Booth(BoothBase):
    booth_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
