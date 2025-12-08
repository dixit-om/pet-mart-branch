import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStore } from '../store/cart.store';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartStore = inject(CartStore);
  paymentService = inject(PaymentService);
  router = inject(Router);
  isLoading = false;

  checkout() {
    if (this.cartStore.items().length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.isLoading = true;

    // Prepare items for Stripe checkout
    const items = this.cartStore.items()
      .filter(item => item.stripePriceId) // Only include items with stripePriceId
      .map(item => ({
        priceId: item.stripePriceId!,
        quantity: item.quantity
      }));

    if (items.length === 0) {
      alert('Some items in your cart are missing price information. Please try again.');
      this.isLoading = false;
      return;
    }

    this.paymentService.createCheckoutSession(items).subscribe({
      next: (response) => {
        // Redirect to Stripe Checkout
        if (response.url) {
          window.location.href = response.url;
        } else {
          alert('Failed to create checkout session');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Checkout error:', error);
        alert('Failed to process checkout. Please try again.');
        this.isLoading = false;
      }
    });
  }
}
