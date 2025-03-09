import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { z } from 'zod'

export const chatRouter = createTRPCRouter({
    getParticipants: protectedProcedure.input(z.object({chatId: z.string().cuid()})).query(async ({ctx,input}) => {
        // await new Promise(r => setTimeout(r, 9000))
        const chat = await ctx.db.chat.findUnique({where: {id: input.chatId}, select: { id: true}})
        if(!chat) throw new TRPCError({code: 'NOT_FOUND', message: 'chat not found'})
        return await ctx.db.chatParticipant.findMany({where: {chatId: input.chatId}})
    }),
    getMessages: protectedProcedure.input(z.object({chatId: z.string().cuid()})).query(async ({ctx,input}) => {

        // await new Promise(r => setTimeout(r, 9000))

        const chat = await ctx.db.chat.findUnique({where: {id: input.chatId}, select: { id: true}})
        if(!chat) throw new TRPCError({code: 'NOT_FOUND', message: 'chat not found'})
        return await ctx.db.message.findMany({where: {chatId: chat.id}, include: {sender: {select: {ProfilePicture: true, username: true}}}, orderBy: {createdAt: 'asc'}})
    }),
})