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

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  stripePriceId: string | null;
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
      patchState(store, { loading: true });

      apollo
        .watchQuery<{ products: Product[] }>({
          query: GET_PRODUCTS,
        })
        .valueChanges.pipe(
          tap({
            next: ({ data }) => {
              const products = (data?.products ?? []).filter(
                (p): p is Product => !!p
              );

              patchState(store, {
                products,
                loading: false,
              });
            },
            error: (error) =>
              patchState(store, {
                error: error.message,
                loading: false,
              }),
          })
        )
        .subscribe();
    },
  }))
);


