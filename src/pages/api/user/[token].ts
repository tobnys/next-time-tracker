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
  // Check if a user exists for the token provided, store value to our response variable.
  let response = await prisma.user.findFirst({
    where: { token: String(token) },
    include: { sessions: true }
  })

  // If the user does not exist, create one and store response.
  if(!response) {
    response = await prisma.user.create({
      data: {
        token: token
      }
    })
  }

  // Return response
  res.json(response);
}