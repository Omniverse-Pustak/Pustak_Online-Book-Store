import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.services';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Component({
  selector: 'app-book-summary',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule, AlertPopupComponent],
  templateUrl: './book-summary.component.html',
  styleUrls: ['./book-summary.component.css']
})
export class BookSummaryComponent implements OnInit {
  bookId!: number;
  book: any;
  cartItems: any[] = [];

  showCartAlert = false;
  showDeleteConfirm = false;
  alertMessage = '';

  isAdmin = false;
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
    this.route.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
      this.loadBook();

      const storedRole = localStorage.getItem('role');
      this.isAdmin = storedRole === 'Admin';
    });

    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');
    this.isLoggedIn = !!storedUserId;
    this.userId = storedUserId ? Number(storedUserId) : null;
    this.cartId = storedCartId ? Number(storedCartId) : null;

    if (this.userId) {
      this.cartService.getItems(this.userId).subscribe(
        data => this.cartItems = data.cartDetails || [],
        error => console.error('Error fetching cart items:', error)
      );
    }
  }

  loadBook() {
    this.http.get<any>(`http://localhost:8000/api/books/${this.bookId}`).subscribe({
      next: (data) => this.book = data,
      error: (error) => console.error('Error fetching book:', error)
    });
  }

  addToCart() {
    if (this.isAdmin) {
      this.alertMessage = 'Admin cannot add to the user cart.';
      this.showCartAlert = true;
      return;
    }

    if (!this.isLoggedIn) {
      this.alertMessage = 'Please log in to add items to cart!';
      this.showCartAlert = true;
      return;
    }

    const payload = {
      userId: this.userId,
      bookId: this.bookId,
      quantity: 1
    };

    this.http.post('http://localhost:8000/api/cart/add', payload).subscribe({
      next: () => {
        this.alertMessage = `🛒 Added "${this.book.title}" to cart successfully!`;
        this.showCartAlert = true;
        this.refreshCartItems();
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
        this.alertMessage = 'Error adding item to cart!';
        this.showCartAlert = true;
      }
    });
  }

  refreshCartItems() {
    if (this.userId) {
      this.cartService.getItems(this.userId).subscribe(
        data => this.cartItems = data.cartDetails || [],
        error => console.error('Error refreshing cart items:', error)
      );
    }
  }

  deleteBook() {
    this.showDeleteConfirm = true;
  }

  onCancelDelete() {
    this.showDeleteConfirm = false;
  }

  handleOkClick() {
    if (this.showDeleteConfirm) {
      this.onConfirmDelete();
    } else {
      this.onOkClick();
    }
  }

  onOkClick() {
    this.showCartAlert = false;
  }

  onConfirmDelete() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.alertMessage = 'You are not authenticated. Please log in.';
    this.showDeleteConfirm = false;
    this.showCartAlert = true;
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  this.http.delete(`http://localhost:8000/api/books/${this.bookId}`, { headers }).subscribe({
    next: () => {
      this.alertMessage = 'Book deleted successfully!';
      this.showDeleteConfirm = false;
      this.showCartAlert = true;

      setTimeout(() => this.router.navigate(['/']), 2000);
    },
    error: (error) => {
      console.error('Error deleting book:', error);

      // Show the error message without immediately hiding alert
      if (error.status === 409) {
        this.alertMessage = `Cannot delete "${this.book?.title}" because it is currently in one or more user carts.`;
      } else {
        this.alertMessage = 'Failed to delete book.';
      }

      this.showDeleteConfirm = false;
      this.showCartAlert = true;

      // DO NOT hide the alert immediately; let user close it manually
    }
  });
}


  onCartAlert() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/cart']);
    } else {
      this.alertMessage = '🛒 Your cart is empty! Add books first.';
      this.showCartAlert = true;
    }
  }

  editBook() {
    this.router.navigate(['/update-book'], { queryParams: { id: this.bookId } });
  }

  addToWishlist() {
    this.alertMessage = `❤️ "${this.book.title}" added to wishlist!`;
    this.showCartAlert = true;
  }

  onImageError(event: any) {
    event.target.src = '/default.jpg';
  }
}
