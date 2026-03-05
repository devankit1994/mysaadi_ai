import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CreateOrderRequest = {
  profileId?: string | number;
};

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error:
          "Missing Razorpay credentials (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET)",
      },
      { status: 500 },
    );
  }

  let body: CreateOrderRequest | null = null;
  try {
    body = (await req.json()) as CreateOrderRequest;
  } catch {
    body = null;
  }

  // Server-enforced pricing: always charge ₹39 (3900 paise)
  const amount = 39 * 100;
  const currency = "INR";

  const receipt = `unlock_${body?.profileId ?? "profile"}_${Date.now()}`;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      payment_capture: 1,
    }),
  });

  if (!razorpayRes.ok) {
    const errText = await razorpayRes.text().catch(() => "");
    return NextResponse.json(
      { error: "Failed to create Razorpay order", details: errText },
      { status: 502 },
    );
  }

  const order = (await razorpayRes.json()) as {
    id: string;
    amount: number;
    currency: string;
  };

  return NextResponse.json({
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
