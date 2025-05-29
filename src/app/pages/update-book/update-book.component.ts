import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component'; // Adjust path if needed

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, AlertPopupComponent],
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css'],
   encapsulation: ViewEncapsulation.None,  
  
})
export class UpdateBookComponent implements OnInit {
  bookForm: FormGroup;
  bookId!: number;
  showAlert: boolean = false;
  alertMessage: string = '';
  postSuccessRedirect: boolean = false;

  // Store original data to detect changes
  originalBookData: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.bookForm = this.fb.group({
      bookId: ['', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      isPopular: [false],  // Default value for isPopular
      coverFileName: ['', Validators.required]  // Added coverFileName field
    });
  }

  ngOnInit(): void {
    // Fetch the bookId from the route parameters
    this.route.queryParams.subscribe(params => {
      this.bookId = Number(params['id']);
      this.loadBookDetails();  // Load book details if we have an ID
    });
  }

  // Function to fetch book details and populate the form
  loadBookDetails() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.alertMessage = 'User is not authenticated. Please login.';
      this.showAlert = true;
      this.postSuccessRedirect = true;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Get the book details by bookId
    this.http.get<any>(`http://localhost:8000/api/books/${this.bookId}`, { headers }).subscribe(
      (book) => {
        this.bookForm.patchValue({
          bookId: book.bookID,
          title: book.title,
          author: book.author,
          category: book.category,
          price: book.price,
          description: book.description,
          isPopular: book.isPopular,
          coverFileName: book.coverFileName
        });
this.bookForm.markAsPristine(); 
        this.originalBookData = this.bookForm.getRawValue();  // Save original form data
        this.bookForm.markAsPristine();
      },
      (error) => {
        console.error('Error fetching book details:', error);
        this.alertMessage = 'Failed to load book details. Please try again.';
        this.showAlert = true;
      }
    );
  }

  // Check if the form has any changes compared to the original data
  hasFormChanged(): boolean {
    if (!this.originalBookData) return false;

    const currentData = this.bookForm.getRawValue();

    return Object.keys(this.originalBookData).some(key => {
      return this.originalBookData[key] !== currentData[key];
    });
  }

  // Handle form submission to update the book
  handleSubmit() {
    if (this.bookForm.invalid) {
      this.alertMessage = 'Please fill in all fields correctly.';
      this.showAlert = true;
      return;
    }

    const updatedBook = this.bookForm.value;

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      this.alertMessage = 'User is not authenticated. Please login.';
      this.showAlert = true;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Send the updated book data to the backend
    this.http.put(`http://localhost:8000/api/books/${this.bookId}`, updatedBook, { headers }).subscribe({
      next: () => {
        this.alertMessage = 'Book updated successfully!';
        this.showAlert = true;
        this.postSuccessRedirect = true;
      },
      error: (error) => {
        console.error('Error updating book:', error);
        this.alertMessage = 'Failed to update book. Please try again.';
        this.showAlert = true;
      }
    });
  }

  onAlertOkClick() {
    this.showAlert = false;

    if (this.postSuccessRedirect) {
      if (this.alertMessage.includes('login')) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  // Method to navigate back to the home page
  goBackHome() {
    this.router.navigate(['/']);
  }
}
