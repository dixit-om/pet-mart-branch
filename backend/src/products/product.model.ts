import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string | null;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  image: string | null;

  @Field({ nullable: true })
  stripePriceId: string | null;

  @Field()
  isFeatured: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}