import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { OrdersService } from 'src/orders/orders.service';
import { Stripe } from 'stripe';

@Injectable()
export class CheckoutService {
  private stripe: Stripe | null = null;

  constructor(private ordersService: OrdersService) {}

  private getStripe(): Stripe {
    if (!this.stripe) {
      const stripeSecret = process.env.STRIPE_SECRET;
      if (!stripeSecret) {
        throw new Error('Missing Stripe Secret. Please set STRIPE_SECRET environment variable.');
      }
      this.stripe = new Stripe(stripeSecret, {
        apiVersion: '2025-11-17.clover',
      });
    }
    return this.stripe;
  }

  async create(createCheckoutDto: CreateCheckoutDto) {
    // Try to create order if database is available, but don't fail if it's not
    let orderId: string | undefined;
    try {
      const order = await this.ordersService.createOrder({
        items: createCheckoutDto.items.map(item => ({
          productId: item.priceId, // priceId in DTO is the product ID
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: createCheckoutDto.totalAmount,
      });
      orderId = order.id;
    } catch (error: any) {
      // If database is not available, we'll create the order in the webhook
      // Store order data in metadata instead
      console.warn('Could not create order before checkout (database may not be available). Order will be created in webhook.');
    }

    // Prepare order data for metadata (in case we need to create order in webhook)
    const orderData = {
      items: JSON.stringify(createCheckoutDto.items.map(item => ({
        productId: item.priceId, // priceId in DTO is the product ID
        quantity: item.quantity,
        price: item.price,
      }))),
      totalAmount: createCheckoutDto.totalAmount.toString(),
    };

    const session = await this.getStripe().checkout.sessions.create({
      line_items: createCheckoutDto.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?orderID=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        ...(orderId ? { orderId } : {}),
        ...orderData,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
      orderId: orderId,
    };
  }

}
