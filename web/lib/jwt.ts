import cookie from 'cookie';

export function parseAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = cookie.parse(cookieHeader);
  console.log("Parsed Cookies:", cookies);

  return cookies['next-auth.session-token'] || null;
}