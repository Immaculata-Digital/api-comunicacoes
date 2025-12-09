"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            details: err.details,
        });
    }
    console.error('[UnhandledError]', err);
    return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map