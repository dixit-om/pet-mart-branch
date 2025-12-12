import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { ObjectType, Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@ObjectType()
export class CheckoutSession {
  @Field(() => String)
  sessionId!: string;

  @Field(() => String)
  url!: string;
}

@InputType()
export class CheckoutItemInput {
  @Field(() => String)
  priceId!: string;

  @Field(() => Number)
  quantity!: number;
}

@InputType()
export class CreateCheckoutSessionInput {
  @Field(() => String)
  orderId!: string;

  @Field(() => [CheckoutItemInput])
  items!: CheckoutItemInput[];

  @Field(() => String)
  successUrl!: string;

  @Field(() => String)
  cancelUrl!: string;
}

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => CheckoutSession)
  async createCheckoutSession(
    @Args('input') input: CreateCheckoutSessionInput,
  ) {
    const { orderId, items, successUrl, cancelUrl } = input;
    return this.paymentService.createCheckoutSession(
      orderId,
      items,
      successUrl,
      cancelUrl,
    );
  }
}





