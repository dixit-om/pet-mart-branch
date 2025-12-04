import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product], { name: 'products' })
  async getProducts(
    @Args('isFeatured', { type: () => Boolean, nullable: true }) isFeatured?: boolean,
  ) {
    return this.productsService.findAll(isFeatured);
  }

  @Query(() => Product, { name: 'product', nullable: true })
  async getProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOne(id);
  }
}

