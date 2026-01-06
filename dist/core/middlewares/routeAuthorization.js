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
const routeAuthorization = (req, res, next) => {
    try {
        // Verifica rotas públicas
        if (isPublicRoute(req.path)) {
            return next();
        }
        // Verifica se é rota de reset de senha (pública)
        if (isResetSenhaRoute(req)) {
            return next();
        }
        if (!req.user) {
            console.error('Usuário não autenticado');
            throw new AppError_1.AppError('Usuário não autenticado', 401);
        }
        next();
    }
    catch (error) {
        console.error('Erro na autorização:', error);
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