const util = require("util");
const pino = require("pino");
const pinoHttp = require("pino-http");
const env = require("./env");

function formatDevLog(args) {
  return args.map((arg) => {
    if (arg instanceof Error) return arg.stack || arg.message;
    if (typeof arg === "object") return util.inspect(arg, { depth: 4, colors: false });
    return arg;
  });
}

function devLogger(level) {
  return (...args) => console.log(`[${level.toUpperCase()}]`, ...formatDevLog(args));
}

const productionLogger = pino({
  level: process.env.LOG_LEVEL || (env.nodeEnv === "production" ? "info" : "debug"),
  base: {
    app: env.appName,
    env: env.nodeEnv
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']"
    ],
    remove: true
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

const logger = env.nodeEnv === "production" ? productionLogger : {
  debug: devLogger("debug"),
  info: devLogger("info"),
  warn: devLogger("warn"),
  error: devLogger("error"),
  fatal: devLogger("error")
};

const productionRequestLogger = pinoHttp({
  logger: productionLogger,
  customLogLevel(req, res, err) {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode
      };
    },
    err: pino.stdSerializers.err
  }
});

function developmentRequestLogger(req, res, next) {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
}

const requestLogger = env.nodeEnv === "production"
  ? productionRequestLogger
  : developmentRequestLogger;

module.exports = {
  logger,
  requestLogger
};
