# E-Learning Platform Frontend

A modern e-learning platform built with React, TypeScript, and Material-UI. The platform supports three user roles: students, tutors, and administrators.

## Features

- Role-based access control
- Student dashboard with course progress tracking
- Tutor dashboard with course management and student monitoring
- Admin dashboard with user management and system statistics
- Modern, responsive UI using Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-learning-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your default browser at `http://localhost:3000`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components for different roles
│   ├── admin/     # Admin-specific pages
│   ├── student/   # Student-specific pages
│   ├── tutor/     # Tutor-specific pages
│   └── auth/      # Authentication pages
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Technologies Used

- React 18
- TypeScript
- Material-UI
- React Router
- Vite 