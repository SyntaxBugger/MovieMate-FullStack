const fs = require('fs');
const path = require('path');
const errorHandler = (err, req, res, next) => {
    const errLog = `[${new Date().toISOString()}] ${req.method} ${req.url} - ERROR: ${err.message}`;
    fs.appendFile(
        path.join(__dirname, '..', 'logs', 'errorLog.txt'),
        errLog + '\n',
        (error) => {
            if (error) console.error("Error logging failed:", error);
        }
    );

    res.status(err.status || 500).json({
        success: false,
        message: "Server threw an exception",
        error: err.message
    });
};

module.exports = errorHandler;