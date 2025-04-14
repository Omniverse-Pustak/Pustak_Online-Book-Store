import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  styleUrls: ['./delete-book.component.css']
})
export class DeleteBookComponent {
  constructor(private router: Router) {}

  handleSubmit() {
    console.log('Admin wants to delete a book');
  }

  goBackHome() {
    this.router.navigate(['']);
  }
}
