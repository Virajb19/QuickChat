import { Redis } from '@upstash/redis'
import { Queue } from 'bullmq'

// ZUSTAND STORE
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})