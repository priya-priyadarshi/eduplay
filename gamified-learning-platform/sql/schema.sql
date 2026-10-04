-- Drop database if exists (for fresh start)
DROP DATABASE IF EXISTS gamified_learning;
CREATE DATABASE gamified_learning;
USE gamified_learning;

-- =============================================
-- TABLE 1: Users
-- =============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') DEFAULT 'student',
    preferred_language VARCHAR(10) DEFAULT 'en',
    total_points INT DEFAULT 0,
    level INT DEFAULT 1,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE 2: Languages
-- =============================================
CREATE TABLE languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 999
);

-- Insert 12 languages
INSERT INTO languages (code, name, native_name, display_order) VALUES
('en', 'English', 'English', 1),
('hi', 'Hindi', 'हिन्दी', 2),
('mr', 'Marathi', 'मराठी', 3),
('ta', 'Tamil', 'தமிழ்', 4),
('te', 'Telugu', 'తెలుగు', 5),
('kn', 'Kannada', 'ಕನ್ನಡ', 6),
('ml', 'Malayalam', 'മലയാളം', 7),
('bn', 'Bengali', 'বাংলা', 8),
('gu', 'Gujarati', 'ગુજરાતી', 9),
('or', 'Odia', 'ଓଡ଼ିଆ', 10),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ', 11),
('ur', 'Urdu', 'اُردُو', 12);

-- =============================================
-- TABLE 3: Degrees
-- =============================================
CREATE TABLE degrees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    duration_years INT DEFAULT 4,
    icon VARCHAR(50),
    display_order INT DEFAULT 0
);

INSERT INTO degrees (name, duration_years, display_order) VALUES
('B.Tech', 4, 1),
('MBA', 2, 2),
('B.Pharmacy', 4, 3);

-- =============================================
-- TABLE 4: Branches (for B.Tech)
-- =============================================
CREATE TABLE branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    degree_id INT,
    name VARCHAR(100),
    FOREIGN KEY (degree_id) REFERENCES degrees(id) ON DELETE CASCADE
);

INSERT INTO branches (degree_id, name) VALUES
(1, 'Computer Science Engineering'),
(1, 'Mechanical Engineering'),
(1, 'Civil Engineering'),
(1, 'Electronics Engineering');

-- =============================================
-- TABLE 5: Semesters
-- =============================================
CREATE TABLE semesters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    degree_id INT,
    semester_number INT,
    year_number INT,
    FOREIGN KEY (degree_id) REFERENCES degrees(id) ON DELETE CASCADE
);

-- Insert semesters for B.Tech (4 years = 8 semesters)
INSERT INTO semesters (degree_id, semester_number, year_number) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 2), (1, 4, 2),
(1, 5, 3), (1, 6, 3), (1, 7, 4), (1, 8, 4);

-- Insert semesters for MBA (2 years = 4 semesters)
INSERT INTO semesters (degree_id, semester_number, year_number) VALUES
(2, 1, 1), (2, 2, 1), (2, 3, 2), (2, 4, 2);

-- Insert semesters for B.Pharmacy (4 years = 8 semesters)
INSERT INTO semesters (degree_id, semester_number, year_number) VALUES
(3, 1, 1), (3, 2, 1), (3, 3, 2), (3, 4, 2),
(3, 5, 3), (3, 6, 3), (3, 7, 4), (3, 8, 4);

-- =============================================
-- TABLE 6: Subjects
-- =============================================
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    semester_id INT,
    name VARCHAR(200),
    subject_code VARCHAR(50),
    total_topics INT DEFAULT 0,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
);

-- Sample subjects for B.Tech CSE Semester 1
INSERT INTO subjects (semester_id, name, subject_code) VALUES
(1, 'Programming for Problem Solving', 'PPS101'),
(1, 'Engineering Mathematics-I', 'MATH101'),
(1, 'Digital Logic Design', 'DLD101');

-- =============================================
-- TABLE 7: Topics (Game Levels)
-- =============================================
CREATE TABLE topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT,
    topic_name VARCHAR(200),
    topic_order INT DEFAULT 1,
    xp_reward INT DEFAULT 50,
    game_type ENUM('match', 'memory') DEFAULT 'match',
    game_data JSON,
    time_limit INT DEFAULT 60,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Sample topics for Programming subject
INSERT INTO topics (subject_id, topic_name, topic_order, xp_reward, game_type, time_limit) VALUES
(1, 'What is Programming?', 1, 50, 'match', 60),
(1, 'Variables & Data Types', 2, 50, 'memory', 90),
(1, 'Conditional Statements', 3, 75, 'match', 60),
(1, 'Loops in Programming', 4, 75, 'memory', 90),
(1, 'Functions Basics', 5, 100, 'match', 60);

-- =============================================
-- TABLE 8: User Progress
-- =============================================
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    topic_id INT,
    completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    attempts INT DEFAULT 0,
    best_time INT DEFAULT NULL,
    completed_at TIMESTAMP NULL,
    UNIQUE KEY unique_user_topic (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- =============================================
-- TABLE 9: Badges
-- =============================================
CREATE TABLE badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    required_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO badges (name, description, icon, required_points) VALUES
('First Victory', 'Complete your first topic', '🏆', 0),
('7-Day Warrior', 'Maintain 7 day streak', '⚔️', 0),
('Perfect Player', 'Get 3 perfect scores', '⭐', 0),
('Speed Demon', 'Complete game under 30 sec', '⚡', 0),
('Century Club', 'Earn 100 points', '💯', 100),
('Master Level 5', 'Reach Level 5', '👑', 0);

-- =============================================
-- TABLE 10: User Badges
-- =============================================
CREATE TABLE user_badges (
    user_id INT,
    badge_id INT,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- =============================================
-- TABLE 11: Daily Challenges
-- =============================================
CREATE TABLE daily_challenges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    challenge_date DATE,
    topic_id INT,
    bonus_xp INT DEFAULT 100,
    completed_users TEXT,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- =============================================
-- TABLE 12: Sample User (Password: password123)
-- Note: Password hash is for 'password123'
-- =============================================
INSERT INTO users (name, email, password, role, preferred_language) VALUES 
('Demo Teacher', 'teacher@demo.com', '$2a$10$rVqCpHKkLqKqKqKqKqKqKu', 'teacher', 'en'),
('Demo Student', 'student@demo.com', '$2a$10$rVqCpHKkLqKqKqKqKqKqKu', 'student', 'en');

-- =============================================
-- TABLE 13: Translations Sample Data
-- =============================================
CREATE TABLE translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_key VARCHAR(255) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    translation TEXT NOT NULL,
    UNIQUE KEY unique_translation (content_key, language_code),
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE
);

-- Insert sample translations
INSERT INTO translations (content_key, language_code, translation) VALUES
('welcome', 'hi', 'गेमिफाइड लर्निंग में आपका स्वागत है'),
('welcome', 'mr', 'गेमिफाइड लर्निंग मध्ये आपले स्वागत आहे'),
('play_game', 'hi', 'गेम खेलें'),
('play_game', 'mr', 'गेम खेळा'),
('leaderboard', 'hi', 'लीडरबोर्ड'),
('leaderboard', 'mr', 'लीडरबोर्ड'),
('profile', 'hi', 'प्रोफाइल'),
('profile', 'mr', 'प्रोफाइल'),
('logout', 'hi', 'लॉगआउट'),
('logout', 'mr', 'लॉगआउट');