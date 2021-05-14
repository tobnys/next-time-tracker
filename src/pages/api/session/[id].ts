import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// POST /api/session
// Required fields in body: id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  //console.log("PRISMA", prisma);
  const { id } = req.query;
  if(req.method === 'GET' && id) {
    const user = await prisma.session.findFirst({
      where: { id: Number(id) },
    })
    user ? res.json(user) : res.json({ user: null });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}