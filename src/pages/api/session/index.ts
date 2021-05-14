import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';


// POST /api/session
// Required fields: token, startDate
// Optional fields: name, endDate
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    const { title, content, authorEmail } = JSON.parse(req.body);
    const result = await prisma.session.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: authorEmail } },
      },
    })
    res.json(result)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}