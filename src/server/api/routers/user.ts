import { createChatSchema, SignUpSchema } from '~/lib/zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { z } from 'zod'
import bcrypt from 'bcrypt'

export const userRouter = createTRPCRouter({
    signup: publicProcedure.input(SignUpSchema).mutation(async ({ ctx, input}) => {

        const { username, email, password} = input

        const userExists = await ctx.db.user.findUnique({ where: { email }, select: { id: true}})
        if(userExists) throw new TRPCError({ code: 'FORBIDDEN', message: 'user already exists'})

        const hashedPassword = await bcrypt.hash(password,10)
        await ctx.db.user.create({data: {username,email,password: hashedPassword}})

        return { message: 'signed up successfully'}
  }),
  checkUsername: publicProcedure.input(z.object({username: z.string()})).query(async ({ ctx, input}) => {
      const user = await ctx.db.user.findUnique({ where: { username: input.username}, select: { id: true}})
      return !user
  }),
  createChat: protectedProcedure.input(createChatSchema).mutation(async ({ctx,input}) => {
      const { title, passcode} = input
      const userId = parseInt(ctx.session.user.id)

      const chat = await ctx.db.chat.create({ data: { title, passcode ,ownerId: userId}, select: { id: true}})
      return { chatId: chat.id}
  }),
  checkPasscodeAvailability: protectedProcedure.input(z.object({passcode: z.string().length(6)})).query(async ({ctx,input}) => {
     const chat =  await ctx.db.chat.findFirst({ where: {passcode: input.passcode}, select: { id: true}})
     return !chat
  }),
  getChats: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.chat.findMany({ where: { ownerId: parseInt(ctx.session.user.id)}, orderBy: {createdAt: 'desc'}})
  }),
  deleteChat: protectedProcedure.input(z.object({chatId: z.string()})).mutation(async ({ctx, input}) => {
      const chat = await ctx.db.chat.findUnique({where: {id: input.chatId}, select: { id: true}})
      if(!chat) throw new TRPCError({code: 'NOT_FOUND', message: 'chat not found'})
    //   await new Promise(r => setTimeout(r, 8000))
      await ctx.db.chat.delete({where: { id: chat.id}})
      return { chatId: chat.id}
  }),
  joinChat: protectedProcedure.input(z.object({chatId: z.string(), passcode: z.string()})).mutation(async ({ctx, input}) => {

  })
})