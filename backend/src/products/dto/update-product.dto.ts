import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string | null;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  image?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  stripePriceId?: string | null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}




