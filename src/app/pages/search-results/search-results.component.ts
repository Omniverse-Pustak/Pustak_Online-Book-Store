import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  imports: [CommonModule],
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  books: any[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.books = navigation?.extras?.state?.['books'] || [];
  }

  viewBookSummary(bookID: number) {
    this.router.navigate(['/book', bookID]);
  }
}
