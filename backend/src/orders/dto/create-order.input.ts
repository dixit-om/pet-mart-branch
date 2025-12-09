import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  productId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number;
}

@InputType()
export class CreateOrderItemsInput {
  @Field(() => [CreateOrderInput])
  items!: CreateOrderInput[];

  @Field(() => Float)
  totalAmount!: number;

  // @Field(() => String)
  // token!: string;
}