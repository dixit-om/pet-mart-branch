export class CreateCheckoutDto {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
}
