import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUserFromCookie() {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return null;

  return verifyToken(token);
}

export async function POST(req: Request) {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, total, shippingAddress, billingAddress, paymentMethod } =
      await req.json();

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        total,
        shippingAddress,
        billingAddress,
        paymentMethod,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: payload.userId },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
