# VenueVibe

## Getting Started

Follow these steps to set up and run the application locally:

### 1. Set up a Python Virtual Environment

If you’re using Python’s `venv`, run:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate

# On macOS and Linux
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run the backend servie
# You need to put a .env file with firebase credentials encoded in base64
python src/main.py
```

### 2. Install Node.js and npm

Download and install Node.js from [nodejs.org](https://nodejs.org/). This will also install npm (Node Package Manager).

### 3. Install Project Dependencies

Go to the frontend folder
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run serve
```

### 5. Build for Production
To create a production-ready build:
```bash
npm run build
```
