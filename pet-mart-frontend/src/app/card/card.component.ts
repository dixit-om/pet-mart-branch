import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartStore } from '../store/cart.store';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  cartStore = inject(CartStore);

  updateQuantity(productId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.cartStore.updateQuantity(productId, quantity);
    }
  }
}
