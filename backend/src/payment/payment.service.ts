import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from '../database/database.service';
import { OrderStatus } from '../orders/enums/order-status.enum';

@Injectable()
export class PaymentService {
  private stripe: Stripe | null = null;

  constructor(private db: DatabaseService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2025-11-17.clover',
      });
    } else {
      console.warn('⚠️  STRIPE_SECRET_KEY not set. Payment features will be disabled.');
    }
  }

  async createCheckoutSession(orderId: string, items: Array<{ priceId: string; quantity: number }>, successUrl: string, cancelUrl: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
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

      try {
        if (orderId) {
          // Update existing order
          await this.db.query(
            `UPDATE "Order" 
             SET status = $1, "paymentId" = $2, "updatedAt" = NOW()
             WHERE id = $3`,
            [OrderStatus.STARTED_DELIVERY, session.payment_intent as string, orderId]
          );
        } else if (session.metadata?.items && session.metadata?.totalAmount) {
          // Create order from metadata (when database wasn't available during checkout)
          const items = JSON.parse(session.metadata.items);
          const totalAmount = parseFloat(session.metadata.totalAmount);
          const client = await this.db.getClient();

          try {
            await client.query('BEGIN');

            // Create order
            const orderResult = await client.query(
              `INSERT INTO "Order" (id, "totalAmount", status, "createdAt", "updatedAt", "paymentId")
               VALUES (gen_random_uuid(), $1, $2, NOW(), NOW(), $3)
               RETURNING *`,
              [totalAmount, OrderStatus.STARTED_DELIVERY, session.payment_intent as string]
            );

            const order = orderResult.rows[0];
            const newOrderId = order.id;

            // Create order items
            for (const item of items) {
              await client.query(
                `INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
                [newOrderId, item.productId, item.quantity, item.price]
              );
            }

            await client.query('COMMIT');
          } catch (error) {
            await client.query('ROLLBACK');
            throw error;
          } finally {
            client.release();
          }
        }
      } catch (error: any) {
        // Log error but don't fail the webhook
        console.error('Error processing checkout webhook:', error);
      }
    }

    return { received: true };
  }
}
