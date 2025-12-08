export class CreateCheckoutSessionDto {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
}

