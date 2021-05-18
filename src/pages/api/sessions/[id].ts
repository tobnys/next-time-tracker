import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export const config = {
  api: {
    externalResolver: true,
  },
}

// POST /api/sessions
// Required fields in body: id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if(req.method === 'GET') {
    handleGET(id, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

export async function handleGET(id: string | string[], res: NextApiResponse) {
  try {
    const user = await prisma.session.findFirst({
      where: { id: Number(id) },
    })
    user ? res.json(user) : res.json({ user: null });
  } catch (e) {
    throw new Error(e)
  }
}