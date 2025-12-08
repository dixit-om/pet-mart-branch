import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String)
  status: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => String, { nullable: true })
  paymentId?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
