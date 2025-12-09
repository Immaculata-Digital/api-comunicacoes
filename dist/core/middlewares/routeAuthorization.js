"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeAuthorization = void 0;
const AppError_1 = require("../errors/AppError");
const isPublicRoute = (path) => {
    const pathWithoutQuery = path.split('?')[0] || '';
    const normalizedPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`;
    const exactPublicRoutes = [
        '/health',
        '/docs',
    ];
    if (exactPublicRoutes.some((publicRoute) => normalizedPath === publicRoute || normalizedPath.startsWith(publicRoute))) {
        return true;
    }
    return false;
};
const routeAuthorization = (req, res, next) => {
    try {
        if (isPublicRoute(req.path)) {
            return next();
        }
        if (!req.user) {
            throw new AppError_1.AppError('Usuário não autenticado', 401);
        }
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            return res.status(error.statusCode).json({ status: 'error', message: error.message });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao verificar autorização da rota',
        });
    }
};
exports.routeAuthorization = routeAuthorization;
//# sourceMappingURL=routeAuthorization.js.map