import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule, ReactiveFormsModule, AlertPopupComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent {

  isAdmin: boolean = false;
  isLoggedIn: boolean;
  userId: number | null = null;
  cartId!: string;
  // General alert
showAlert: boolean = false;
alertMessage: string = '';

// Confirmation dialog for delete
showDeleteConfirm: boolean = false;
bookToDelete: { id: number, title: string } | null = null;

// Submission popup
showSubmitAlert: boolean = false;
submitAlertMessage: string = '';
showAnyAlert: boolean = false;
currentAlertMessage: string = '';
confirmMode: boolean = false;
alertType: 'delete' | 'submit' | 'cart' | null = null;


  categories = [
    { name: 'Fiction', icon: 'favorite' },
    { name: 'Non-Fiction', icon: 'library_books' },
    { name: 'Competitive Exams', icon: 'school' },
    { name: 'Academic Texts', icon: 'import_contacts' },
    { name: 'Children & Young Adults', icon: 'child_care' },
    { name: 'School', icon: 'school' },
    { name: 'Self Help', icon: 'psychology' },
    { name: 'Philosophy', icon: 'emoji_objects' },
    { name: 'Family & Relationships', icon: 'group' },
    { name: 'Religion & Spirituality', icon: 'auto_stories' }
  ];
 popularBooks: any[] = [];
  paginatedBooks: any[] = [];
  currentPage: number = 1;  // Track the current page
  pageSize: number = 8;     // Show 6 books per page (2 rows of 3 books)
  totalPages: number = 1;
  
  cartItems: any[] = [];
  showCartAlert: boolean = false;
  

  popularForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.isLoggedIn = this.authService.isLoggedIn;

    // Ensure that the code is running in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const storedUserId = Number(localStorage.getItem('userId'));
      this.userId = storedUserId > 0 ? storedUserId : null;
      const role = localStorage.getItem('role');
      console.log('User role from localStorage:', role);
      this.isAdmin = role === 'Admin';
    }

    this.popularForm = new FormGroup({
      bookId: new FormControl('', Validators.required),
      status: new FormControl('popular', Validators.required)
    });

    // Fetch popular books
    this.fetchPopularBooks();

    // Fetch cart if logged in and userId is valid
    if (this.isLoggedIn && this.userId) {
      this.fetchCart();
    }
  }
handlePopupClick() {
  if (this.confirmMode && this.alertType === 'delete') {
    this.onConfirmDelete();
  } else {
    this.resetPopup();
  }
}
handleCancelClick() {
  this.resetPopup();
}

resetPopup() {
  this.showAnyAlert = false;
  this.confirmMode = false;
  this.alertType = null;
  this.currentAlertMessage = '';
}


  // --- Popular Books Methods ---
  fetchPopularBooks() {
    this.http.get<any[]>('http://localhost:8000/api/books/popular').subscribe({
      next: (books) => {
        this.popularBooks = books;
        this.totalPages = Math.ceil(this.popularBooks.length / this.pageSize);
        this.paginateBooks();
      },
      error: (error) => {
        console.error('Error fetching popular books:', error);
      }
    });
  }

  paginateBooks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBooks = this.popularBooks.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateBooks();
    }
  }

  pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

   editBook(bookId: number) {
    this.router.navigate(['/update-book'], { queryParams: { id: bookId } });
  }

  deleteBook(bookId: number, bookTitle: string) {
  this.bookToDelete = { id: bookId, title: bookTitle };
 this.currentAlertMessage = `Are you sure you want to delete "${bookTitle}"?`;
this.confirmMode = true;
this.alertType = 'delete';
this.showAnyAlert = true;

}

