import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // ✅ Add this import

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent {
  addBooksForm: FormGroup;
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
  ]; // Same as before

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.addBooksForm = this.fb.group({
      books: this.fb.array([this.createBookForm()])
    });
  }

  get books(): FormArray {
    return this.addBooksForm.get('books') as FormArray;
  }

  createBookForm(): FormGroup {
    return this.fb.group({
      bookName: ['', Validators.required],
      authorName: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      coverFileName: ['', Validators.required],
      description: ['', Validators.required],
      isPopular: [false]
    });
  }

  addBookForm() {
    this.books.push(this.createBookForm());
  }

  handleSubmit() {
    if (this.addBooksForm.invalid) {
      alert('Please fill in all fields!');
      return;
    }

    const booksData = this.books.value.map((book: any) => ({
      title: book.bookName,
      author: book.authorName,
      category: book.category,
      price: book.price,
      coverFileName: book.coverFileName,
      description: book.description,
      isPopular: book.isPopular
    }));

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User is not authenticated. Please login.');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    this.http.post<any>('http://localhost:8000/api/Books/bulk', booksData, {headers}).subscribe({
      next: (response) => {
        alert('Books added successfully!');
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Failed to add books', err);
        alert('Error adding books!');
      }
    });
  }

  goBackHome() {
    this.router.navigate(['']);
  }
}
