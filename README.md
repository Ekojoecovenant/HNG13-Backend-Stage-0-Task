# HNG13 Backend Stage 0 Task
#### HNG13 Internship Backend Project 1.
Backend Wizards — Stage 0 Task: Build a Dynamic Profile Endpoint

## Installation
```bash
git clone [https://github.com/Ekojoecovenant/HNG13-Backend-Stage-0-Task.git](https://github.com/Ekojoecovenant/HNG13-Backend-Stage-0-Task.git)
cd HNG13-Backend-Stage-0-Task
npm install
```

## Configuration (.env)
Create a file named .env and add the user details and configurations
```
# .env

# User Information
USER_EMAIL="covenantekojoe@gmail.com"
USER_NAME="Ekojoe Covenant Lemom"
USER_STACK="Node.js/Express"

# API Configuration
CAT_FACT_URL="https://catfact.ninja/fact"
API_TIMEOUT_MS=5000
PORT=3000
```

## Run the app
to start the application, run...
```bash
node server.js
```

## Testing the endpoint 

### Endpoint
Method|Path|Description
--|-----|--
GET|/me|"Returns user data, dynamic UTC timestamp, and a new cat fact."

### Test command
```bash
curl http://localhost:3000/me
```