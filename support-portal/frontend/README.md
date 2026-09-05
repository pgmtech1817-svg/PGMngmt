PG Support Portal - Frontend

This React app is a simple UI for the PG Management Portal. It expects the backend API to be available at http://localhost:4000/api by default (Spring Boot backend created under backend-java).

Quick start:
1. cd frontend
2. npm install
3. npm start

Environment:
- REACT_APP_API_URL (optional) to target a different API base URL

Features included:
- Login page (POST /api/auth/login)
- Dashboard (fetches /api/customers & /api/tickets)
- Customers list & create (GET/POST /api/customers)
- Tickets list & create (GET/POST /api/tickets)

Notes:
- JWT token is stored in localStorage as "token" after login.
- The frontend uses minimal styling and plain fetch API in src/api.js.
- Ensure backend CORS allows requests from http://localhost:3000.
