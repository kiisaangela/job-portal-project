# GROUP 1
-MOKILI PROMISE PIERRE, M23B23/032
-NAJJUMA TEOPISTA, S23B23/041
-KIISA ANGELA GRACE, S23B23/027
-NZIRIGA ISAAC NICKSON, S23B23/046
-MUBIRU HUMPHREY, S23B23/035
-OGWANG ANDREW, S23B23/050


# Job Portal Application

A full-stack job portal application built with React, Node.js, Express, and MySQL.

## Features

- User authentication (JWT)
- Job posting for employers
- Job search and application for job seekers
- Modern and responsive UI with Material-UI
- Secure password hashing
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- MySQL (via XAMPP)
- npm or yarn

## Project Structure

```
project2/
├── client/              # React frontend
├── server/              # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project2
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the server directory with:
   ```
   PORT=5002
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=job_portal
   JWT_SECRET=123
   ```

3. **Set up the database**
   - Start XAMPP and ensure MySQL is running
   - Create a database named 'job_portal'
   - Import the schema from `server/database.sql`

4. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

5. **Start the application**
   
   In the server directory:
   ```bash
   npm run dev
   ```
   
   In the client directory:
   ```bash
   npm start
   ```

The server will run on http://localhost:5002 and the client on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Jobs
- GET `/api/jobs` - Get all jobs
- GET `/api/jobs/:id` - Get specific job
- POST `/api/jobs` - Create job (employers only)
- PUT `/api/jobs/:id` - Update job (employers only)
- DELETE `/api/jobs/:id` - Delete job (employers only)

### Applications
- POST `/api/applications/:jobId` - Apply for a job
- GET `/api/applications/user/applications` - Get user's applications
- GET `/api/applications/job/:jobId` - Get job applications (employers only)

## Security

- Passwords are hashed using bcrypt
- JWT for authentication
- Protected routes with middleware
- Input validation
- CORS enabled
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
