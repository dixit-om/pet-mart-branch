import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";


export class CardItemDto {
    @IsString()
    priceId: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;

    @IsString()
    name: string;
    
    @IsString()
    stripePriceId: string;
}

export class CreateCheckoutDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CardItemDto)
    items!: CardItemDto[];

    @IsNumber()
    totalAmount: number;
}

