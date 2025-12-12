import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CartStore } from '../store/cart.store';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  cartStore = inject(CartStore);
  http = inject(HttpClient);

  createCheckoutSession() {
    const items = this.cartStore.items();
    const totalAmount = this.cartStore.totalAmount();

    return this.http.post<{ url: string }>(
      `${environment.apiUrl}/api/checkout`,
      {
        items: items.map(item => ({
          priceId: item.id, // product ID (backend uses this as productId)
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          stripePriceId: item.stripePriceId!,
        })),
        totalAmount,
      }
    );
  }
}
