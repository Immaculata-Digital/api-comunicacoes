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
/**
 * Verifica se a rota de disparo automático é para reset de senha (rota pública)
 */
const isResetSenhaRoute = (req) => {
    // Verifica se é a rota de disparo automático
    const fullPath = req.baseUrl + req.path;
    const originalUrl = req.originalUrl || fullPath;
    // Verifica se o path contém disparo-automatico
    const isDisparoAutomaticoRoute = fullPath.includes('/disparo-automatico') ||
        req.path.includes('/disparo-automatico') ||
        originalUrl.includes('/disparo-automatico');
    if (isDisparoAutomaticoRoute && req.method === 'POST') {
        try {
            // Tenta ler o body para verificar se é reset_senha
            const body = req.body;
            if (body && typeof body === 'object' && 'tipo_envio' in body && body.tipo_envio === 'reset_senha') {
                return true;
            }
        }
        catch (error) {
            // Se não conseguir ler o body, continua com autenticação normal
        }
    }
    return false;
};
const authenticate = (req, res, next) => {
    try {
        // Verifica rotas públicas
        if (isPublicRoute(req.path)) {
            return next();
        }
        // Verifica se é rota de reset de senha (pública)
        if (isResetSenhaRoute(req)) {
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('Token de autenticação não fornecido');
            throw new AppError_1.AppError('Token de autenticação não fornecido', 401);
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            console.error('Formato de token inválido');
            throw new AppError_1.AppError('Formato de token inválido. Use: Bearer <token>', 401);
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        console.error('Erro na autenticação:', error);
        if (error instanceof AppError_1.AppError) {
            return res.status(error.statusCode).json({ status: 'error', message: error.message });
        }
        return res.status(401).json({ status: 'error', message: 'Token inválido ou expirado' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map