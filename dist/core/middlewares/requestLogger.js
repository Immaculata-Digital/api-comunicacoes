"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = performance.now();
    res.on('finish', () => {
        const duration = (performance.now() - start).toFixed(2);
        const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
        if (res.statusCode >= 400) {
            console.warn(log);
        }
        else {
            console.info(log);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=requestLogger.js.map