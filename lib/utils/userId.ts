import jwt from 'jsonwebtoken'
interface TokenPayload {
  userId: string
}

export function getUserIdFromToken(token: string): string | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload
    if (typeof decoded === 'string' || !decoded.userId) {
      throw new Error('Invalid token payload')
    }
    return decoded.userId
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}