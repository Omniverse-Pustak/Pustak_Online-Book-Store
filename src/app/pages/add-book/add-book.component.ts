import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  bookName = '';
  authorName = '';
  category = '';

  constructor(private router: Router) {}

  handleSubmit() {
    console.log(`Admin wants to add book: ${this.bookName}, by ${this.authorName} in ${this.category}`);
  }

  goBackHome() {
    this.router.navigate(['']);
  }
}
