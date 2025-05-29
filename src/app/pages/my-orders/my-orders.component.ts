import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';  // Import your order service
import { CommonModule } from '@angular/common';  // Import CommonModule for common Angular directives
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  imports: [CommonModule, HttpClientModule, NavbarComponent, ReactiveFormsModule]
})
export class MyOrdersComponent implements OnInit {
  orderItems: any[] = [];  // Array to hold the order items
  userId: number = 0;  // Define userId, make sure it's initialized properly

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve userId from local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = +storedUserId;  // Parse the stored userId as a number
      this.fetchOrders();  // Fetch orders after userId is available
    } else {
      console.error('User ID is not available in local storage');
    }
  }

  fetchOrders() {
    if (this.userId) {
      // Fetch order items from your backend using the userId
      this.orderService.getOrders(this.userId).subscribe(
        (data) => {
          // Ensure that the response is an array and contains orders with details
          if (Array.isArray(data)) {
            this.orderItems = data.map((order) => {
              // Ensure each order has a details array
              return {
                orderId: order.orderId,
                cartTotal: order.cartTotal,
                details: order.details || [],  // Default to empty array if no details
              };
            });
            console.log('Fetched orders:', this.orderItems);  // Log the data to inspect it
          } else {
            console.error('Unexpected response structure', data);
          }
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    }
  }
shopNow() {
    this.router.navigate(['/']); // Navigates to the home or shop route
  }
  getTotalAmount() {
    // Calculate total amount across all orders
    return this.orderItems.reduce((total, item) => total + item.cartTotal, 0);
  }
}
