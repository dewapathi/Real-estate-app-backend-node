import winston from "winston";

// Create a custom log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
    level: "info", // Log level
    format: winston.format.combine(
        winston.format.timestamp(), // Add a timestamp to the logs
        logFormat // Apply the custom log format
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: "app.log" }) // Log to a file named "app.log"
    ]
});

export default logger;
