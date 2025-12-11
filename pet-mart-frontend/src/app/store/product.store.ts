import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { Apollo, gql } from 'apollo-angular';

import { tap } from 'rxjs';


const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;

const SEARCH_PRODUCTS = gql`
  query SearchProducts($term: String!) {
    searchProducts(term: $term) {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  stripePriceId: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    loadProducts() {
      patchState(store, { loading: true, error: null });

      apollo
        .watchQuery<{ products: Product[] }>({
          query: GET_PRODUCTS,
          errorPolicy: 'all',
        })
        .valueChanges.pipe(
          tap({
            next: (result) => {
              // Check for error property (network errors)
              if (result.error) {
                console.error('Apollo error:', result.error);
                patchState(store, {
                  error: result.error.message || 'Failed to load products',
                  loading: false,
                });
                return;
              }

              const products = (result.data?.products ?? []).filter(
                (p): p is Product => !!p
              );

              console.log('Products loaded:', products.length, products);

              patchState(store, {
                products,
                loading: false,
                error: null,
              });
            },
            error: (error) => {
              console.error('Apollo error:', error);
              const errorMessage = error?.graphQLErrors?.[0]?.message || 
                                   error?.networkError?.message || 
                                   error?.message || 
                                   'Failed to load products';
              patchState(store, {
                error: errorMessage,
                loading: false,
              });
            },
          })
        )
        .subscribe({
          error: (error) => {
            console.error('Subscription error:', error);
            patchState(store, {
              error: error.message || 'Failed to load products',
              loading: false,
            });
          },
        });
    },
    searchProducts(searchTerm: string) {
      // If search term is empty, load all products
      if (!searchTerm || searchTerm.trim() === '') {
        this.loadProducts();
        return;
      }

      patchState(store, { loading: true, error: null });

      apollo
        .query<{ searchProducts: Product[] }>({
          query: SEARCH_PRODUCTS,
          variables: { term: searchTerm },
          errorPolicy: 'all',
        })
        .pipe(
          tap({
            next: (result) => {
              // Check for error property (network errors)
              if (result.error) {
                console.error('Apollo search error:', result.error);
                patchState(store, {
                  error: result.error.message || 'Failed to search products',
                  loading: false,
                });
                return;
              }

              const products = (result.data?.searchProducts ?? []).filter(
                (p): p is Product => !!p
              );

              console.log('Search results:', products.length, products);

              patchState(store, {
                products,
                loading: false,
                error: null,
              });
            },
            error: (error) => {
              console.error('Apollo search error:', error);
              const errorMessage = error?.graphQLErrors?.[0]?.message || 
                                   error?.networkError?.message || 
                                   error?.message || 
                                   'Failed to search products';
              patchState(store, {
                error: errorMessage,
                loading: false,
              });
            },
          })
        )
        .subscribe();
    },
  }))
);


