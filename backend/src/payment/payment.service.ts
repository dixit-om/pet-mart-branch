import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from '../database/database.service';
import { OrderStatus } from '../orders/enums/order-status.enum';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private db: DatabaseService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createCheckoutSession(orderId: string, items: Array<{ priceId: string; quantity: number }>, successUrl: string, cancelUrl: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map(item => ({
          price: item.priceId,
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId,
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      throw new Error(`Failed to create checkout session: ${error?.message || 'Unknown error'}`);
    }
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await this.db.query(
          `UPDATE "Order" 
           SET status = $1, "paymentId" = $2, "updatedAt" = NOW()
           WHERE id = $3`,
          [OrderStatus.STARTED_DELIVERY, session.payment_intent as string, orderId]
        );
      }
    }

    return { received: true };
  }
}
