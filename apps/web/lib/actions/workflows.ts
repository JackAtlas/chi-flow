"use server"

import { headers } from "next/headers"
import { auth } from "../auth/auth"
import prisma from "../prisma"

export async function GetWorkflowsForUser() {
  const data = await auth.api.getSession({
    headers: await headers(),
  })
  const id = data?.user?.id

  if (!id) throw new Error("Unauthenticated")

  return prisma.workflow.findMany({
    where: { userId: id },
    orderBy: { createdAt: "asc" },
  })
}
