import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../../config/env';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
}

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });

export const signRefreshToken = (payload: { sub: string }): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): { sub: string } =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
