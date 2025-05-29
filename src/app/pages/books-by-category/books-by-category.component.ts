import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

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
  imports: [CommonModule, NavbarComponent, HttpClientModule, AlertPopupComponent],
  templateUrl: './books-by-category.component.html',
  styleUrls: ['./books-by-category.component.css']
})
export class BooksByCategoryComponent implements OnInit {
  category: string = '';
  books: Book[] = [];
  filteredBooks: Book[] = [];

  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;

  isAdmin: boolean = false;
  isLoggedIn: boolean = true;

  cartItems: any[] = [];

  popupVisible: boolean = false;
  popupMessage: string = '';
  popupConfirmMode: boolean = false;
  popupBookIdToDelete: number | null = null;
  popupBookTitleToDelete: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.loadBooks();
      const storedRole = localStorage.getItem('role');
      this.isAdmin = storedRole === 'Admin';
    });
  }

  loadBooks() {
    this.http.get<Book[]>(`http://localhost:8000/api/books/category/${this.category}`).subscribe((data: Book[]) => {
      this.books = data;
      this.filteredBooks = data;
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

  

  pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editBook(bookId: number) {
    this.router.navigate(['/update-book'], { queryParams: { id: bookId } });
  }

  deleteBook(bookId: number, title: string) {
    this.popupVisible = true;
    this.popupMessage = `Are you sure you want to delete "${title}"?`;
    this.popupConfirmMode = true;
    this.popupBookIdToDelete = bookId;
    this.popupBookTitleToDelete = title;
  }
onPopupConfirm() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.popupMessage = 'You are not authenticated. Please log in.';
    this.popupConfirmMode = false;  // switch to OK mode to let user close popup manually
    return;
  }

  this.http.delete(`http://localhost:8000/api/books/${this.popupBookIdToDelete}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => {
      this.popupMessage = `"${this.popupBookTitleToDelete}" has been deleted.`;
      this.popupConfirmMode = false;  // show OK button to close popup
      this.loadBooks();
    },
    error: (error) => {
      if (error.status === 409) {
        this.popupMessage = `Cannot delete "${this.popupBookTitleToDelete}" because it is currently in one or more user carts.`;
      } else {
        this.popupMessage = 'Failed to delete book.';
      }
      this.popupConfirmMode = false;  // show OK button so user can close popup
      // Do NOT reset or close the popup immediately — user will close it by clicking OK
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

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.paginateBooks();
  }
}

  resetPopup() {
    this.popupVisible = false;
    this.popupConfirmMode = false;
    this.popupBookIdToDelete = null;
    this.popupBookTitleToDelete = '';
  }

  onOkClick() {
    this.resetPopup();
  }
handlePopupClick() {
  if (this.popupConfirmMode) {
    this.onPopupConfirm();
  } else {
    this.resetPopup();
  }
}

  onCartAlert() {
    if (this.isLoggedIn) {
      if (this.cartItems.length === 0) {
        this.popupMessage = `🛒 Your cart is currently empty!`;
        this.popupConfirmMode = false;
        this.popupVisible = true;
      }
    } else {
      this.popupMessage = `🚪 You need to sign in to view your cart!`;
      this.popupConfirmMode = false;
      this.popupVisible = true;
    }
  }

  navigateToBookSummary(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }

  onImageError(event: any) {
    event.target.src = '/default.jpg';
  }
}
