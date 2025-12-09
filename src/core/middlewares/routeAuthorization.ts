import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'

const isPublicRoute = (path: string): boolean => {
  const pathWithoutQuery = path.split('?')[0] || ''
  const normalizedPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`
  
  const exactPublicRoutes = [
    '/health',
    '/docs',
  ]
  
  if (exactPublicRoutes.some((publicRoute) => normalizedPath === publicRoute || normalizedPath.startsWith(publicRoute))) {
    return true
  }
  
  return false
}

export const routeAuthorization = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isPublicRoute(req.path)) {
      return next()
    }

    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401)
    }

    next()
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message })
    }
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao verificar autorização da rota',
    })
  }
}

