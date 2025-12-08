import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PaymentModule } from './payment/payment.module';
// Temporarily removed OrdersModule - it still uses Prisma
// import { OrdersModule } from './orders/orders.module';
import { CheckoutModule } from './resource/checkout/checkout.module';
import { OrdersModule } from './resource/orders/orders.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
      path: '/graphql',
      playground: true,
    }),
    ProductsModule,
    PaymentModule,
    CheckoutModule,
    OrdersModule,
    // OrdersModule, // Temporarily disabled - needs Prisma removal
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
