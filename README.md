# FoodGenieApp

A MERN-based food ordering application with AI-powered recipe generation, restaurant search, cart and checkout, user authentication, and admin controls.

## Features

- Restaurant listing and menu browsing
- Cart management and order checkout
- User registration, login, profile update, password reset
- AI recipe generation using Groq SDK
- Stripe payment integration
- Cloudinary-based image upload for users and restaurants
- Admin controls for restaurant management

## Technologies

- Frontend: React, Vite, React Router, Redux Toolkit, Axios, React Bootstrap
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, cookie authentication
- Payment: Stripe
- AI: Groq AI recipe generator
- Cloud storage: Cloudinary

## Repository Structure

```
frontend/       # React/Vite frontend application
backend/        # Express backend API and server
  controllers/  # Route handlers
  models/       # Mongoose models
  routes/       # Express routes
  services/     # AI and helper services
  utils/        # Utility functions (email, tokens, error handling)
  config/       # Cloudinary / database configuration
```

## Prerequisites

- Node.js 18+ / npm
- MongoDB instance or Atlas cluster
- Stripe account and API keys
- Cloudinary account
- Groq AI API key (for recipe generation)

## Backend Setup

1. Open a terminal and install backend dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` and set these environment variables:

```env
PORT=4000
NODE_ENV=DEVELOPMENT
DB_LOCAL_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_EXPIRES_TIME=7
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_key
CLOUDINARY_API_SECRET=your_cloud_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_API_KEY=your_stripe_publishable_key
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM="FoodGenie <no-reply@foodgenie.com>"
GROQ_API_KEY=your_groq_api_key
```

3. Start the backend server:

```bash
npm run dev
```

## Frontend Setup

1. Open a second terminal and install frontend dependencies:

```bash
cd frontend
npm install
```

2. If required, add a `.env` file to the frontend root with:

```env
VITE_API_URL=http://localhost:4000
```

3. Start the frontend development server:

```bash
npm run dev
```

## How to Use

- Visit `http://localhost:5173`
- Browse restaurants and add items to the cart
- Register or login to place orders
- Use the Recipe Generator page to generate recipes from ingredients
- Checkout using Stripe in the cart flow

## Notes

- The recipe generator requires a valid `GROQ_API_KEY`.
- Stripe payments require both publishable and secret keys.
- Cloudinary uploads require Cloudinary account credentials.
- If email is not configured, password reset and order emails may not send.

## Run Scripts

### Backend

- `npm run dev` — start the backend with `nodemon`
- `npm start` — start backend using `nodemon server.js`
- `npm run prod` — start backend in production mode
- `npm run seeder` — run the seeder script

### Frontend

- `npm run dev` — start the Vite development server
- `npm run build` — build the production frontend
- `npm run preview` — preview the production build

## License

ISC
