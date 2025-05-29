import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
// Define the interfaces for type safety
export interface CartItem {
  cartItemId?: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  totalPrice: number;
  coverFile: string;
  coverFileName: string; // Add coverFileName to CartItem interface
}

export interface Cart {
  userId: number;
  cartDetails: CartItem[]; // This property should exist on Cart
}

export interface WishlistItem {
  wishlistId: string;  // Include wishlistId here
  userId: number;
  bookId: number;
  book: {
    bookID: number;
    title: string;
    author: string;
    price: number;
    coverFileName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8000/api/Cart';  // Base API URL for cart
  private wishlistApiUrl = 'http://localhost:8000/api/Wishlist';  // Base API URL for wishlist

  constructor(private http: HttpClient) {}

  // Get items in the user's cart
 getItems(userId: number): Observable<Cart> {
  return this.http.get<Cart>(`${this.apiUrl}/${userId}`).pipe(
    tap((cart) => {
      const count = cart.cartDetails?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      this.updateCartItemCount(count);
    }),
    catchError((error) => {
      console.error('Error fetching cart items:', error);
      return throwError(() => error);
    })
  );
}


  // Add an item to the cart
  addToCart(cartItem: Partial<CartItem>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, cartItem).pipe(
      catchError((error) => {
        console.error('Error adding item to cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Remove an item from the cart
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      catchError((error) => {
        console.error('Error removing item from cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Clear all items in the cart
  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`).pipe(
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }
private cartItemCount = new BehaviorSubject<number>(0);
cartItemCount$ = this.cartItemCount.asObservable();

updateCartItemCount(count: number): void {
  this.cartItemCount.next(count);
}

  // Place an order (Buy Now)
  placeOrder(orderData: any): Observable<any> {
    console.log('Cart Items before placing order:', orderData);

    return this.http.post('http://localhost:8000/api/Orders/place', orderData).pipe(
      catchError((error) => {
        console.error('Error placing order:', error);
        return throwError(() => error);
      })
    );
  }

  // Add item to the wishlist
  addToWishlist(wishlistItem: WishlistItem): Observable<any> {
    return this.http.post(`${this.wishlistApiUrl}/add`, wishlistItem).pipe(
      catchError((error) => {
        console.error('Error adding item to wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  // Remove item from the wishlist
  removeFromWishlist(wishlistItemId: number): Observable<any> {
    return this.http.delete(`${this.wishlistApiUrl}/remove/${wishlistItemId}`).pipe(
      catchError((error) => {
        console.error('Error removing item from wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  // Fetch wishlist items for the user
  getWishlistItems(wishlistId: string): Observable<any> {
    return this.http.get<any>(`${this.wishlistApiUrl}/${wishlistId}`).pipe(
      catchError((error) => {
        console.error('Error fetching wishlist items:', error);
        return throwError(() => error);
      })
    );
  }
}
