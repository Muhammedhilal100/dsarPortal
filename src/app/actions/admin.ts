"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateCompanyStatus(companyId: string, status: string) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  try {
    const updateData: any = { status }

    if (status === "APPROVED") {
      const company = await prisma.company.findUnique({ where: { id: companyId } })
      if (company && !company.slug) {
        // Simple slug generation: name-random
        const slug = `${company.name.toLowerCase().replace(/ /g, "-")}-${Math.random().toString(36).substring(2, 6)}`
        updateData.slug = slug
      }
    }

    await prisma.company.update({
      where: { id: companyId },
      data: updateData,
    })

    revalidatePath("/admin")

    // Bonus: Audit Log
    const session = await auth()
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: `COMPANY_${status}`,
          details: JSON.stringify({ companyId }),
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update company" }
  }
}