onConfirmDelete() {
  if (!this.bookToDelete) return;

  const token = localStorage.getItem('token');
  if (!token) {
    this.alertMessage = 'You are not authenticated. Please log in.';
    this.showAlert = true;
    this.showDeleteConfirm = false;
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  this.http.delete(`http://localhost:8000/api/books/${this.bookToDelete.id}`, { headers }).subscribe({
    next: () => {
      this.alertMessage = 'Book deleted successfully!';
      this.showAlert = true;
      this.fetchPopularBooks();
      this.resetPopup();
    },
    error: (error) => {
      console.error('Error deleting book:', error);

      // Show generic "in cart" message for any error
      this.currentAlertMessage = `Cannot delete "${this.bookToDelete?.title}" because it is currently in one or more user carts.`;
      this.confirmMode = false;
      this.alertType = 'submit'; // generic alert
      this.showAnyAlert = true;

    },
    complete: () => {
      this.showDeleteConfirm = false;
      this.bookToDelete = null;
    }
  });
}

goToStartPage() {
  if (this.currentPage !== 1) {
    this.currentPage = 1;
    this.paginateBooks();
  }
}

goToEndPage() {
  if (this.currentPage !== this.totalPages) {
    this.currentPage = this.totalPages;
    this.paginateBooks();
  }
}

  submitPopularForm() {
  if (this.popularForm.valid) {
    const formData = this.popularForm.value;

    this.http.post('http://localhost:8000/api/books/setpopular', {
      bookId: formData.bookId,
      status: formData.status
    }).subscribe({
      next: () => {
      this.currentAlertMessage = 'Popular status updated successfully!';
this.confirmMode = false;
this.alertType = 'submit';
this.showAnyAlert = true;

        this.popularForm.reset();
      },
      error: (error) => {
        console.error('Error updating popular status:', error);
        this.submitAlertMessage = 'Something went wrong. Please try again.';
        this.showSubmitAlert = true;
      }
    });
  } else {
    this.submitAlertMessage = 'Please fill out the form correctly!';
    this.showSubmitAlert = true;
  }
}


  // --- Scroll Methods ---
  scrollRight(scrollContainer: HTMLElement) {
    const scrollAmount = 320;
    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  scrollLeft(scrollContainer: HTMLElement) {
    const scrollAmount = 320;
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  // --- Navigation Methods ---
  onCategoryClick(category: any) {
    console.log('Category clicked:', category.name);
    this.router.navigate(['/books', category.name]);
  }

  handleAction(action: string) {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1);
    console.log(`Admin wants to ${action} a book`);
    this.router.navigate([`/${action}-book`]);
  }

  navigateToBookSummary(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }

  // --- Cart Methods (Backend Integrated) ---
  fetchCart() {
    if (!this.userId) {
      console.error('User is not logged in or userId is invalid.');
      return;
    }

    this.http.get<any>(`http://localhost:8000/api/cart/${this.userId}`).subscribe({
      next: (cart) => {
        this.cartId = cart.cartId;
        this.cartItems = cart.items || [];
        console.log('Fetched cart:', cart);
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      }
    });
  }

  addToCart(productId: number, quantity: number = 1) {
    if (!this.isLoggedIn) {
      alert('Please log in to add items to cart!');
      return;
    }

    if (!this.cartId || !this.userId) {
      console.error('Invalid cartId or userId');
      return;
    }

    const payload = {
      cartId: this.cartId,
      userId: this.userId,
      productId: productId,
      quantity: quantity
    };

    this.http.post('http://localhost:8000/api/cart/add', payload).subscribe({
      next: () => {
        console.log('Item added to cart successfully');
        this.fetchCart();
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
      }
    });
  }

  removeFromCart(cartItemId: number) {
    this.http.delete(`http://localhost:8000/api/cart/remove/${cartItemId}`).subscribe({
      next: () => {
        console.log('Item removed from cart successfully');
        this.fetchCart();
      },
      error: (error) => {
        console.error('Error removing item from cart:', error);
      }
    });
  }

  clearCart() {
    if (!this.userId) {
      console.error('Invalid userId');
      return;
    }

    this.http.delete(`http://localhost:8000/api/cart/clear/${this.userId}`).subscribe({
      next: () => {
        console.log('Cart cleared successfully');
        this.fetchCart();
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      }
    });
  }

  // --- Cart Alert Handling ---
  onCartAlert() {
    if (this.isLoggedIn) {
      if (this.cartItems.length === 0) {
        this.currentAlertMessage = `🛒 Your cart is currently empty, but don't worry! Explore our wide selection of books and start adding your favorites.`;
        


      } else {
        this.router.navigate(['/cart']); // Navigate to cart directly
      }
    } else {
      this.currentAlertMessage = `🚪 You need to sign in to view your cart! 🔑 Signing in will unlock all your favorites.`;
     this.confirmMode = false;
this.alertType = 'cart';
this.showAnyAlert = true;
    }
  }

  onOkClick() {
    this.showCartAlert = false;
  }
}
