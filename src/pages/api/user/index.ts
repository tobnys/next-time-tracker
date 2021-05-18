import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';

export const config = {
  api: {
    externalResolver: true,
  },
}

// POST /api/user
// Required fields: token
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { token } = JSON.parse(req.body)

  if(req.method === 'POST') {
    handlePOST(token, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

export async function handlePOST(token: string, res: NextApiResponse) {
  try {
    // Query DB for user
    const user = await prisma.user.findFirst({
      where: { token: String(token) },
    })

    // Return conflict status if the user exists, else create a new user and return it
    if(user) {
      // Set 409 conflict status code due to user already existing
      res.status(409);
    } else {
      const result = await prisma.user.create({
        data: {
          token: token
        },
        include: { sessions: false }
      })
      res.json(result);
    }
  } catch (e) {
    throw new Error(e)
  }
}