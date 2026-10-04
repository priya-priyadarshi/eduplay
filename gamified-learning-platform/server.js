require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

require('./config/passport');
const connectDB = require('./config/db');

const app = express(); // ✅ app pehle create karo

// ================= CONNECT DATABASE =================
connectDB();

// ================= MIDDLEWARE =================

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'session_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS middleware
app.use(
    cors({
        origin: 'http://localhost:5000',
        credentials: true
    })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static('public'));

// ================= ROUTES =================

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Ai Question Routes
const aiQuestionRoute = require("./routes/aiQuestion");
app.use("/api/ai", aiQuestionRoute);

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Game Routes
app.use('/api/games', require('./routes/gameRoutes'));

app.use('/api', require('./routes/puzzleRoutes'));

// Progress Routes
app.use('/api/progress', require('./routes/progressRoutes'));

// Leaderboard Routes
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Translation Routes
app.use('/api/translations', require('./routes/translationRoutes'));

// Degree Routes
app.use('/api/degrees', require('./routes/degreeRoutes'));

// Teacher Routes
const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teacher', teacherRoutes);

// Student Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);

// ================= TEST ROUTE =================

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running successfully!'
    });
});

// ================= STATIC PAGE ROUTES (ADDED) =================
// Dashboard routes - Profile aur Play ko redirect karo
app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/student-dashboard.html');
});

app.get('/play', (req, res) => {
    res.sendFile(__dirname + '/public/student-dashboard.html');
});

app.get('/student-dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/student-dashboard.html');
});

app.get('/teacher-dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/teacher-dashboard.html');
});

app.get('/director-dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/director-dashboard.html');
});

app.get('/puzzle-game', (req, res) => {
    res.sendFile(__dirname + '/public/puzzle-game.html');
});

// ================= HOME ROUTE =================

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// ================= AUTH SUCCESS PAGE =================

app.get('/auth/success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login Success</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #f5f5f5;
                }
                .box {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: green;
                }
            </style>
            <script>
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            </script>
        </head>
        <body>
            <div class="box">
                <h2>✅ Login Successful!</h2>
                <p>Redirecting to homepage...</p>
            </div>
        </body>
        </html>
    `);
});

// ================= AUTH FAILURE PAGE =================

app.get('/auth/failure', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login Failed</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #f5f5f5;
                }
                .box {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: red;
                }
                a {
                    text-decoration: none;
                    color: blue;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <h2>❌ Login Failed!</h2>
                <p>Please try again.</p>
                <a href="/">Go Back</a>
            </div>
        </body>
        </html>
    `);
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🎮 Gamified Learning Platform running on http://localhost:${PORT}`);
});