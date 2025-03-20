import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { z } from 'zod'
import { db } from "~/server/db";

const bodyParser = z.object({
    status: z.boolean()
})

export async function PUT(req: NextRequest) {
   try {
        const session = await auth()
        if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
        const userId =  parseInt(session.user.id)

        const body = await req.json()

        const parsedData = bodyParser.safeParse(body)
        if(!parsedData.success) return NextResponse.json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors}, { status: 400})
        const { status } = parsedData.data

        await db.chatParticipant.updateMany({where: {userId}, data: {isOnline: status}})

        return NextResponse.json({msg: 'Updated'}, { status: 200})

   } catch(err) {
      console.error('Error updating status', err)
      return NextResponse.json({msg: 'Error updating status'}, { status: 500})
   }
}