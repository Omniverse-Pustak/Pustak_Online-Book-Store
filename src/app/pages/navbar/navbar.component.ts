import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // 👈 Import this!

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule], // 👈 Add ReactiveFormsModule here
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showDropdown = false;
  private hideTimeout: any;

  // Reactive FormControl for search box
  searchControl = new FormControl(''); // 👈 define the form control

  constructor(private router: Router, private http: HttpClient) {} // 👈 also inject HttpClient here

  @Output() cartClicked = new EventEmitter<void>();

  navigateToLogin() {
    this.router.navigate(['/login']);
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

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

  navigateToMyOrders() {
    this.router.navigate(['/my-orders']);
  }

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
          // Navigate to search results page and pass books
          this.router.navigate(['/search-results'], { state: { books } });
        }
      },
      error: (err) => {
        alert('Books not found.');
      }
    });
  }
  
  
  

}
