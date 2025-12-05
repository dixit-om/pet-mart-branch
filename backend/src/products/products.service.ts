import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product as PrismaProduct } from '@prisma/client';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description ?? '',
        price: createProductDto.price,
        image: createProductDto.image ?? '',
        stripePriceId: createProductDto.stripePriceId ?? '',
        isFeatured: createProductDto.isFeatured ?? false,
      },
    });
    
    // Convert empty strings to null for nullable GraphQL fields
    return {
      ...created,
      description: created.description === '' ? null : created.description,
      image: created.image === '' ? null : created.image,
      stripePriceId: created.stripePriceId === '' ? null : created.stripePriceId,
    };
  }

  async findAll(isFeatured?: boolean): Promise<Product[]> {
    const products = isFeatured !== undefined
      ? await this.prisma.product.findMany({
          where: { isFeatured },
        })
      : await this.prisma.product.findMany();
    
    // Convert empty strings to null for nullable GraphQL fields
    return products.map(product => ({
      ...product,
      description: product.description === '' ? null : product.description,
      image: product.image === '' ? null : product.image,
      stripePriceId: product.stripePriceId === '' ? null : product.stripePriceId,
    }));
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) return null;
    
    // Convert empty strings to null for nullable GraphQL fields
    return {
      ...product,
      description: product.description === '' ? null : product.description,
      image: product.image === '' ? null : product.image,
      stripePriceId: product.stripePriceId === '' ? null : product.stripePriceId,
    };
  }

  async searchProducts(term: string): Promise<Product[]> {
    const lowercaseTerm = term.toLowerCase();
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: lowercaseTerm, mode: 'insensitive' } },
          { description: { contains: lowercaseTerm, mode: 'insensitive' } },
        ],
      },
    });
    
    // Convert empty strings to null for nullable GraphQL fields
    return products.map(product => ({
      ...product,
      description: product.description === '' ? null : product.description,
      image: product.image === '' ? null : product.image,
      stripePriceId: product.stripePriceId === '' ? null : product.stripePriceId,
    }));
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updateData: any = {};
    
    if (updateProductDto.name !== undefined) {
      updateData.name = updateProductDto.name;
    }
    if (updateProductDto.description !== undefined) {
      updateData.description = updateProductDto.description ?? '';
    }
    if (updateProductDto.price !== undefined) {
      updateData.price = updateProductDto.price;
    }
    if (updateProductDto.image !== undefined) {
      updateData.image = updateProductDto.image ?? '';
    }
    if (updateProductDto.stripePriceId !== undefined) {
      updateData.stripePriceId = updateProductDto.stripePriceId ?? '';
    }
    if (updateProductDto.isFeatured !== undefined) {
      updateData.isFeatured = updateProductDto.isFeatured;
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });
    
    // Convert empty strings to null for nullable GraphQL fields
    return {
      ...updated,
      description: updated.description === '' ? null : updated.description,
      image: updated.image === '' ? null : updated.image,
      stripePriceId: updated.stripePriceId === '' ? null : updated.stripePriceId,
    };
  }

  async remove(id: string): Promise<Product> {
    const deleted = await this.prisma.product.delete({
      where: { id },
    });
    
    // Convert empty strings to null for nullable GraphQL fields
    return {
      ...deleted,
      description: deleted.description === '' ? null : deleted.description,
      image: deleted.image === '' ? null : deleted.image,
      stripePriceId: deleted.stripePriceId === '' ? null : deleted.stripePriceId,
    };
  }
}

