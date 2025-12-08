import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product } from './product.store';

type CartItem = Product & { quantity: number };
type CartState = {
    items: CartItem[];
}
const initialState: CartState = {
    items: [],
}
export const CartStore = signalStore({
    providedIn: 'root',
},
withState(initialState),
withComputed((store) => ({
    totalItems: computed(() => store.items().reduce((acc, item) => { return acc + item.quantity; }, 0)),
    totalAmount: computed(() => store.items().reduce((acc, item) => { return acc + (item.price * item.quantity); }, 0)),
})),
withMethods((store) => ({
    addToCart(product: Product, quantity: number = 1) {
        const currentItems = store.items(); 
        const existingItem = currentItems.find(cartItem => cartItem.id === product.id);

        if (existingItem) {
            const updatedItems = currentItems.map((cartItem) => {
                if (cartItem.id === existingItem.id) {
                    return { ...cartItem, quantity: cartItem.quantity + quantity };
                }
                return cartItem;
            });
            patchState(store, { items: updatedItems });
        } else {
            patchState(store, {
                items: [...currentItems, { ...product, quantity }]
            });
        }
    },
    updateQuantity(productId: string, quantity: number) {
        if (quantity < 1) return;
        const currentItems = store.items();
        const updatedItems = currentItems.map((cartItem) => {
            if (cartItem.id === productId) {
                return { ...cartItem, quantity };
            }
            return cartItem;
        });
        patchState(store, { items: updatedItems });
    },
    removeFromCart(productId: string) {
        const currentItems = store.items();
        const updatedItems = currentItems.filter(cartItem => cartItem.id !== productId);
        patchState(store, { items: updatedItems });
    },
    clearCart() {
        patchState(store, { items: [] });
    }
}))
);