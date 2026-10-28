import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { AppError } from '../../common/AppError';
import { env } from '../../config/env';

export interface OAuthProfile {
  providerId: string;
  email: string;
}

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const verifyGoogleIdToken = async (idToken: string): Promise<OAuthProfile> => {
  if (!env.GOOGLE_CLIENT_ID) throw AppError.badRequest('Google login is not configured');
  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  } catch {
    throw AppError.unauthorized('Invalid Google token');
  }
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) throw AppError.unauthorized('Invalid Google token');
  return { providerId: payload.sub, email: payload.email };
};

const appleJwks = jwksClient({ jwksUri: 'https://appleid.apple.com/auth/keys' });

const getAppleSigningKey = (kid: string) =>
  new Promise<string>((resolve, reject) => {
    appleJwks.getSigningKey(kid, (err, key) => {
      if (err || !key) return reject(err ?? new Error('Signing key not found'));
      resolve(key.getPublicKey());
    });
  });

export const verifyAppleIdToken = async (idToken: string): Promise<OAuthProfile> => {
  if (!env.APPLE_CLIENT_ID) throw AppError.badRequest('Apple login is not configured');

  const decodedHeader = jwt.decode(idToken, { complete: true });
  const kid = decodedHeader && typeof decodedHeader === 'object' ? decodedHeader.header.kid : undefined;
  if (!kid) throw AppError.unauthorized('Invalid Apple token');

  let publicKey: string;
  try {
    publicKey = await getAppleSigningKey(kid);
  } catch {
    throw AppError.unauthorized('Invalid Apple token');
  }

  let payload;
  try {
    payload = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      audience: env.APPLE_CLIENT_ID,
      issuer: 'https://appleid.apple.com',
    });
  } catch {
    throw AppError.unauthorized('Invalid Apple token');
  }

  if (typeof payload === 'string' || !payload.sub || !payload.email) {
    throw AppError.unauthorized('Invalid Apple token');
  }
  return { providerId: payload.sub, email: payload.email as string };
};
