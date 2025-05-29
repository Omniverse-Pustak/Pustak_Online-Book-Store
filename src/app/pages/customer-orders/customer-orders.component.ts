import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  imports: [CommonModule],
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {
  
  // Define the models for the orders and order details here
  orderList: OrderWithBookDetailsDto[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getCustomerOrders();
  }

  // Fetch the customer orders from the backend
  getCustomerOrders(): void {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If there's no token, show an error
    if (!token) {
      alert('User is not authenticated. Please login.');
      return;
    }

    // Define the headers with Authorization
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Make the HTTP request with the headers
    this.http.get<OrderWithBookDetailsDto[]>('http://localhost:8000/api/Orders/all', { headers })
      .subscribe({
        next: (orders) => {
          this.orderList = orders;
        },
        error: (err) => {
          console.error('Error fetching orders', err);
          alert('Error fetching orders!');
        }
      });
  }
}

// Define DTOs here
export interface OrderWithBookDetailsDto {
  orderId: string;
  userId: number;
  cartTotal: number;
  details: OrderDetailWithBookDto[];
}

export interface OrderDetailWithBookDto {
  orderDetailsId: number;
  quantity: number;
  price: number;
  bookId: number;
  title: string;
  author: string;
  coverFileName: string;
  totalPrice: number;
}