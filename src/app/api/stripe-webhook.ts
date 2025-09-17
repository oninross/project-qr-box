// /pages/api/stripe-webhook.ts
import { buffer } from "micro";
import * as admin from "firebase-admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-08-16" });

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle subscription events
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.created"
  ) {
    const subscription = event.data.object;
    const userId = subscription.metadata.firebaseUID; // Set this metadata when creating the subscription
    const status = subscription.status;
    const current_period_end = subscription.current_period_end;

    await admin.firestore().doc(`users/${userId}`).set(
      {
        subscription: {
          status,
          current_period_end,
        },
      },
      { merge: true }
    );
  }

  res.status(200).json({ received: true });
}
