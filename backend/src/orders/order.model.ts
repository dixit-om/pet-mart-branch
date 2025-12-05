import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { OrderStatus } from './order-status.enum';
import { OrderItem } from '../order-items/order-item.model';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field({ nullable: true })
  paymentId?: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}




