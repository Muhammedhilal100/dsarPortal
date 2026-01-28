"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { redirect } from "next/navigation"

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-10-16" as any,
})

export async function createCheckoutSession() {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
  })

  if (!company) return { error: "Company not found" }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: session.user.email!,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "DSAR Portal Subscription",
          },
          unit_amount: 2900, // $29.00
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/owner?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/owner?canceled=true`,
    metadata: {
      companyId: company.id,
    },
  })

  redirect(checkoutSession.url!)
}
