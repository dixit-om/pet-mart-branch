import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderItemsInput } from './dto/create-order.input';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  async createOrder(createOrderInput: CreateOrderItemsInput) {
    const { items, totalAmount } = createOrderInput;
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // Create order
      const orderResult = await client.query(
        `INSERT INTO "Order" (id, "totalAmount", status, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
         RETURNING *`,
        [totalAmount, OrderStatus.PENDING]
      );

      const order = orderResult.rows[0];
      const orderId = order.id;

      // Create order items
      const orderItems = [];
      for (const item of items) {
        const itemResult = await client.query(
          `INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price)
           VALUES (gen_random_uuid(), $1, $2, $3, $4)
           RETURNING *`,
          [orderId, item.productId, item.quantity, item.price]
        );
        orderItems.push(itemResult.rows[0]);
      }

      // Fetch products for order items
      const productIds = items.map(item => item.productId);
      const productResult = await client.query(
        `SELECT * FROM "Product" WHERE id = ANY($1)`,
        [productIds]
      );
      const products = productResult.rows;

      // Map products to order items
      const itemsWithProducts = orderItems.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId),
      }));

      await client.query('COMMIT');

      return {
        ...order,
        items: itemsWithProducts,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll() {
    const result = await this.db.query(
      `SELECT o.*, 
        json_agg(
          json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'price', oi.price,
            'productId', oi."productId",
            'orderId', oi."orderId",
            'product', (
              SELECT json_build_object(
                'id', p.id,
                'name', p.name,
                'description', p.description,
                'price', p.price,
                'image', p.image,
                'stripePriceId', p."stripePriceId",
                'isFeatured', p."isFeatured"
              )
              FROM "Product" p
              WHERE p.id = oi."productId"
            )
          )
        ) as items
       FROM "Order" o
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       GROUP BY o.id
       ORDER BY o."createdAt" DESC`
    );
    return result.rows;
  }
}
