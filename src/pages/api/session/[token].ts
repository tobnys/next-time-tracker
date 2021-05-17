import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// POST /api/session
// Required fields in body: id
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
  const user = await prisma.session.findFirst({
    where: { id: Number(token) },
  })
  user ? res.json(user) : res.json({ user: null });
}