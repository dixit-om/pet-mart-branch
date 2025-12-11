import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsArray, IsNumber, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  productId!: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price!: number;
}

@InputType()
export class CreateOrderItemsInput {
  @Field(() => [CreateOrderInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderInput)
  items!: CreateOrderInput[];

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  totalAmount!: number;
}