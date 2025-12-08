import { InputType, Field, Float, ID } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => String)
  status: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => String, { nullable: true })
  paymentId?: string;
}
