"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

export async function createCompany(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const employeesCount = parseInt(formData.get("employeesCount") as string)
  const field = formData.get("field") as string
  const representation = formData.get("representation") as string
  const logoFile = formData.get("logo") as File | null
  
  let logoUrl = null

  if (logoFile && logoFile.size > 0) {
    const buffer = Buffer.from(await logoFile.arrayBuffer())
    const filename = `${Date.now()}-${logoFile.name}`
    const uploadDir = join(process.cwd(), "public/uploads")
    
    try {
      mkdirSync(uploadDir, { recursive: true })
    } catch (e) {}

    const path = join(uploadDir, filename)
    writeFileSync(path, buffer)
    logoUrl = `/uploads/${filename}`
  }

  try {
    const company = await prisma.company.create({
      data: {
        ownerId: session.user.id,
        name,
        email,
        phone,
        address,
        employeesCount,
        field,
        representation,
        logo: logoUrl,
        status: "PENDING",
      },
    })

    revalidatePath("/owner")
    return { success: true, companyId: company.id }
  } catch (error) {
    console.error(error)
    return { error: "Failed to create company" }
  }
}

export async function updateCompany(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const employeesCount = parseInt(formData.get("employeesCount") as string)
  const field = formData.get("field") as string
  const representation = formData.get("representation") as string
  const logoFile = formData.get("logo") as File | null
  
  const existingCompany = await prisma.company.findUnique({
    where: { ownerId: session.user.id }
  })

  if (!existingCompany) return { error: "Company not found" }

  let logoUrl = existingCompany.logo

  if (logoFile && logoFile.size > 0) {
    const buffer = Buffer.from(await logoFile.arrayBuffer())
    const filename = `${Date.now()}-${logoFile.name}`
    const uploadDir = join(process.cwd(), "public/uploads")
    
    try {
      mkdirSync(uploadDir, { recursive: true })
    } catch (e) {}

    const path = join(uploadDir, filename)
    writeFileSync(path, buffer)
    logoUrl = `/uploads/${filename}`
  }

  try {
    await prisma.company.update({
      where: { ownerId: session.user.id },
      data: {
        name,
        phone,
        address,
        employeesCount,
        field,
        representation,
        logo: logoUrl,
      },
    })

    revalidatePath("/owner")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update company" }
  }
}
