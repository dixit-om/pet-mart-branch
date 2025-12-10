import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../store/cart.store';
import { StripeService } from '../services/stripe.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartStore = inject(CartStore);
  stripeService = inject(StripeService);
  loading = false;

  checkout() {
    if (this.cartStore.items().length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate that all items have stripePriceId
    const itemsWithoutStripeId = this.cartStore.items().filter(item => !item.stripePriceId);
    if (itemsWithoutStripeId.length > 0) {
      alert('Some items in your cart are missing Stripe price information. Please remove them and try again.');
      return;
    }

    this.loading = true;

    this.stripeService.createCheckoutSession().subscribe({
      next: (response) => {
        if (response.url) {
          window.location.href = response.url;
        } else {
          throw new Error('No checkout URL received');
        }
      },
      error: (error) => {
        console.error('Checkout error:', error);
        alert('Failed to process checkout. Please try again.');
        this.loading = false;
      }
    });
  }
}
