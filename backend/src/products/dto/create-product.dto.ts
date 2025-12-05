import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string | null;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  image?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  stripePriceId?: string | null;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}



