import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';


// POST /api/session
// Required fields: userId, sessionStartDate, activeTime
// Optional fields: name, sessionEndDate
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    const { userId, name, sessionStartDate, sessionEndDate, activeTime } = JSON.parse(req.body);
    console.log("DATATAT", JSON.parse(req.body))

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
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}