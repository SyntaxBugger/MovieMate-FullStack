const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const log =
        `[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`;

    fs.appendFile(
        path.join(__dirname, '..', 'logs', 'requests.txt'),
        log + '\n',
        (err) => {
            if (err) {
                console.error("Log write error:", err);
            }
        }
    );

    console.log(log);

    next();
};

module.exports = logger;