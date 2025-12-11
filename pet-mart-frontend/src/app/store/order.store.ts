import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Order, OrderItem, Product } from './product.store';
import { Apollo, gql } from 'apollo-angular';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

const GET_ORDERS = gql`
   query GetOrders($id: String!) {
    order(id: $id)  {
        id
        totalAmount
        status
        items {
            id
            quantity
            price
            product {
                id
                name
                image
            }
        }
        createdAt
        }
   }
`;

type OrderItemWithProduct = OrderItem & {
  product: Product;
};

type OrderWithItems = Order & {
  items: OrderItemWithProduct[];
  error: string | null;
};

type OrderState = {
  orders: OrderWithItems[];
  orderDetail: OrderWithItems | null;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  orderDetail: null,
  error: null,
};
export const OrderStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(() => initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    getOrders(id: string) {
        patchState(store, { error: null });
        return apollo
        .query<{ order: OrderWithItems }>({
            query: GET_ORDERS,
            variables: { id },
        }).pipe(
            tap({
                next: ({data}) => {
                    if (data?.order) {
                        patchState(store, { orderDetail: data.order});
                    }
                },
                error: (error) => {
                    patchState(store, { error: error.message});
                }
            })
        )
    },
    setError(error: string) {
        patchState(store, { error });
    }
  }))
);
