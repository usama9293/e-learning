# E-Learning Platform

A full-stack e-learning platform built with React, FastAPI, and PostgreSQL.

## Project Structure

```
e-learning-platform/
├── e-learning-frontend/          # React frontend
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── admin/          # Admin dashboard and management
│   │   │   ├── tutor/          # Tutor dashboard and management
│   │   │   ├── student/        # Student dashboard and views
│   │   │   └── auth/           # Authentication pages
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API services
│   │   └── utils/              # Utility functions
│   └── package.json
│
└── e-learning-backend/          # FastAPI backend
    ├── app/
    │   ├── api/                # API routes
    │   │   └── api_v1/        # API version 1
    │   ├── core/              # Core functionality
    │   ├── models/            # Database models
    │   ├── schemas/           # Pydantic schemas
    │   └── services/          # Business logic
    └── requirements.txt
```

## API Routes

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token

### Admin Routes
- `GET /api/v1/admin/dashboard` - Get admin dashboard statistics
- `GET /api/v1/admin/users` - Get all users
- `POST /api/v1/admin/users` - Create new user
- `PUT /api/v1/admin/users/{user_id}` - Update user
- `DELETE /api/v1/admin/users/{user_id}` - Delete user
- `GET /api/v1/admin/courses` - Get all courses
- `POST /api/v1/admin/courses` - Create new course
- `PUT /api/v1/admin/courses/{course_id}` - Update course
- `DELETE /api/v1/admin/courses/{course_id}` - Delete course

### Tutor Routes
- `GET /api/v1/tutor/dashboard` - Get tutor dashboard
- `GET /api/v1/tutor/courses` - Get tutor's courses
- `POST /api/v1/tutor/courses/{course_id}/sessions` - Create session
- `PUT /api/v1/tutor/sessions/{session_id}` - Update session
- `DELETE /api/v1/tutor/sessions/{session_id}` - Delete session
- `POST /api/v1/tutor/courses/{course_id}/materials` - Upload course material

### Student Routes
- `GET /api/v1/student/dashboard` - Get student dashboard
- `GET /api/v1/student/courses` - Get enrolled courses
- `POST /api/v1/student/courses/{course_id}/enroll` - Enroll in course
- `GET /api/v1/student/sessions` - Get upcoming sessions
- `GET /api/v1/student/materials` - Get course materials

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   cd e-learning-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   ```

2. Install dependencies:
   ```bash
   cd e-learning-backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd e-learning-frontend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

### Admin Features
- Dashboard with statistics and analytics
- User management (students, tutors)
- Course management
- Session scheduling
- Payment tracking
- System logs

### Tutor Features
- Dashboard with course overview
- Session management
- Course material upload
- Student progress tracking
- Communication tools

### Student Features
- Course enrollment
- Session booking
- Material access
- Progress tracking
- Payment history

## Technologies Used

### Frontend
- React
- TypeScript
- Material-UI
- Recharts
- React Router
- Axios

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT Authentication
- Pydantic

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 