import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderInput: CreateOrderInput) {
    return this.prisma.client.order.create({
      data: {
        userId: createOrderInput.userId,
        status: createOrderInput.status as any,
        totalAmount: createOrderInput.totalAmount,
        paymentId: createOrderInput.paymentId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.client.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.client.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, updateOrderInput: UpdateOrderInput) {
    return this.prisma.client.order.update({
      where: { id },
      data: {
        ...(updateOrderInput.status && { status: updateOrderInput.status as any }),
        ...(updateOrderInput.totalAmount && { totalAmount: updateOrderInput.totalAmount }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.client.order.delete({
      where: { id },
    });
  }
}
