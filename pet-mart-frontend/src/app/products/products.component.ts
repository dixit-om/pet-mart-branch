import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductStore } from '../store/product.store';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  inputValue = ''; // Value bound to input field
  productStore = inject(ProductStore);
  private destroyRef = inject(DestroyRef);
  private searchProducts$ = new Subject<string>();

  constructor() {
    this.productStore.loadProducts();
    
    // Setup debounced search subscription - API call only after 500ms of no typing
    console.log('🔧 Setting up debounced search subscription');
    this.searchProducts$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (searchTerm: string) => {
        console.log('⏱️ Debounced search - calling API with term:', searchTerm);
        this.productStore.searchProducts(searchTerm);
      },
      error: (error) => {
        console.error('❌ Search subscription error:', error);
      }
    });
  }

  onSearch(value: string) {
    console.log('⌨️ User typed:', value, '- Emitting to Subject');
    this.inputValue = value; // Update input immediately for UI responsiveness
    this.searchProducts$.next(value); // Emit to debounced stream (API call happens after debounce)
  }
}
