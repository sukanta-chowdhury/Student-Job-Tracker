# Student Job Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application designed for students to track and manage their job applications during the job search process.

## Features

- **User Authentication:** Register, login, and secure user profiles
- **Job Application Tracking:** Add, edit, and delete job applications
- **Dashboard:** View job application statistics and status
- **Status Updates:** Track application status (Applied, Interview, Offer, Rejected, Saved)
- **Filtering & Sorting:** Filter job applications by status, company, position, etc.
- **Responsive Design:** Works on desktop and mobile devices

## Technology Stack

### Frontend
- React
- React Router for routing
- Context API for state management
- Axios for API requests
- CSS for styling

### Backend
- Node.js
- Express.js framework
- MongoDB database
- Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB installed locally or access to MongoDB Atlas

### Installation

1. Clone the repository
```
git clone https://github.com/sukanta-chowdhury/Student-Job-Tracker.git
cd Student-Job-Tracker
```

2. Install dependencies for server and client
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application
```
# Run both server and client concurrently
npm run dev

# Run server only
npm run server

# Run client only
npm run client
```

## API Endpoints

### Auth
- `POST /api/users` - Register a user
- `POST /api/auth` - Authenticate user & get token
- `GET /api/auth` - Get logged in user

### Jobs
- `GET /api/jobs` - Get all jobs for a user
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create a job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job

## Future Enhancements

- Drag and drop interface for status updates
- Email notifications for job application updates
- Calendar integration for interview scheduling
- Resume/cover letter storage
- Analytics and insights for application patterns

## License

This project is licensed under the MIT License 