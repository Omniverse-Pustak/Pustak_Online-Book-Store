import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient
import { CommonModule } from '@angular/common'; // Import CommonModule
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

interface Book {
  bookID: number;
  title: string;
  author: string;
  price: number;
  category: string;
  coverFileName: string;
  description: string;
}

@Component({
  selector: 'app-books-by-category',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './books-by-category.component.html',
  styleUrls: ['./books-by-category.component.css']
})
export class BooksByCategoryComponent implements OnInit {
  category: string = '';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  
  currentPage: number = 1; // The current page
  pageSize: number = 12;   // Number of books per page
  totalPages: number = 1;  // Total number of pages

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.loadBooks();
    });
  }

  loadBooks() {
    this.http.get<Book[]>(`http://localhost:8000/api/books/category/${this.category}`).subscribe((data: Book[]) => {
      this.books = data;
      this.filteredBooks = this.books.filter(book =>
        book.category.toLowerCase().trim() === this.category.toLowerCase().trim()
      );
  
      this.totalPages = Math.ceil(this.filteredBooks.length / this.pageSize);
      this.paginateBooks();
    }, error => {
      console.error('Error fetching books:', error);
    });
  }
  
  paginateBooks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredBooks = this.books.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateBooks();
    }
  }

  // Generate page numbers for pagination
  pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  isLoggedIn: boolean = true;
  cartItems: any[] = [];
  showCartAlert: boolean = false;
  alertMessage: string = '';

  onCartAlert() {
    console.log('onCartAlert triggered');
    if (this.isLoggedIn) {
      if (this.cartItems.length === 0) {
        this.alertMessage = `🛒 Your cart is currently empty, but don't worry! Explore our wide selection of books and start adding your favorites. 📚 Every book has a story waiting for you!`;
      }
    } else {
      this.alertMessage = `🚪 You need to sign in to view your cart! 🔑 Signing in will unlock all your favorites and let you add books to your cart.`;
    }

    if (this.alertMessage) {
      this.showCartAlert = true;
    }
  }

  onOkClick() {
    this.showCartAlert = false;
  }

  navigateToBookSummary(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }
}
