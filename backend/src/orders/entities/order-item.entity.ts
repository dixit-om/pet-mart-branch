import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Product } from '../../products/product.model';

@ObjectType()
export class OrderItem {
  @Field(() => String)
  id!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number;

  @Field(() => Product)
  product!: Product;

  @Field(() => String)
  productId!: string;
  
  @Field(() => String)
  orderId!: string;
}
