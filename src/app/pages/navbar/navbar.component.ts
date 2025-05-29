import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CartService } from '../../services/cart.services'; // Adjust path accordingly
import { OnInit } from '@angular/core';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, AlertPopupComponent],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showDropdown = false;
  private hideTimeout: any;
  searchControl = new FormControl('');

  constructor(private router: Router, private http: HttpClient, private cartService: CartService) {}

  @Output() cartClicked = new EventEmitter<void>();
cartItemCount = 0;

ngOnInit(): void {
  this.cartService.cartItemCount$.subscribe(count => {
    this.cartItemCount = count;
  });
}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
goBack(): void {
  window.history.back();
}

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  onMouseEnter(): void {
    clearTimeout(this.hideTimeout);
    this.showDropdown = true;
  }

  onMouseLeave(): void {
    this.hideTimeout = setTimeout(() => {
      this.showDropdown = false;
    }, 5000);
  }

  emitCartClicked() {
    console.log('Cart icon clicked');
    this.cartClicked.emit();
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getFirstName(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('firstName') || 'User';
    }
    return 'User';
  }

  isAdmin(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role') === 'Admin';
    }
    return false;
  }
  

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

  navigateToMyOrders() {
    this.router.navigate(['/my-orders']);
  }

  navigateToCustomerOrders() {
    this.router.navigate(['/customer-orders']);
  }
showSearchAlert: boolean = false;
searchAlertMessage: string = '';

  searchBook() {
  const trimmedQuery = this.searchControl.value?.trim();
  if (!trimmedQuery) return;

  const queryArray = trimmedQuery.split(',')
    .map(q => q.trim())
    .filter(q => q.length > 0);

  this.http.post<any[]>('http://localhost:8000/api/Books/search-multiple', queryArray).subscribe({
    next: (books) => {
      if (books.length === 1) {
        this.router.navigate(['/book', books[0].bookID]);
      } else {
        this.router.navigate(['/search-results'], { state: { books } });
      }
    },
    error: (err) => {
      this.searchAlertMessage = 'Books not found.';
      this.showSearchAlert = true;
    }
  });
}

}
