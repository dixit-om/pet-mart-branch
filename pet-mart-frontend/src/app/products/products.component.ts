import { Component, inject } from '@angular/core';
import { Product, ProductStore } from '../store/product.store';
import { CartStore } from '../store/cart.store';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  searchTerm = ''; // Value bound to input field
  productStore = inject(ProductStore);
  cartStore = inject(CartStore);

  constructor() {
    this.productStore.loadProducts();
  }

  onSearch(value: string) {
    this.searchTerm = value; // Update input immediately for UI responsiveness
    // Debouncing is handled in the store
    this.productStore.searchProducts(value);
  }
  addToCart(product: Product) {
    this.cartStore.addToCart(product);
  }
}
