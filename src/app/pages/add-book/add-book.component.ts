import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Component({
  selector: 'app-add-book',
  standalone: true,
  templateUrl: './add-book.component.html',
  imports: [ReactiveFormsModule, CommonModule, AlertPopupComponent],
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
  ];

   validationErrorMessage: string = '';

  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,  private cdRef: ChangeDetectorRef) {
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

  showPopup(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

  addBookForm() {
    this.books.push(this.createBookForm());
  }

 
 
 handleSubmit() {
  this.validationErrorMessage = '';
  console.log('Submitting form...');

  // Mark all fields as touched so Angular shows validation styles
  this.addBooksForm.markAllAsTouched();

  console.log('Form state:', this.addBooksForm.value);

  for (let i = 0; i < this.books.length; i++) {
    const bookGroup = this.books.at(i) as FormGroup;
    const controls = bookGroup.controls;

    console.log(`Validating Book ${i + 1}:`, bookGroup.value);

    if (
      !controls['bookName'].value ||
      !controls['authorName'].value ||
      !controls['category'].value ||
      controls['price'].value === null || controls['price'].value === '' ||
      !controls['coverFileName'].value ||
      !controls['description'].value
    ) {
      this.validationErrorMessage = `Please fill in all required fields for Book ${i + 1}`;
      console.warn(this.validationErrorMessage);
      return;
    }
  }

  const token = localStorage.getItem('token');
  if (!token) {
    this.validationErrorMessage = 'User is not authenticated. Please login.';
    console.warn(this.validationErrorMessage);
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

  console.log('Books data to submit:', booksData);

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  this.http.post<any>('http://localhost:8000/api/Books/bulk', booksData, { headers }).subscribe({
    next: (response) => {
      console.log('Books added successfully!', response);
      this.validationErrorMessage = '';
      this.showPopup('Books added successfully!');
    },
    error: (error) => {
      console.error('Error adding books:', error);
      this.showPopup('Error adding books!');
    }
  });
}

 


  goBackHome() {
    this.router.navigate(['']);
  }

  // Listen to okClick event from AlertPopupComponent
  onAlertOkClick() {
  this.showAlert = false;
  if (this.alertMessage === 'Books added successfully!') {
    this.router.navigate(['']);
  }
}

}
