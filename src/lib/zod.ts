import { z } from 'zod'

export const SignUpSchema = z.object({
    username: z.string().min(3, {message: 'username must be atleast 3 letters long'}).max(25, {message: 'username cannot be more than 10 letters'}).trim(),
    email: z.string().email({message: 'Please enter a valid email'}).trim(),
    password: z.string().min(8, {message: 'Password must be atleast 8 letters long'}).max(15)
              .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {message: 'Password must contain atleast one special char and one number'}).trim()
})  

export const SignInSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email'}).trim(),
    password: z.string().min(8, {message: 'Password must be atleast 8 letters long'}).max(15, { message: 'Password cannot exceed 15 characters'})
              .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {message: 'Password must contain atleast one special char and one number'}).trim()
})

export const createChatSchema = z.object({
    title: z.string().min(1, { message: 'Provide a title'}),
    passcode: z.string().length(6, { message: 'Passcode should be of 6 letters'})
})

export const joinChatSchema = z.object({
    chatId: z.string().cuid({ message: 'Enter a valid ID'}),
    passcode: z.string().length(6, { message: 'Passcode should be of 6 letters'})
})

export const createMessageSchema = z.object({
    content: z.string().min(1).max(10000)
})

