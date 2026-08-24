-- Apex Academy PostgreSQL Database Schema
CREATE TABLE IF NOT EXISTS branches (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  total_students INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  facilities JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS faculty (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  experience INTEGER DEFAULT 0,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  photo TEXT NOT NULL,
  bio TEXT NOT NULL,
  achievements TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(50) PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  exam VARCHAR(100) NOT NULL,
  rank VARCHAR(100) NOT NULL,
  score VARCHAR(100) NOT NULL,
  year VARCHAR(20) NOT NULL,
  program VARCHAR(50) NOT NULL,
  college_allotted VARCHAR(255) NOT NULL,
  photo TEXT NOT NULL,
  quote TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS program_catalog (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  badge VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_exams JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration VARCHAR(100) NOT NULL,
  annual_fee NUMERIC(12, 2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(50),
  avatar TEXT,
  subject VARCHAR(100),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  enrollment_no VARCHAR(100) UNIQUE NOT NULL,
  program VARCHAR(50) NOT NULL,
  program_name VARCHAR(255) NOT NULL,
  section VARCHAR(100) NOT NULL,
  branch_id VARCHAR(50) REFERENCES branches(id),
  branch_name VARCHAR(255) NOT NULL,
  admission_date DATE NOT NULL,
  total_fee NUMERIC(12, 2) NOT NULL,
  paid_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  parent_name VARCHAR(255),
  parent_phone VARCHAR(50),
  tenth_score VARCHAR(50),
  address TEXT,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS fee_payments (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
  receipt_no VARCHAR(100) NOT NULL,
  installment_name VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  transaction_ref VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS classes_schedule (
  id VARCHAR(50) PRIMARY KEY,
  teacher_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  teacher_name VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  program VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  room_no VARCHAR(100) NOT NULL,
  start_time VARCHAR(50) NOT NULL,
  end_time VARCHAR(50) NOT NULL,
  day_of_week VARCHAR(50) NOT NULL,
  topic TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tests (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  program VARCHAR(50) NOT NULL,
  target_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  test_type VARCHAR(100) NOT NULL,
  test_date DATE NOT NULL,
  total_marks INTEGER NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS test_scores (
  id VARCHAR(50) PRIMARY KEY,
  test_id VARCHAR(50) REFERENCES tests(id) ON DELETE CASCADE,
  student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  program VARCHAR(50) NOT NULL,
  test_date DATE NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_max INTEGER NOT NULL,
  total_obtained NUMERIC(6, 2) NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  rank_in_batch INTEGER DEFAULT 1,
  percentile NUMERIC(5, 2) DEFAULT 95.0,
  remarks TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  program VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  day INTEGER NOT NULL,
  subject VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  marked_by VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_students_program ON students(program);
CREATE INDEX IF NOT EXISTS idx_students_section ON students(section);
CREATE INDEX IF NOT EXISTS idx_tests_program ON tests(program);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_test_scores_student ON test_scores(student_id);
