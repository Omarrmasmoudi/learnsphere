import { jwtVerify, SignJWT } from 'jose';

interface JWTPayload {
  userId: number;
  [key: string]: unknown; // Index signature for type 'string'
  // Add other fields as needed
}

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
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};