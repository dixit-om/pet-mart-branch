import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";


export class CardItemDto {
    priceId: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;

    name: string;
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

