import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config();

const publicKey = Buffer.from(process.env.PUBLIC_KEY!, "base64").toString('ascii');
const privateKey = Buffer.from(process.env.PRIVATE_KEY!, "base64").toString('ascii');

export function signJwt(object: Object, options?: jwt.SignOptions) {
    return jwt.sign(object, privateKey, {
        ...options,
        algorithm: 'RS256'
    });
}

export function verifyJwt<T>(token: string): T | null {
    try{
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    }catch(e){
        return null
    }
}