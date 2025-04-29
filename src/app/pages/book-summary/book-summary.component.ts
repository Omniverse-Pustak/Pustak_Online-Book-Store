import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.services';

@Component({
  selector: 'app-book-summary',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './book-summary.component.html',
  styleUrls: ['./book-summary.component.css']
})
export class BookSummaryComponent implements OnInit {
  bookId!: number;
  book: any;
  cartItems: any[] = [];

  showCartAlert = false;
  alertMessage = '';

  isLoggedIn = false;
  userId: number | null = null;
  cartId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get the book ID from route params
    this.route.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
      this.loadBook();
    });

    // Check if user is logged in from localStorage
    if (typeof localStorage !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      const storedCartId = localStorage.getItem('cartId');
      this.isLoggedIn = !!storedUserId;  // Check if userId exists in localStorage
      this.userId = storedUserId ? Number(storedUserId) : null;  // Parse userId from localStorage
      this.cartId = storedCartId ? Number(storedCartId) : null;
    }

    // Fetch cart items if the user is logged in
    if (this.userId) {
      this.cartService.getItems(this.userId).subscribe(
        (data) => {
          // If the API returns cartDetails, use that
          this.cartItems = data.cartDetails || []; // Adjusted for cartDetails
          console.log('Fetched cart items:', this.cartItems);
        },
        (error) => {
          console.error('Error fetching cart items:', error);
        }
      );
    }
  }

  loadBook() {
    this.http.get<any>(`http://localhost:8000/api/books/${this.bookId}`).subscribe({
      next: (data) => {
        this.book = data;
      },
      error: (error) => {
        console.error('Error fetching book:', error);
      }
    });
  }

  addToCart() {
    if (!this.isLoggedIn && this.userId === null) {
      alert('Admin cannot add to the user cart.');
      return;
    }
  
    if (!this.isLoggedIn) {
      alert('Please log in to add items to cart!');
      return;
    }
  
    // Check if the current user is an admin
    
    const payload = {
      userId: this.userId,
      bookId: this.bookId,
      quantity: 1
    };
  
    this.http.post('http://localhost:8000/api/cart/add', payload).subscribe({
      next: () => {
        console.log('Item added to cart successfully');
        this.alertMessage = `🛒 Added "${this.book.title}" to cart successfully!`;
        this.showCartAlert = true;
        
        this.refreshCartItems(); // Fetch updated cart items after adding
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
        alert('Error adding item to cart!');
      }
    });
  }
  

  addToWishlist() {
    alert(`❤️ "${this.book.title}" added to wishlist!`);
  }

  onOkClick() {
    this.showCartAlert = false;
  }

  onCartAlert() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/cart']);
    } else {
      this.alertMessage = `🛒 Your cart is empty! Add books first.`;
      this.showCartAlert = true;
    }
  }

  refreshCartItems() {
    if (this.userId) {
      this.cartService.getItems(this.userId).subscribe(
        (data) => {
          // Adjusted for cartDetails based on API response
          this.cartItems = data.cartDetails || []; 
          console.log('Refreshed cart items:', this.cartItems);
        },
        (error) => {
          console.error('Error refreshing cart items:', error);
        }
      );
    }
  }
}
