const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create server + socket
const server = http.createServer(app);
const io = new Server(server);

app.set("io", io);

// Import Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

// Import SSR Controller
const { renderMoviesSSR } = require('./controllers/moviesSsrController');

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Middleware
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware
app.use(express.json());
app.use(logger);
app.use(cookieParser());

// Serve Static Files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Socket.IO
let activeConnections = 0;

io.on("connection", (socket) => {
    activeConnections++;
    const timestamp = new Date().toLocaleTimeString();
    

    console.log(`User Connected`);
    console.log(`Socket ID: ${socket.id}`);
    console.log(`Time: ${timestamp}`);
    console.log(`Active Users: ${activeConnections}`);

    // Broadcast when user joins
    io.emit("userActivity", {
        message: "A user joined"
    });

    // Custom notification event
    socket.on("notifyAll", (msg) => {
        io.emit("notification", msg);
    });

    socket.on("disconnect", () => {
        activeConnections--;
        const disconnectTime = new Date().toLocaleTimeString();
        
        console.log("\n========================================");
        console.log(`[SOCKET.IO] User Disconnected`);
        console.log(`Socket ID: ${socket.id}`);
        console.log(`Time: ${disconnectTime}`);
        console.log(`Active Users: ${activeConnections}`);
        console.log("========================================\n");
    });
});

// Routes

// SSR Route
app.get('/movies-ssr', renderMoviesSSR);

app.get('/login', (req, res) => {
    res.render('login', { error: req.query.error || '' });
});

app.get('/register', (req, res) => {
    res.render('register', { error: req.query.error || '' });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.session.user || null });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/tmdb', tmdbRoutes);

// Home Route
app.get('/', (req, res) => {
    res.json({
        message: 'MovieMate API is running!',
        endpoints: {
            ssr: '/movies-ssr',
            auth: '/api/auth',
            library: '/api/library',
            tmdb: '/api/tmdb'
        }
    });
});

// 404 Handler
app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

// Error Handler
app.use(errorHandler);

// DB Connect
connectDB();

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`SSR Page: http://localhost:${PORT}/movies-ssr`);
});