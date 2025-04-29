import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  imports: [
    ReactiveFormsModule,
    HttpClientModule   // 👈 Add HttpClientModule here
  ],
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  addBookForm: FormGroup;
  categories = [
    { name: 'Fiction' },
    { name: 'Non-Fiction' },
    { name: 'Competitive Exams' },
    { name: 'Academic Texts' },
    { name: 'Children & Young Adults' },
    { name: 'School' },
    { name: 'Self Help' },
    { name: 'Philosophy' },
    { name: 'Family & Relationships' },
    { name: 'Religion & Spirituality' }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.addBookForm = this.fb.group({
      bookName: ['', Validators.required],
      authorName: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      coverFileName: ['', Validators.required],
      description: ['', Validators.required],
      isPopular: [false]  // 👉 Add this line
    });
    
  }

  handleSubmit() {
    if (this.addBookForm.invalid) {
      alert('Please fill in all fields!');
      return;
    }
  
    const bookData = {
      title: this.addBookForm.value.bookName,
      author: this.addBookForm.value.authorName,
      category: this.addBookForm.value.category,
      price: this.addBookForm.value.price,
      coverFileName: this.addBookForm.value.coverFileName,
      description: this.addBookForm.value.description,
      isPopular: this.addBookForm.value.isPopular  // 👉 Add this line
    };
    
  
    // Get token from localStorage
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('User is not authenticated. Please login.');
      return;
    }
  
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    this.http.post<any>('http://localhost:8000/api/Books', bookData, { headers }).subscribe({
      next: (response) => {
        console.log('Book added successfully', response);
        alert('Book added successfully!');
        this.router.navigate(['']);  // Navigate back to the home page or wherever you want after submission
      },
      error: (err) => {
        console.error('Failed to add book', err);
        alert('Error adding book!');
      }
    });
  }
  
  goBackHome() {
    this.router.navigate(['']);  // Navigate back to the home page
  }
}
