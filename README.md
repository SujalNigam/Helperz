# Helperz

Helperz is a full-stack home-services platform built with the MERN stack. It allows customers to discover services, view availability, and make bookings, while providers can manage their services, availability, and bookings.

> **Project status:** V1

## Features

### Customer
- Register and log in
- Browse available services
- View service details
- View available booking slots
- Create and cancel bookings
- View upcoming and past bookings
- Manage profile

### Provider
- Register and log in as a provider
- Create, edit, and delete services
- Upload service images
- Configure working days and available times
- Generate availability slots
- Block and unblock available slots
- View and manage bookings
- Accept or reject booking requests
- View bookings by upcoming/past status

### Admin
- Admin dashboard
- View users
- Manage user access through block/unblock functionality

## Tech Stack

### Frontend
- React
- Vite
- React Router
- TanStack React Query
- Zustand
- React Hook Form
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Cloudinary
- Multer

## Architecture

Helperz follows a typical client-server architecture:

```text
React Frontend
      |
      | HTTP / REST API
      v
Express Backend
      |
      +---- MongoDB
      |
      +---- Cloudinary
```

The frontend communicates with the backend through REST APIs. Authentication and authorization are handled on the server, while TanStack React Query is used on the client for server-state fetching and caching.

## Project Structure

```text
Helperz/
├── FrontEnd/
│   └── Helperz/
│       └── src/
│           ├── api/
│           ├── components/
│           ├── pages/
│           │   ├── admin/
│           │   ├── customer/
│           │   └── provider/
│           ├── store/
│           └── utils/
│
└── helperz-backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/
```

## Authentication & Authorization

Helperz uses token-based authentication.

The application supports three roles:

- **Customer**
- **Provider**
- **Admin**

Protected functionality is restricted according to the authenticated user's role.

## Booking & Availability

Providers can configure their availability for individual services. Customers can then view available slots and book a suitable time.

Bookings support statuses such as:

- Pending
- Accepted
- Rejected
- Cancelled

Availability slots can be:

- Available
- Booked
- Blocked

## Pagination & Client-side Data Management

Service and booking listings are paginated. Rather than a plain `.skip().limit()` query, booking pagination is implemented as a MongoDB aggregation pipeline: a single query uses `$facet` to return both the total count and the paginated page of results together, joined against slot data via `$lookup`/`$unwind` so that bookings can be filtered into upcoming/past based on the actual appointment date and time before pagination is applied.

TanStack React Query handles fetching and caching of this data on the client, including query invalidation after relevant mutations so updated data is refetched when needed. This caching is client-side only — it reduces redundant requests and makes navigation feel instant, but it isn't a substitute for a server-side cache (e.g. Redis) and doesn't reduce database load.

## Environment Variables

The application requires environment-specific configuration for the backend and frontend.

Typical backend configuration includes:

```text
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
PORT=
```

Frontend configuration should contain the backend API base URL used by the Axios client.

> Do not commit `.env` files or secret credentials to the repository.

## Running Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd Helperz
```

### 2. Start the backend

```bash
cd helperz-backend
npm install
npm run dev
```

### 3. Start the frontend

Open another terminal:

```bash
cd FrontEnd/Helperz
npm install
npm run dev
```

The frontend and backend should be configured with their respective environment variables before starting the application.

## Production Build

To create a frontend production build:

```bash
cd FrontEnd/Helperz
npm run build
```

## Known Limitations

- Admin functionality is still under development and is not exposed through the public registration flow.
- Booking creation is not yet fully atomic: two customers booking the same slot at nearly the same instant could both pass the availability check before either write completes. This is currently mitigated only by a unique compound index on the Slot collection; a MongoDB transaction (or a conditional atomic update) would close this gap for production use.
- No server-side caching layer (e.g. Redis) is currently used — TanStack React Query handles caching on the client only.
- Search and advanced service filtering are not part of the current V1.
- Payment integration is not included in V1.
- Notification and messaging functionality is not currently implemented.
- The application is currently focused on the core booking workflow rather than a complete production marketplace.
- Automated test coverage is limited in the current version.

## Future Improvements

Potential improvements for future versions include:

- Service search and filtering
- More advanced provider profiles
- Ratings and reviews
- Online payments
- Notifications
- Improved admin management
- Automated testing
- MongoDB transactions for critical booking operations
- Server-side caching with Redis
- Performance and accessibility improvements

## Disclaimer

Helperz is a learning and portfolio project focused on building and understanding a full-stack booking workflow using modern JavaScript technologies.
