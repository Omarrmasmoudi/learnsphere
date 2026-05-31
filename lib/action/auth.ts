import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface JWTPayload {
  userId: number;
  [key: string]: unknown; // Index signature for type 'string'
  // Add other fields as needed
}


export const verifyJwt = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret, {
      issuer: 'LearnSphere',
      audience: 'LearnSphere',
    });

    return payload as JWTPayload;
  } catch (_error) {
    console.error('Token verification failed:', _error);
    return null;
  }
};

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const encodedSecret = new TextEncoder().encode(secret);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('LearnSphere')
    .setAudience('LearnSphere')
    .setExpirationTime('1h')
    .sign(encodedSecret);
};

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret, {
      issuer: 'LearnSphere',
      audience: 'LearnSphere',
    });

    return payload as JWTPayload;
  } catch (_error) {
    console.error('Token verification failed:', _error);
    return null;
  }
};
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) return null
    
    // Verify the token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      } as Prisma.UserSelect
    })
    
    return user
  } catch (_error) {
    return null
  }
};

