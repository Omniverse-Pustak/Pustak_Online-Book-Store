import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient} from '@angular/common/http';  
import { BookService } from '../../services/book.service';
import { HttpHeaders } from '@angular/common/http'; 

@Component({
  selector: 'app-update-book',
  standalone: true,  // Make sure your component is declared as standalone
  imports: [ 
    ReactiveFormsModule,
    HttpClientModule  // Include HttpClientModule here to enable HttpClient usage
  ],
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent {
  bookForm: FormGroup;

  constructor(private fb: FormBuilder, private bookService: BookService, private router: Router, private http: HttpClient){
    this.bookForm = this.fb.group({
      bookId: ['', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      isPopular: [false]  // 👉 Add this
    });
    
  }

  handleSubmit() {
    const bookId = this.bookForm.value.bookId;
    const updatedBook = this.bookForm.value;
    
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log token to check if it's being fetched
  
    if (!token) {
      alert('User is not authenticated. Please login.');
      return; // Stop the function if no token is found
    }
  
    // Create the headers using HttpHeaders
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Send the updated book data to the backend
    if (bookId) {
      this.bookService.updateBook(bookId, updatedBook, { headers }).subscribe(
        (response) => {
          // Show success alert after the book is updated
          alert('Book updated successfully!');
        },
        (error) => {
          // Log the full error to understand why the request failed
          console.error('Error updating book details:', error);
          alert('Error updating book details. Please try again.');
        }
      );
    } else {
      alert('Please enter a valid Book ID.');
    }
  }

  // Method to handle blur event when bookId is entered
  onBookIdChange() {
    const bookId = this.bookForm.value.bookId;
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe(
        (book) => {
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            description: book.description,
            isPopular: book.isPopular  // 👉 Add this line
          });
          
        },
        (error) => {
          console.error('Error fetching book details:', error);
        }
      );
    }
  }
  
  goBackHome() {
    this.router.navigate(['']);
  }
}
