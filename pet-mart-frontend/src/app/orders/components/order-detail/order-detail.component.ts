import { Component, input } from '@angular/core';
import { OrderWithItems } from '../../../store/order.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  order = input.required<OrderWithItems | null>(); 
}
