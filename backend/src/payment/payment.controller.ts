import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe | null = null;

  constructor(private readonly paymentService: PaymentService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2025-11-17.clover',
      });
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    if (!this.stripe) {
      return res.status(400).send('Stripe is not configured');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(400).send('Webhook secret not configured');
    }

    try {
      if (!req.rawBody) {
        return res.status(400).send('Missing raw body');
      }

      const event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );

      await this.paymentService.handleWebhook(event);

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error?.message || 'Unknown error'}`);
    }
  }
}
