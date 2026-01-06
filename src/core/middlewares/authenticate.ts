import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, type AuthTokenPayload } from '../utils/jwt'
import { AppError } from '../errors/AppError'

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload
    }
  }
}

const PUBLIC_ROUTES = [
  '/health',
  '/api/health',
  '/docs',
  '/api/docs',
]

const isPublicRoute = (path: string): boolean => {
  const pathWithoutQuery = path.split('?')[0] || ''
  const normalizedPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`
  
  const routesWithoutApi = PUBLIC_ROUTES.map(route => route.replace('/api', ''))
  if (routesWithoutApi.some((publicRoute) => normalizedPath === publicRoute || normalizedPath.startsWith(publicRoute))) {
    return true
  }
  
  return false
}

/**
 * Verifica se a rota de disparo automático é pública (boas_vindas ou reset_senha)
 * Essas rotas não precisam de autenticação porque são chamadas durante o cadastro de clientes
 */
const isPublicDisparoAutomaticoRoute = (req: Request): boolean => {
  // Verifica se é a rota de disparo automático
  const fullPath = req.baseUrl + req.path
  const originalUrl = req.originalUrl || fullPath
  
  // Verifica se o path contém disparo-automatico
  const isDisparoAutomaticoRoute = 
    fullPath.includes('/disparo-automatico') || 
    req.path.includes('/disparo-automatico') ||
    originalUrl.includes('/disparo-automatico')
  
  if (isDisparoAutomaticoRoute && req.method === 'POST') {
    try {
      // Tenta ler o body para verificar o tipo_envio
      const body = req.body as any
      if (body && typeof body === 'object' && 'tipo_envio' in body) {
        // Rotas públicas: boas_vindas (cadastro de cliente) e reset_senha
        const publicTipos = ['boas_vindas', 'reset_senha']
        if (publicTipos.includes(body.tipo_envio)) {
          return true
        }
      }
    } catch (error) {
      // Se não conseguir ler o body, continua com autenticação normal
    }
  }
  return false
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verifica rotas públicas
    if (isPublicRoute(req.path)) {
      return next()
    }

    // Verifica se é rota de disparo automático pública (boas_vindas ou reset_senha)
    if (isPublicDisparoAutomaticoRoute(req)) {
      return next()
    }

    const authHeader = req.headers.authorization

    if (!authHeader) {
      console.error('Token de autenticação não fornecido')
      throw new AppError('Token de autenticação não fornecido', 401)
    }

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      console.error('Formato de token inválido')
      throw new AppError('Formato de token inválido. Use: Bearer <token>', 401)
    }

    const payload = verifyAccessToken(token)
    req.user = payload

    next()
  } catch (error) {
    console.error('Erro na autenticação:', error)
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message })
    }
    return res.status(401).json({ status: 'error', message: 'Token inválido ou expirado' })
  }
}

