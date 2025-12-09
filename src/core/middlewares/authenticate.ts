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

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isPublicRoute(req.path)) {
      return next()
    }

    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError('Token de autenticação não fornecido', 401)
    }

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Formato de token inválido. Use: Bearer <token>', 401)
    }

    const payload = verifyAccessToken(token)
    req.user = payload

    next()
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message })
    }
    return res.status(401).json({ status: 'error', message: 'Token inválido ou expirado' })
  }
}

