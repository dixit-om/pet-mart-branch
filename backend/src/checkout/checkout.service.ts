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

    const lineItems = createCheckoutDto.items.map(item => {
      // If stripePriceId exists and is a valid Stripe price ID (not a placeholder), use it
      // Valid Stripe price IDs start with "price_" and don't contain placeholder text like "xxxxx"
      const isValidStripePriceId = 
        item.stripePriceId && 
        item.stripePriceId.trim() !== '' &&
        item.stripePriceId.startsWith('price_') &&
        !item.stripePriceId.includes('xxxxx');
      
      if (isValidStripePriceId) {
        return {
          price: item.stripePriceId,
          quantity: item.quantity,
        };
      }
      
      // Otherwise, create a new price on the fly
      // Ensure name is not empty and price is valid
      if (!item.name || item.name.trim() === '') {
        throw new Error(`Product name is required for item with priceId: ${item.priceId}`);
      }
      if (!item.price || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }
      
      const lineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name.trim(),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
      
      return lineItem;
    });

    try {
      const session = await this.getStripe().checkout.sessions.create({
        line_items: lineItems,
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
    } catch (error: any) {
      console.error('Stripe checkout session creation error:', error);
      console.error('Line items being sent:', JSON.stringify(lineItems, null, 2));
      console.error('Error details:', error?.raw || error);
      throw new Error(`Failed to create Stripe checkout session: ${error?.message || 'Unknown error'}`);
    }
  }

}
