import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field()
  @IsString()
  image: string;

  @Field()
  @IsString()
  stripePriceId: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

