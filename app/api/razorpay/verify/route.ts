import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type VerifyRequest = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Missing Razorpay secret" },
      { status: 500 },
    );
  }

  let body: VerifyRequest;
  try {
    body = (await req.json()) as VerifyRequest;
  } catch {
    return NextResponse.json(
      { verified: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { verified: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const verified = expected === signature;

  return NextResponse.json({ verified }, { status: verified ? 200 : 400 });
}
