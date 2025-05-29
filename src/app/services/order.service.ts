import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';  // Add throwError and Observable imports
import { catchError } from 'rxjs/operators';  // Add catchError import

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8000/api/Orders';  // Assuming your orders API URL

  constructor(private http: HttpClient) {}

  // Method to fetch orders for a specific user
  getOrders(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`).pipe(  // Use apiUrl
      catchError((error) => {
        console.error('Error fetching orders:', error);
        return throwError(() => error);  // Proper error handling
      })
    );
  }
}
