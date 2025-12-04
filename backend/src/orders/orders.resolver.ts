import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Order } from './order.model';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [Order], { name: 'orders' })
  async getOrders(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ) {
    return this.ordersService.findAll(userId);
  }

  @Query(() => Order, { name: 'order', nullable: true })
  async getOrder(@Args('id', { type: () => ID }) id: string) {
    return this.ordersService.findOne(id);
  }
}

