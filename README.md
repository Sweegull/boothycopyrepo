# Boothy (VenueVibe)

## Public deployment:

The public deployment of our code is available at: `http://35.193.112.115:52233`

## Environment setup for local deployment

### Prerequisite

Make sure you have `python 3` and `npm` installed on your local machine

Make sure you have generated your firebase api key and set the environment FIREBASE_SERVICE_ACCOUNT_B64 in the .env file
```bash
echo FIREBASE_SERVICE_ACCOUNT_B64={YOUR_FIREBASE_SERVICE_ACCOUNT_BASE64_ENCODED} > ./VenueVibe/backend/boothmanagement/.env
```

Change the code in `./VenueVibe/frontend/src/services/api.js`to point to the address of your backend server: 
```js
const boothAPI = axios.create({
  baseURL: 'http://localhost:8081/api', // Booth Listing service URL
});
```

### Installation for backend

If you have docker installed on your local desktop, you can use docker to start the backend:
`docker compose up`

Otherwise, you can create a python virtual environment and run the python service manually:
```bash
# Create the virtual environment
python3 -m venv .venv
# Activate the virtual environment
source .venv/bin/activate  # The actual command depends on your os
# Change directory
cd ./VenueVibe/backend/boothmanagement
# Start the backend service
python src/main.py
```

### Installation for frontend

Install dependencies and run the server
```bash
# Change directory
cd ./VenueVibe/frontend
# Install dependencies
npm i
# Run the server
npm run serve
```
