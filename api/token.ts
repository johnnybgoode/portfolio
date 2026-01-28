import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serialize } from 'cookie'

export default async function GET(req: VercelRequest, res: VercelResponse) {
  if (req.cookies.sessID) {
    return res.status(200);
  }

  const sessID = crypto.randomUUID()
  const _sid = serialize('_sid', sessID, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60, // * 60 * 24 * 7,
  });

  const data = new TextEncoder().encode(sessID)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashHex = new Uint8Array(hashBuffer).toHex()

  const _hsid = serialize('_hsid', hashHex, {
    sameSite: 'strict',
    path: '/',
    maxAge: 60, // * 60 * 24 * 7
  })

  res.setHeader('Set-Cookie', [_sid, _hsid])
  return res.status(200)
}
