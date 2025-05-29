import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.services';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AlertPopupComponent, NavbarComponent],

  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number = 0;
// Add at the top inside the CartComponent class
popupVisible: boolean = false;
popupMessage: string = '';
popupConfirm: boolean = false;
popupCallback: (() => void) | null = null;

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
itemToRemove: CartItem | null = null;

removeItem(item: CartItem): void {
  this.itemToRemove = item;  // store the item to remove later on confirmation

  this.showPopup(
    `Are you sure you want to remove "${item.title}" from the cart?`,
    undefined,   // no immediate callback, removal happens on OK click
    true         // showConfirm = true to show OK/Cancel buttons
  );
}



  addToWishlist(item: CartItem): void {
  this.showPopup(`❤️ Added "${item.title}" to wishlist!`);
}


checkout(): void {
  if (this.userId > 0) {
    const orderData = {
      userId: this.userId,
      items: this.cartItems.map(item => ({
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        coverFileName: item.coverFileName,
        totalPrice: item.totalPrice,
        quantity: item.quantity
      }))
    };

    console.log('Order data to be sent:', orderData);

    this.cartService.placeOrder(orderData).subscribe({
      next: () => {
        this.showPopup('Thank you for your purchase!', () => {
          this.cartItems = [];
        });
      },
      error: (error) => {
        console.error('Error placing order:', error);
      }
    });

    this.cartService.updateCartItemCount(
      this.cartItems.reduce((count, item) => count + (item.quantity || 0), 0)
    );
  }
}

showPopup(message: string, callback?: () => void, showConfirm = false): void {
  this.popupMessage = message;
  this.popupVisible = true;
  this.popupConfirm = showConfirm;
  this.popupCallback = callback ?? null;
}







onPopupOk(): void {
  this.popupVisible = false;
  if (this.popupConfirm) {
    // Confirm popup: proceed with removal if itemToRemove exists
    if (this.itemToRemove && this.itemToRemove.cartItemId) {
      this.cartService.removeFromCart(this.itemToRemove.cartItemId).subscribe({
        next: () => {
          console.log('Item removed successfully');
          this.fetchCartItems();
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
    }
    this.itemToRemove = null;
  } else {
    // Normal popup without confirm
    if (this.popupCallback) {
      this.popupCallback();
      this.popupCallback = null;
    }
  }
}

onPopupCancel(): void {
  // User cancelled, just hide popup and reset
  this.popupVisible = false;
  this.itemToRemove = null;
  this.popupCallback = null;
}

 
  // Get total amount of cart
  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.totalPrice ?? 0), 0);
  }
} 