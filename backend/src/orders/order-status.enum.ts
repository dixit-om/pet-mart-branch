import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  STARTED_DELIVERY = 'STARTED_DELIVERY',
  DELIVERED = 'DELIVERED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});






