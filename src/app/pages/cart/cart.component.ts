import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadUserId();
    this.fetchCartItems();
  }

  // Load user ID from localStorage
  loadUserId(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = Number(storedUserId);
    } else {
      console.error('User ID not found in localStorage!');
    }
  }

  // Fetch cart items for the user
  fetchCartItems(): void {
    if (this.userId > 0) {
      this.cartService.getItems(this.userId).subscribe({
        next: (cartData: any) => { // Assuming the API returns 'cartDetails' or 'items'
          const cartItems: CartItem[] = cartData.cartDetails ?? cartData.items ?? [];

          this.cartItems = cartItems.map((item: any) => ({
            ...item,
            totalPrice: (item.price ?? 0) * (item.quantity ?? 0),
            coverFile: item.coverFile ?? 'default.jpg' // Add coverFile fallback if not available
          }));

          console.log('Fetched and populated cart items:', this.cartItems);
        },
        error: (error) => {
          console.error('Error fetching cart items:', error);
        }
      });
    }
  }

  // Increase item quantity
  increaseQuantity(item: CartItem): void {
    item.quantity++;
    item.totalPrice = (item.price ?? 0) * item.quantity;
  }

  // Decrease item quantity
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = (item.price ?? 0) * item.quantity;
    }
  }

  // Remove an item from the cart
  removeItem(item: CartItem): void {
    if (item.cartItemId) {
      this.cartService.removeFromCart(item.cartItemId).subscribe({
        next: () => {
          console.log('Item removed successfully');
          this.fetchCartItems(); // Refresh cart items
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
    } else {
      console.error('Item ID not found for removal!');
    }
  }

  // Add item to wishlist
  addToWishlist(item: CartItem): void {
    alert(`❤️ Added "${item.title}" to wishlist!`);
  }

  // Place the order (Buy Now)
 // Place the order (Buy Now)
 checkout(): void {
  if (this.userId > 0) {
    const orderData = {
      userId: this.userId,
      items: this.cartItems.map(item => ({
        bookId: item.bookId,  // Make sure bookId is being used here
        title: item.title,
        author: item.author,
        coverFileName: item.coverFileName,  // Ensure coverFileName exists in your CartItem
        totalPrice: item.totalPrice,
        quantity: item.quantity
      }))
    };

    // Log the order data to verify its structure
    console.log('Order data to be sent:', orderData);

    this.cartService.placeOrder(orderData).subscribe({
      next: () => {
        alert('Thank you for your purchase!');
        this.cartItems = [];  // Clear the cart after successful order
      },
      error: (error) => {
        console.error('Error placing order:', error);
      }
    });
  }
}



 
  // Get total amount of cart
  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.totalPrice ?? 0), 0);
  }
} 