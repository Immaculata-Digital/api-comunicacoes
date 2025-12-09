"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../errors/AppError");
const PUBLIC_ROUTES = [
    '/health',
    '/api/health',
    '/docs',
    '/api/docs',
];
const isPublicRoute = (path) => {
    const pathWithoutQuery = path.split('?')[0] || '';
    const normalizedPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`;
    const routesWithoutApi = PUBLIC_ROUTES.map(route => route.replace('/api', ''));
    if (routesWithoutApi.some((publicRoute) => normalizedPath === publicRoute || normalizedPath.startsWith(publicRoute))) {
        return true;
    }
    return false;
};
const authenticate = (req, res, next) => {
    try {
        if (isPublicRoute(req.path)) {
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AppError_1.AppError('Token de autenticação não fornecido', 401);
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new AppError_1.AppError('Formato de token inválido. Use: Bearer <token>', 401);
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            return res.status(error.statusCode).json({ status: 'error', message: error.message });
        }
        return res.status(401).json({ status: 'error', message: 'Token inválido ou expirado' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map