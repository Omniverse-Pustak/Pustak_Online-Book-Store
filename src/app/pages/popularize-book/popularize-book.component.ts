import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popularize-book',
  templateUrl: './popularize-book.component.html',
  imports: [HttpClientModule, ReactiveFormsModule],
  styleUrls: ['./popularize-book.component.css']
})
export class PopularizeBookComponent implements OnInit {
  popularForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.popularForm = this.fb.group({
      bookId: ['', Validators.required],
      status: ['popular', Validators.required]
    });
  }

  submitPopularForm(): void {
    if (this.popularForm.valid) {
      const formData = this.popularForm.value;
      console.log('Popular Book Update:', formData);

      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        alert('User is not authenticated. Please login.');
        return;
      }

      // Set headers with token
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call to update the book's popularity status
      this.http.post('http://localhost:8000/api/books/setpopular', {
        bookId: formData.bookId,
        status: formData.status
      }, { headers }).subscribe({
        next: (response) => {
          console.log('Popular status updated successfully!', response);
          alert('Popular status updated successfully!');
          this.router.navigate(['/admin']); // Navigate back to the admin page
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
}
