import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { env } from '../../config/env'

export interface AuthTokenPayload extends JwtPayload {
  type: 'access'
  userId: string
  login: string
  email: string
  permissions: string[]
}

export interface RefreshTokenPayload extends JwtPayload {
  type: 'refresh'
  userId: string
}

export const generateAccessToken = (data: {
  userId: string
  login: string
  email: string
  permissions: string[]
}): string => {
  const payload: AuthTokenPayload = {
    type: 'access',
    userId: data.userId,
    login: data.login,
    email: data.email,
    permissions: data.permissions,
    iat: Math.floor(Date.now() / 1000),
  }

  const options: SignOptions = {
    subject: data.userId,
    expiresIn: '15m',
  }

  return jwt.sign(payload, env.security.jwtSecret, options)
}

export const generateRefreshToken = (userId: string): string => {
  const payload: RefreshTokenPayload = {
    type: 'refresh',
    userId,
    iat: Math.floor(Date.now() / 1000),
  }

  const options: SignOptions = {
    subject: userId,
    expiresIn: '7d',
  }

  return jwt.sign(payload, env.security.jwtSecret, options)
}

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  const payload = jwt.verify(token, env.security.jwtSecret) as AuthTokenPayload
  if (payload.type !== 'access') {
    throw new Error('Invalid token type')
  }
  if (!payload.sub || !payload.userId) {
    throw new Error('Invalid token payload')
  }
  return payload
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload & { sub: string } => {
  const payload = jwt.verify(token, env.security.jwtSecret) as RefreshTokenPayload
  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type')
  }
  if (!payload.sub || !payload.userId) {
    throw new Error('Invalid token payload')
  }
  return payload as RefreshTokenPayload & { sub: string }
}

