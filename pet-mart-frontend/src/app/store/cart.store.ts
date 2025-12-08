import { computed, effect } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState, withHooks } from '@ngrx/signals';
import { Product } from './product.store';

const CART_LOCAL_STORAGE_KEY = 'pet-mart-cart';

type CartItem = Product & { quantity: number };
type CartState = {
    items: CartItem[];
}
const initialState: CartState = {
    items: [],
}

// Helper function to save cart to localStorage
function saveCartToLocalStorage(items: CartItem[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }
}

// Helper function to load cart from localStorage
function loadCartFromLocalStorage(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const stored = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
            return [];
        }
    }
    return [];
}

export const CartStore = signalStore({
    providedIn: 'root',
},
withState(() => {
    return {
        ...initialState,
        items: loadCartFromLocalStorage(),
    };
}),
withComputed((store) => ({
    totalItems: computed(() => store.items().reduce((acc, item) => { return acc + item.quantity; }, 0)),
    totalAmount: computed(() => store.items().reduce((acc, item) => { return acc + (item.price * item.quantity); }, 0)),
})),
withMethods((store) => ({
    addToCart(product: Product, quantity: number = 1) {
        const currentItems = store.items(); 
        const existingItem = currentItems.find(cartItem => cartItem.id === product.id);

        let updatedItems: CartItem[];
        if (existingItem) {
            updatedItems = currentItems.map((cartItem) => {
                if (cartItem.id === existingItem.id) {
                    return { ...cartItem, quantity: cartItem.quantity + quantity };
                }
                return cartItem;
            });
        } else {
            updatedItems = [...currentItems, { ...product, quantity }];
        }
        patchState(store, { items: updatedItems });
        saveCartToLocalStorage(updatedItems);
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
        saveCartToLocalStorage(updatedItems);
    },
    removeFromCart(productId: string) {
        const currentItems = store.items();
        const updatedItems = currentItems.filter(cartItem => cartItem.id !== productId);
        patchState(store, { items: updatedItems });
        saveCartToLocalStorage(updatedItems);
    },
    clearCart() {
        patchState(store, { items: [] });
        saveCartToLocalStorage([]);
    }
})),
withHooks({
    onInit(store) {
        // Watch for changes and save to localStorage
        effect(() => {
            const items = store.items();
            saveCartToLocalStorage(items);
        });
    }
})
);