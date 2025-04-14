import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent {
  constructor(private router: Router) {}

  handleSubmit() {
    console.log('Admin wants to update a book');
  }

  goBackHome() {
    this.router.navigate(['']);
  }
}
