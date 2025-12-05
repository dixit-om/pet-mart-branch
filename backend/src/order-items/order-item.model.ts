import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Product } from '../products/product.model';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field()
  orderId: string;

  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Product)
  product: Product;
}



