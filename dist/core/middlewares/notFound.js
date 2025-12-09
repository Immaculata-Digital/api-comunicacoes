"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res) => {
    return res.status(404).json({
        status: 'error',
        message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    });
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map