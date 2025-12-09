import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PaymentService, PaymentResolver],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
