import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PaymentService } from '../../payment/payment.service';

@Injectable()
export class CheckoutService {
  constructor(private paymentService: PaymentService) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    // Create Stripe checkout session
    const checkoutSession = await this.paymentService.createCheckoutSession(
      createCheckoutDto.items,
    );
    
    return {
      sessionId: checkoutSession.sessionId,
      url: checkoutSession.url,
    };
  }
}
