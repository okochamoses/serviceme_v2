const winston = require("winston");

const { printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const options = {
  file: {
    level: "info",
    filename: "logger.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  },
  console: {
    level: "debug",
    handleExceptions: true
  }
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "dd-MM-YYYY HH:mm:ss" }),
    winston.format.json(),
    logFormat
  ),
  transports: [new winston.transports.File(options.file), new winston.transports.Console(options.console)]
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: message => {
    logger.info(message);
  }
};

module.exports = logger;
