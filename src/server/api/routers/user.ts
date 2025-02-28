import { createChatSchema, SignUpSchema } from '~/lib/zod';
import bcrypt from 'bcrypt'
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { z } from 'zod'

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
      return { available: !!user}
  }),
  createChat: protectedProcedure.input(createChatSchema).mutation(async ({ctx,input}) => {
      const { title, passcode} = input
      const userId = parseInt(ctx.session.user.id)

      const chatExists = await ctx.db.chat.findUnique({ where: { passcode}, select: { id: true}})
      if(chatExists) throw new TRPCError({ code: 'FORBIDDEN', message: 'chat with that passcode already exists'})

      const chat = await ctx.db.chat.create({ data: { title, passcode ,ownerId: userId}, select: { id: true}})
      return { chatId: chat.id}
  }),
  checkPasscodeAvailability: protectedProcedure.input(z.object({passcode: z.string().length(6)})).query(async ({ctx,input}) => {
     const chat =  await ctx.db.chat.findFirst({ where: {passcode: input.passcode}, select: { id: true}})
     return !!chat
  }),
  getChats: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.chat.findMany({ where: { ownerId: parseInt(ctx.session.user.id)}})
  })
})