import { CreateOrderInput } from './create-order.input';
import { InputType, Field, ID, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Float, { nullable: true })
  totalAmount?: number;
}
