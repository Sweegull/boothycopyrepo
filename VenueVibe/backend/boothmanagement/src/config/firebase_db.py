# config/firebase_db.py
import os
import json
import base64
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, initialize_app

class FirestoreClient:
    def __init__(self, env_path: str = ".env"):
        # Load environment variables from .env file
        load_dotenv(env_path)

        # Retrieve the Base64-encoded JSON string from the environment variable
        service_account_b64 = os.getenv('FIREBASE_SERVICE_ACCOUNT_B64')
        if not service_account_b64:
            raise ValueError("FIREBASE_SERVICE_ACCOUNT_B64 is not set in the environment variables.")

        # Decode the Base64 string to get the JSON string
        service_account_json = base64.b64decode(service_account_b64).decode('utf-8')

        # Parse the JSON string into a dictionary
        service_account_info = json.loads(service_account_json)

        # Initialize Firebase app
        cred = credentials.Certificate(service_account_info)
        initialize_app(cred)

        # Initialize Firestore client
        self.client = firestore.client()

    def get_client(self):
        return self.client
