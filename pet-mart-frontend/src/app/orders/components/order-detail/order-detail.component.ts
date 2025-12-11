import { Component } from '@angular/core';
import { input } from '@ngrx/signals';
import { OrderWithItems } from '../../../store/order.store';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  order = input.required<OrderWithItems>(); 
}
