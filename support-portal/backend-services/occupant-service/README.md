Occupant Service (placeholder)

This service will manage occupant lifecycle (onboarding, status transitions, bed assignment, leaving).

Currently a placeholder. Recommended implementation: Spring Boot microservice with DB (occupants table) and APIs:
- POST /api/occupants/signup
- POST /api/occupants/{id}/onboard
- GET /api/occupants/{id}

Port: 4002

I can scaffold this service fully if you want; it's left as a placeholder now to prioritize auth and pg services used by the frontend.
