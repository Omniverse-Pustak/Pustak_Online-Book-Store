import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent {

  isAdmin: boolean = false;
  isLoggedIn: boolean;
  userId: number | null = null;
  cartId!: string;
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
  cartItems: any[] = [];
  showCartAlert: boolean = false;
  alertMessage: string = '';

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

  // --- Popular Books Methods ---
  fetchPopularBooks() {
    this.http.get<any[]>('http://localhost:8000/api/books/popular').subscribe({
      next: (books) => {
        this.popularBooks = books;
      },
      error: (error) => {
        console.error('Error fetching popular books:', error);
      }
    });
  }

  submitPopularForm() {
    if (this.popularForm.valid) {
      const formData = this.popularForm.value;
      console.log('Submitting Popular Book Update:', formData);

      this.http.post('http://localhost:8000/api/books/setpopular', {
        bookId: formData.bookId,
        status: formData.status
      }).subscribe({
        next: (response) => {
          console.log('Popular status updated successfully!', response);
          alert('Popular status updated successfully!');
          this.popularForm.reset();
        },
        error: (error) => {
          console.error('Error updating popular status:', error);
          alert('Something went wrong. Please try again.');
        }
      });
    } else {
      console.log('Form is invalid!');
      alert('Please fill out the form correctly!');
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
        this.alertMessage = `🛒 Your cart is currently empty, but don't worry! Explore our wide selection of books and start adding your favorites.`;
        this.showCartAlert = true;
      } else {
        this.router.navigate(['/cart']); // Navigate to cart directly
      }
    } else {
      this.alertMessage = `🚪 You need to sign in to view your cart! 🔑 Signing in will unlock all your favorites.`;
      this.showCartAlert = true;
    }
  }

  onOkClick() {
    this.showCartAlert = false;
  }
}
