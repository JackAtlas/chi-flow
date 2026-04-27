import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "../prisma"
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [admin(), nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
})
