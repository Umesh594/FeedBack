# Feedback Collection Platform

  A full-stack web application that allows admins to create customizable feedback forms and allows users to submit responses via a public URL without logging in.

 # Features Overview

 # Admin
- Register and Login
- Create feedback forms with customizable questions
- Generate public URL for each form
- View responses in:
  - Tabular format
  - Summary view
- Export as CSV file

 # User
- Access feedback form via public URL
- Submit feedback without login
- Real time validations for required fields

 # Tech Stack

  # Backend:
- Node.js, Express.js
- MongoDB, Mongoose
- JWT for authentication
- CORS, dotenv

  # Frontend:
- React.js
- Axios for HTTP requests
- React Router DOM for routing
- Tailwind CSS for responsive design

  
  # Approach & Design Decisions

  # Authentication
- JWT based login system for Admins to ensure secure access to form creation and dashboards.
- Public routes for users to submit feedback without creating an account.

  # Form Creation
- Admins can add multiple types of questions which are text and multiple choice when creating a form.
- Each form has a unique ID that generates a public URL.

  # Dashboard & Data Handling
- Admin dashboard shows summary view.
- CSV export.

  # UI/UX
- Mobile responsive design.
- Smooth transitions and clean layout.
- Focus on intuitive user experience for easy form filling and submission.

  # Running the Project Locally

  # Prerequisites
- Node.js installed
- MongoDB URI
- Git
- VS CODE or any other development tool

  # Clone the Repository
- git clone https://github.com/Umesh594/FeedBack.git
- cd FeedBack

  # Backend Setup
- cd backend
- npm install
-  Create .env file in backend with  
-  MONGO_URI=your own mongodb connection string
-  JWT_SECRET=your own jwt secret key
-  PORT=your own port number
-  ADMIN_CODE=your own admin code
  # Run Backend
-  nodemon server.js

  # Frontend Setup
- cd frontend
- npm install
  # Run Frontend
- npm run dev

  # Live Project

- Deployed on Vercel (Frontend) and Railway (Backend)
- Live Link : https://feed-back-brown.vercel.app/
