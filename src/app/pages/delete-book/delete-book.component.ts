import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./delete-book.component.css']
})
export class DeleteBookComponent {
  deleteBookForm: FormGroup;
  apiUrl = 'http://localhost:8000/api/Books';

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.deleteBookForm = this.fb.group({
      bookId: ['', [Validators.required, Validators.min(1)]],  // Validate that it's a positive integer
    });
  }

  // Handle delete book logic
  handleSubmit() {
    if (this.deleteBookForm.invalid) {
      alert('Please provide a valid Book ID.');
      return;
    }

    const bookId = this.deleteBookForm.value.bookId;

    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated. Please login first.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Call the API to delete the book
    this.http.delete<any>(`${this.apiUrl}/${bookId}`, { headers }).subscribe({
      next: (response) => {
        console.log('Book deleted successfully', response);
        alert('Book deleted successfully!');
        this.router.navigate(['']); // Navigate back to the home page or wherever you want
      },
      error: (err) => {
        console.error('Error deleting book', err);
        alert('Error deleting book!');
      }
    });
  }

  // Navigate back to the home page
  goBackHome() {
    this.router.navigate(['']);
  }
}
