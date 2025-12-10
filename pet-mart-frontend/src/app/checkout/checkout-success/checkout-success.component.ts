import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      totalAmount
      status
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          image
          price
        }
      }
    }
  }
`;

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image: string | null;
      price: number;
    };
  }>;
}

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  order: Order | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    const orderId = this.route.snapshot.queryParams['orderID'];
    if (!orderId) {
      this.error = 'Order ID not found in URL';
      this.loading = false;
      return;
    }

    this.apollo
      .watchQuery<{ order: Order }>({
        query: GET_ORDER,
        variables: { id: orderId },
        errorPolicy: 'all',
      })
      .valueChanges.subscribe({
        next: (result) => {
          if (result.error) {
            this.error = result.error.message || 'Failed to load order details';
            this.loading = false;
            return;
          }
          // Type assertion needed because Apollo returns DeepPartialObject
          // but we know the query will return the full Order structure
          const orderData = result.data?.order;
          if (orderData && orderData.id && orderData.items) {
            this.order = orderData as Order;
          } else {
            this.error = 'Order data is incomplete';
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'Failed to load order details';
          this.loading = false;
        },
      });
  }
}
