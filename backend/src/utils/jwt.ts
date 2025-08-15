import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export type JwtPayload = {
  sub: string;
  role?: string;
};

export function signJwt(payload: JwtPayload, options?: SignOptions): string {
  const defaulted: SignOptions = { expiresIn: '15m', ...(options || {}) };
  return jwt.sign(payload as any, env.JWT_SECRET as unknown as jwt.Secret, defaulted);
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET as unknown as jwt.Secret) as unknown as T;
}