import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';

type CheckoutSession = Awaited<ReturnType<Stripe['checkout']['sessions']['retrieve']>>;

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createCheckoutSession(items: Array<{ priceId: string; quantity: number }>) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item) => ({
          price: item.priceId,
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/checkout`,
        metadata: {
          // You can add additional metadata here
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  async handleWebhook(signature: string, body: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Webhook signature verification failed');
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // Retrieve the full session object to get proper typing
        const sessionId = (event.data.object as { id: string }).id;
        const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items'],
        });
        await this.handleCheckoutCompleted(session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: CheckoutSession) {
    try {
      const lineItems = session.line_items?.data || [];
      
      // Calculate total amount
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

      // Create order in database
      const order = await this.prisma.order.create({
        data: {
          paymentId: session.payment_intent as string,
          totalAmount,
          status: 'PENDING',
          items: {
            create: await Promise.all(
              lineItems.map(async (lineItem) => {
                // Get product by stripePriceId
                const product = await this.prisma.product.findFirst({
                  where: {
                    stripePriceId: lineItem.price?.id || '',
                  },
                });

                if (!product) {
                  throw new Error(`Product not found for price ID: ${lineItem.price?.id}`);
                }

                return {
                  productId: product.id,
                  quantity: lineItem.quantity || 1,
                  price: (lineItem.price?.unit_amount || 0) / 100,
                };
              })
            ),
          },
        },
      });

      console.log('Order created:', order.id);
      return order;
    } catch (error) {
      console.error('Error handling checkout completed:', error);
      throw error;
    }
  }
}

