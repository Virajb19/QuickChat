import { createChatSchema, createMessageSchema, joinChatSchema, SignUpSchema } from '~/lib/zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { z } from 'zod'
import bcrypt from 'bcrypt'

export const userRouter = createTRPCRouter({
  signup: publicProcedure.input(SignUpSchema).mutation(async ({ ctx, input}) => {

        const { username, email, password} = input

        const userExists = await ctx.db.user.findUnique({ where: { email }, select: { id: true}})
        if(userExists) throw new TRPCError({ code: 'FORBIDDEN', message: 'user already exists. Check your email'})

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
      await ctx.db.chat.delete({where: { id: chat.id}})
      return { chatId: chat.id}
  }),
  joinChat: protectedProcedure.input(joinChatSchema).mutation(async ({ctx, input}) => {

      const userId = parseInt(ctx.session.user.id)
      const {chatId, passcode} = input

      const chat = await ctx.db.chat.findUnique({where: {id: input.chatId}, select: { id: true, passcode: true, ownerId: true}})
      if(!chat) throw new TRPCError({code: 'NOT_FOUND', message: 'chat not found'})

      if(chat.ownerId === userId) throw new TRPCError({code: 'BAD_REQUEST', message: 'You are already the owner of this chat'})
      
      const exitstingParticipant = await ctx.db.chatParticipant.findFirst({where: {userId, chatId}})
      if(exitstingParticipant) throw new TRPCError({code: 'CONFLICT', message: 'User already in chat'})

      if(chat.passcode !== passcode) throw new TRPCError({code: 'UNAUTHORIZED', message: 'Incorrect passcode'})

      await ctx.db.chatParticipant.create({data: {chatId, userId}})
      return { chatId: chat.id , success: true, message: 'Joined chat successfully' }
  }),
  leaveChat: protectedProcedure.input(z.object({chatId: z.string().cuid()})).mutation(async ({ctx,input}) => {
      const userId = parseInt(ctx.session.user.id)

      const chat = await ctx.db.chat.findUnique({where: {id: input.chatId}, select: { id: true, passcode: true, ownerId: true}})
      if(!chat) throw new TRPCError({code: 'NOT_FOUND', message: 'chat not found'})

      if(chat.ownerId === userId) throw new TRPCError({code: 'BAD_REQUEST', message: 'You cannot leave a chat that you own'})

      const participant = await ctx.db.chatParticipant.findUnique({where: {userId_chatId: {userId, chatId: chat.id}}, select: {id: true}})
      if(!participant) throw new TRPCError({ code: "NOT_FOUND", message: "You are not a participant in this chat" })

      await ctx.db.chatParticipant.update({where: {id: participant.id}, data: {leftAt: new Date()}})
      // await ctx.db.chatParticipant.delete({where: {id: participant.id}})

      return {chatId: chat.id, success: true, message: "Left chat successfully"}

  }),
  createMessage: protectedProcedure.input(createMessageSchema.extend({chatId: z.string().cuid()})).mutation(async ({ctx,input}) => {
      return await ctx.db.message.create({data: {content: input.content, senderId: parseInt(ctx.session.user.id), chatId: input.chatId}, include: {sender: {select: {username: true, ProfilePicture: true}}}})
  }),
  deleteMessage: protectedProcedure.input(z.object({messageId: z.string().cuid()})).mutation(async ({ctx,input}) => {
       const userId = parseInt(ctx.session.user.id)

       const message = await ctx.db.message.findUnique({where: {id: input.messageId}, select: {id: true, senderId: true}})
       if(!message) throw new TRPCError({code: 'NOT_FOUND', message: 'message not found'})

       if(message.senderId !== userId) throw new TRPCError({code: 'FORBIDDEN', message: 'Unauthorized'})

       await ctx.db.message.delete({where: {id: message.id}})

       return { success: true}
  }),
  editMessage: protectedProcedure.input(z.object({messageId: z.string().cuid(), newContent: z.string().max(10000)})).mutation(async ({ctx,input}) => {
    const userId = parseInt(ctx.session.user.id)

    const message = await ctx.db.message.findUnique({where: {id: input.messageId}, select: {id: true, senderId: true}})
    if(!message) throw new TRPCError({code: 'NOT_FOUND', message: 'message not found'})

    if(message.senderId !== userId) throw new TRPCError({code: 'FORBIDDEN', message: 'Unauthorized'})

    await ctx.db.message.update({where: {id: message.id}, data: {content: input.newContent}})

    return { success: true}
  }),
  getJoinedChats: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.chatParticipant.findMany({where: {userId: parseInt(ctx.session.user.id)}, include: {Chat: {select: {messages: true}}}})
  }),
  updateStatus: protectedProcedure.input(z.object({status: z.boolean()})).mutation(async ({ctx, input}) => {
      const userId = parseInt(ctx.session.user.id)

      await ctx.db.chatParticipant.updateMany({where: {userId}, data: {isOnline: input.status}})

      return { success: true }
  })
})