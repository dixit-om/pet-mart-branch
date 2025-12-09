import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStore } from '../store/cart.store';
import { Apollo, gql } from 'apollo-angular';

const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderItemsInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
      totalAmount
      status
    }
  }
`;

const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input) {
      sessionId
      url
    }
  }
`;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartStore = inject(CartStore);
  private apollo = inject(Apollo);
  private router = inject(Router);
  loading = false;

  async checkout() {
    if (this.cartStore.items().length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.loading = true;

    try {
      // Step 1: Create order
      const orderResult = await this.apollo.mutate<{ createOrder: { id: string; totalAmount: number } }>({
        mutation: CREATE_ORDER,
        variables: {
          createOrderInput: {
            items: this.cartStore.items().map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: this.cartStore.totalAmount(),
          },
        },
      }).toPromise();

      const orderId = orderResult?.data?.createOrder?.id;

      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Step 2: Create checkout session
      const checkoutItems = this.cartStore.items()
        .filter(item => item.stripePriceId)
        .map(item => ({
          priceId: item.stripePriceId!,
          quantity: item.quantity,
        }));

      if (checkoutItems.length === 0) {
        throw new Error('No items with valid Stripe price IDs');
      }

      const successUrl = `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/checkout`;

      const sessionResult = await this.apollo.mutate<{ createCheckoutSession: { url: string } }>({
        mutation: CREATE_CHECKOUT_SESSION,
        variables: {
          input: {
            orderId,
            items: checkoutItems,
            successUrl,
            cancelUrl,
          },
        },
      }).toPromise();

      const checkoutUrl = sessionResult?.data?.createCheckoutSession?.url;

      if (!checkoutUrl) {
        throw new Error('Failed to create checkout session');
      }

      // Step 3: Redirect to Stripe
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
      this.loading = false;
    }
  }
}
