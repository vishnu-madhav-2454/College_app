# Apex Academy - College Management System

A professional college management system for JEE, NEET, and EAMCET coaching institutes built with React and Node.js with PostgreSQL database.

## Features

- **Student Portal**: Attendance tracking, test scores, fee management
- **Teacher Portal**: Class schedules, student marks management
- **Junior Lecturer Portal**: Attendance marking, test marks entry
- **Public Website**: Programs, achievements, faculty, campus information
- **Admission System**: Online admission with auto-generated credentials

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- Lucide React Icons
- Recharts

### Backend
- Node.js with Express
- PostgreSQL 18
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js 18+
- PostgreSQL 18
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
cd College_app
```

### 2. Setup PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE college_app;
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# PostgreSQL Database Configuration
PGUSER=postgres
PGHOST=localhost
PGDATABASE=college_app
PGPASSWORD=your_password
PGPORT=5433

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### 4. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 5. Start the Application

**Start the server:**
```bash
cd server
npm run dev
```

The server will:
1. Connect to PostgreSQL
2. Create all tables automatically (from schema.sql)
3. Seed initial data if tables are empty

**Start the client:**
```bash
cd client
npm run dev
```

## Default Login Credentials

After the database is seeded, you can use these test accounts:

### Students
| Email | Password | Program |
|-------|----------|---------|
| rohan.jee@apex.edu | password123 | JEE |
| ananya.neet@apex.edu | password123 | NEET |
| karthik.eamcetmpc@apex.edu | password123 | EAMCET MPC |
| sneha.eamcetbipc@apex.edu | password123 | EAMCET BiPC |

### Teachers
| Email | Password | Subject |
|-------|----------|---------|
| teacher.radhakrishnan@apex.edu | password123 | Physics |
| teacher.varma@apex.edu | password123 | Chemistry |

### Junior Lecturers
| Email | Password | Department |
|-------|----------|------------|
| jl.suresh@apex.edu | password123 | MPC Wing |
| jl.harika@apex.edu | password123 | BiPC Wing |

## API Endpoints

### Public
- `GET /api/public/home-data` - Get homepage data

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Student
- `GET /api/student/dashboard` - Dashboard data
- `GET /api/student/fees` - Fee details
- `POST /api/student/fees/pay` - Pay fee
- `GET /api/student/tests` - Test scores
- `GET /api/student/attendance` - Attendance records

### Teacher
- `GET /api/teacher/classes-today` - Today's classes
- `GET /api/teacher/student-marks` - Student marks

### Junior Lecturer
- `GET /api/jl/metadata` - Programs, sections, tests
- `GET /api/jl/attendance` - Attendance sheet
- `POST /api/jl/attendance/update` - Update attendance
- `GET /api/jl/marks` - Test marks sheet
- `POST /api/jl/marks/save` - Save marks

### Admission
- `POST /api/admission/apply` - New admission

## Database Schema

The application uses the following PostgreSQL tables:

- `users` - User accounts
- `students` - Student profiles
- `teachers` - Teacher profiles
- `branches` - Campus locations
- `faculty` - Faculty information
- `achievements` - Student achievements
- `fee_payments` - Payment records
- `classes_schedule` - Class schedules
- `tests` - Test information
- `test_scores` - Student test scores
- `attendance` - Attendance records

## Project Structure

```
College_app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── db/
│   │       ├── schema.sql  # Database schema
│   │       └── pgPool.js   # PostgreSQL connection
│   └── package.json
└── README.md
```

## Development

### Run in Development Mode

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### Build for Production

```bash
# Build client
cd client
npm run build

# Start server
cd server
npm start
```

## License

MIT License
