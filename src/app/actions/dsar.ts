"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFileSync } from "fs"
import { join } from "path"
import { auth } from "@/auth"

export async function submitDsar(companyId: string, formData: FormData) {
  const requesterName = formData.get("name") as string
  const requesterEmail = formData.get("email") as string
  const requesterPhone = formData.get("phone") as string
  const requestText = formData.get("requestDetails") as string
  const attachmentsFiles = formData.getAll("attachments") as File[]
  
  const savedAttachments: string[] = []

  for (const file of attachmentsFiles) {
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name}`
      const path = join(process.cwd(), "public/uploads", filename)
      writeFileSync(path, buffer)
      savedAttachments.push(`/uploads/${filename}`)
    }
  }

  try {
    const dsar = await prisma.dsarRequest.create({
      data: {
        companyId,
        requesterName,
        requesterEmail,
        requesterPhone,
        requestText,
        attachments: savedAttachments.length > 0 ? savedAttachments.join(",") : null,
        status: "OPEN",
      },
    })

    // Bonus: Email Notification Stub
    console.log(`[EMAIL STUB] Sending notification to ${requesterEmail} regarding DSAR #${dsar.id}`)
    console.log(`[EMAIL STUB] New DSAR submitted for Company ID: ${companyId}`)

    // Bonus: Audit Log
    await prisma.auditLog.create({
      data: {
        userId: "SYSTEM_PUBLIC",
        action: "DSAR_SUBMITTED",
        details: JSON.stringify({ dsarId: dsar.id, companyId }),
      }
    })

    const company = await prisma.company.findUnique({ where: { id: companyId } })
    
    revalidatePath(`/c/${company?.slug}`)
    
    if (company?.slug) {
      redirect(`/c/${company.slug}?success=true`)
    }

    return { success: true, dsarId: dsar.id }
  } catch (error) {
    console.error(error)
    return { error: "Failed to submit DSAR request" }
  }
}


export async function updateDsarStatus(dsarId: string, status: "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "CLOSED") {
  const session = await auth()
  if (!session) return { error: "Unauthorized" }

  try {
    const dsar = await prisma.dsarRequest.update({
      where: { id: dsarId },
      data: { status },
      include: { company: true }
    })

    revalidatePath("/owner")
    revalidatePath("/admin")
    revalidatePath(`/c/${dsar.company.slug}`)

    // Bonus: Audit Log
    if (session.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DSAR_STATUS_UPDATED",
          details: JSON.stringify({ dsarId, status }),
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update DSAR status" }
  }
}

export async function contactRequester(dsarId: string, message: string) {
  const session = await auth()
  if (!session) return { error: "Unauthorized" }

  try {
    const dsar = await prisma.dsarRequest.findUnique({
      where: { id: dsarId },
      include: { company: true }
    })

    if (!dsar) return { error: "DSAR not found" }

    // Bonus: Email Notification Stub
    console.log(`[CONTACT STUB] From: ${session.user?.email} (Company: ${dsar.company.name})`)
    console.log(`[CONTACT STUB] To: ${dsar.requesterEmail}`)
    console.log(`[CONTACT STUB] Message: ${message}`)

    // Bonus: Audit Log
    if (session.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DSAR_REQUESTER_CONTACTED",
          details: JSON.stringify({ dsarId, message }),
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to contact requester" }
  }
}

