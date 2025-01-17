import {jwtVerify, SignJWT} from 'jose';

export const generateToken = async (payload: any) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setIssuer('LearnSphere')
        .setAudience('LearnSphere')
        .setExpirationTime('1h')
        .sign(secret)
}

export const verifyToken = async (token: string)=>{
    try{
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret, {issuer: 'LearnSphere', audience: 'LearnSphere'})
        return payload
    }catch (error){
        return null
    }
}