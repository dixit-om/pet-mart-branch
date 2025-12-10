import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  createCheckoutSession(items: Array<{ priceId: string; quantity: number }>): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/api/payment/create-checkout-session`, {
      items
    });
  }
}



