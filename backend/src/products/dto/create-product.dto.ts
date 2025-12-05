import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string | null;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  stripePriceId?: string | null;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}



