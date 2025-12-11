import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderStore } from '../../store/order.store';
import { OrderDetailComponent } from '../../orders/components/order-detail/order-detail.component';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderDetailComponent],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  cartStore = inject(CartStore);

  constructor() {
    afterNextRender(() => {
      this.cartStore.clearCart();
    })
  }

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderID');
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.orderStore.getOrders(orderId).subscribe();
  }
}
