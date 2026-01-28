"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"
import { redirect } from "next/navigation"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "OWNER"]).default("OWNER"),
})

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string || "OWNER"

  const validatedFields = registerSchema.safeParse({
    email,
    password,
    role,
  })

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "User already exists" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
      },
    })

    // Redirect to login after registration
    redirect("/login")
  } catch (error) {
    if ((error as any).digest?.startsWith("NEXT_REDIRECT")) throw error
    return { error: "Something went wrong" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Check user role for correct redirection
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    })

    const redirectTo = user?.role === "ADMIN" ? "/admin" : "/owner"

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    })
  } catch (error) {
    if ((error as any).digest?.startsWith("NEXT_REDIRECT")) throw error
    return { error: "Invalid credentials" }
  }
}

export async function resetPassword(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to reset password" }
  }
}

export async function checkUserExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  return !!user
}
