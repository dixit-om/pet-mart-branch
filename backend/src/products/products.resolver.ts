import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductDto,
  ) {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAll(
    @Args('isFeatured', { type: () => Boolean, nullable: true })
    isFeatured?: boolean,
  ) {
    return this.productsService.findAll(isFeatured);
  }

  @Query(() => Product, { name: 'product', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOne(id);
  }

  @Query(() => [Product], { name: 'searchProducts' })
  searchProducts(@Args('term', { type: () => String }) term: string) {
    return this.productsService.searchProducts(term);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.remove(id);
  }
}


