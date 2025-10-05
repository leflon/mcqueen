export const COOKIE_CONFIG = {
  httpOnly: true,
  maxAge: 90 * 24 * 60 * 60,
  path: '/',
  secure: true,
  sameSite: 'none' as 'none'
};

export const JWT_CONFIG = {
  name: 'jwt',
  secret: process.env.JWT_SECRET!,
  exp: '90d'
};
