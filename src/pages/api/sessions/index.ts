import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';

export const config = {
  api: {
    externalResolver: true,
  },
}

// POST /api/sessions
// Required fields: userId, sessionStartDate, activeTime
// Optional fields: name, sessionEndDate
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    handlePOST(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

export async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const { userId, name, sessionStartDate, sessionEndDate, activeTime } = JSON.parse(req.body);

  try {
    const result = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        sessions: {
          create: [{
            name: name ? name : "",
            sessionStartDate,
            sessionEndDate: sessionEndDate ? sessionEndDate : new Date(),
            activeTime,
          }]
        }
      },
      include: {
        sessions: true
      }
    })

    res.json(result)
  } catch (e) {
    throw new Error(e)
  }
}