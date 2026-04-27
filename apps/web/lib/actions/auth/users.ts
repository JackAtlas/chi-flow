"use server"

import prisma from "@/lib/prisma"

export async function getDemoUsers() {
  const users = await prisma.user.findMany({
    where: { role: "user" },
    include: {
      sessions: {
        where: {
          expiresAt: { gt: new Date() },
        },
        take: 1,
      },
    },
  })

  return users.map((u) => ({
    ...u,
    isOnline: u.sessions.length > 0,
  }))
}
