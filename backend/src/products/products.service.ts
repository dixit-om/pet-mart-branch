import { Injectable, OnModuleInit } from '@nestjs/common';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { sampleProducts } from './products.data';

@Injectable()
export class ProductsService implements OnModuleInit {
  private products: Product[] = [];

  onModuleInit() {
    // Initialize with sample products
    this.products = sampleProducts.map((product, index) => ({
      id: `product-${index + 1}`,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    console.log(`✅ Loaded ${this.products.length} products into memory`);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: createProductDto.name,
      description: createProductDto.description ?? null,
      price: createProductDto.price,
      image: createProductDto.image ?? null,
      stripePriceId: createProductDto.stripePriceId ?? null,
      isFeatured: createProductDto.isFeatured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  async findAll(isFeatured?: boolean): Promise<Product[]> {
    if (isFeatured !== undefined) {
      return this.products.filter(product => product.isFeatured === isFeatured);
    }
    return [...this.products];
  }

  async findOne(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async searchProducts(term: string): Promise<Product[]> {
    const lowercaseTerm = term.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowercaseTerm) ||
      (product.description && product.description.toLowerCase().includes(lowercaseTerm))
    );
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const productIndex = this.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    const product = this.products[productIndex];
    
    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description ?? null;
    }
    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }
    if (updateProductDto.image !== undefined) {
      product.image = updateProductDto.image ?? null;
    }
    if (updateProductDto.stripePriceId !== undefined) {
      product.stripePriceId = updateProductDto.stripePriceId ?? null;
    }
    if (updateProductDto.isFeatured !== undefined) {
      product.isFeatured = updateProductDto.isFeatured;
    }
    
    product.updatedAt = new Date();
    
    return product;
  }

  async remove(id: string): Promise<Product> {
    const productIndex = this.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    const deleted = this.products[productIndex];
    this.products.splice(productIndex, 1);
    
    return deleted;
  }
}

