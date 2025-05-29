import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  imports: [CommonModule, AlertPopupComponent],
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  books: any[] = [];
showNoResultsAlert: boolean = false;
alertMessage: string = '';

  constructor(private router: Router) {
  const navigation = this.router.getCurrentNavigation();
  this.books = navigation?.extras?.state?.['books'] || [];

  if (this.books.length === 0) {
    this.alertMessage = 'No books found for your search.';
    this.showNoResultsAlert = true;
  }
}


  viewBookSummary(bookID: number) {
    this.router.navigate(['/book', bookID]);
  }
}
