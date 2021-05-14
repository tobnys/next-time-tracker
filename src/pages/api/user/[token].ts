import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// POST /api/user
// Required fields in body: token
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  if(req.method === 'GET') {
    handleGET(token, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

export async function handleGET(token: string | string[], res: NextApiResponse) {
  const user = await prisma.user.findFirst({
    where: { token: String(token) },
  })
  user ? res.json(user) : res.json({ user: null });
}