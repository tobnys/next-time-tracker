import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

// GET /api/user/:token/sessions
// Required fields in body: token
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { token, byDateType } = req.query;
  console.log("QUIERIES", req.query)
  if(req.method === 'GET') {
    handleGET(token, byDateType, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

export async function handleGET(token: string | string[], byDateType: string | string[], res: NextApiResponse) {
  try {
    let startDate = new Date();
    let currentDate = new Date();
  
    console.log("BYDATETYPE", byDateType)
    
    switch(byDateType) {
      case "day": startDate.setDate(currentDate.getDate() - 1); break;
      case "week": startDate.setDate(currentDate.getDate() - 7); break;
      case "month": startDate.setMonth(currentDate.getMonth() - 1); break;
      case "": startDate = new Date(0); break;
    }
  
    console.log("DATE START", startDate);
    console.log("TO CURRENT", currentDate)
    
    // Check if a user exists for the token provided, include sessions, store value to our response variable.
    let response = await prisma.user.findFirst({
      where: { token: String(token) },
    }).sessions({
      where: {
        sessionStartDate: {
          gte: startDate,
          lt: currentDate
        },
      },
    });
  
    console.log("ACTUAL RESP", response);
  
    if(!response) {
      res.status(404);
    } else {
      res.json(response);
    }
  } catch (e) {
    throw new Error(e)
  }
}