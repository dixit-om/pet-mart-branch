import { Component, afterNextRender, inject } from '@angular/core';
import { ProductStore } from '../store/product.store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productStore = inject(ProductStore);

  constructor() {
    afterNextRender(() => {
      this.productStore.loadProducts();
    });
  }
}
