// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getUserFromCookie() {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return null;

  return verifyToken(token);
}

export async function GET() {
  const payload = await getUserFromCookie();
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cartItem.findMany({
    where: { userId: payload.userId },
    include: { product: true },
  });

  return NextResponse.json(cart);
}

export async function POST(req: NextRequest) {
  const payload = await getUserFromCookie();
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();

  const cartItem = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: payload.userId, productId } },
    update: { quantity: { increment: quantity || 1 } },
    create: { userId: payload.userId, productId, quantity: quantity || 1 },
  });

  return NextResponse.json(cartItem);
}

export async function DELETE(req: Request) {
  const payload = await getUserFromCookie();
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  await prisma.cartItem.delete({
    where: { userId_productId: { userId: payload.userId, productId } },
  });

  return NextResponse.json({ success: true });
}
