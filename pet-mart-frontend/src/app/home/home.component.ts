import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductStore, Product } from '../store/product.store';
import { CartStore } from '../store/cart.store';
import { ProductCardComponent } from '../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  productStore = inject(ProductStore);
  cartStore = inject(CartStore);

  constructor() {
    this.productStore.loadProducts();
  }

  get featuredProducts(): Product[] {
    // Get first 4 products as featured, or all if less than 4
    return this.productStore.products().slice(0, 4);
  }

  addToCart(product: Product) {
    this.cartStore.addToCart(product);
  }

  categories = [
    { name: 'Dogs', icon: '🐕', route: '/products' },
    { name: 'Cats', icon: '🐱', route: '/products' },
    { name: 'Birds', icon: '🐦', route: '/products' },
    { name: 'Fish', icon: '🐠', route: '/products' },
    { name: 'Small Pets', icon: '🐹', route: '/products' },
    { name: 'Reptiles', icon: '🦎', route: '/products' },
  ];
}




