# services/booth_service.py
from firebase_admin import firestore
from typing import List, Optional
from models.booth import Booth, BoothCreate, BoothUpdate
from datetime import datetime, timezone

class BoothService:
    def __init__(self, db: firestore.Client):
        self.db = db
        self.collection = self.db.collection('booths')

    def create_booth(self, booth_data: BoothCreate) -> Booth:
        now = datetime.now(timezone.utc)
        booth_dict = booth_data.model_dump()
        booth_dict.update({
            'created_at': now,
            'updated_at': now
        })
        doc_ref = self.collection.add(booth_dict)
        booth_id = doc_ref[1].id
        booth = Booth(booth_id=booth_id, **booth_dict)
        return booth

    def get_booth(self, booth_id: str) -> Optional[Booth]:
        doc = self.collection.document(booth_id).get()
        if doc.exists:
            data = doc.to_dict()
            return Booth(booth_id=booth_id, **data)
        return None

    def update_booth(self, booth_id: str, booth_data: BoothUpdate, user_id: str) -> Optional[Booth]:
        doc_ref = self.collection.document(booth_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        existing_data = doc.to_dict()
        if existing_data.get('organizer_id') != user_id:
            raise PermissionError("You do not have permission to update this booth.")

        update_data = booth_data.model_dump(exclude_unset=True)
        if update_data:
            update_data['updated_at'] = datetime.now(timezone.utc)
            doc_ref.update(update_data)
            updated_doc = doc_ref.get().to_dict()
            return Booth(booth_id=booth_id, **updated_doc)
        return Booth(booth_id=booth_id, **existing_data)

    def delete_booth(self, booth_id: str, user_id: str) -> bool:
        doc_ref = self.collection.document(booth_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False
        existing_data = doc.to_dict()
        if existing_data.get('organizer_id') != user_id:
            raise PermissionError("You do not have permission to delete this booth.")
        doc_ref.delete()
        return True

    def list_booths(self, limit: int = 100) -> List[Booth]:
        booths = []
        docs = self.collection.limit(limit).stream()
        for doc in docs:
            data = doc.to_dict()
            booths.append(Booth(booth_id=doc.id, **data))
        return booths
