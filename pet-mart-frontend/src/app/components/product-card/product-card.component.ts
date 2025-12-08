import { Component, input, output } from '@angular/core';
import { Product } from '../../store/product.store';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();

  addToCart = output<Product>();
  onAddToCart(product: Product) {
    this.addToCart.emit(product);
  }

}
