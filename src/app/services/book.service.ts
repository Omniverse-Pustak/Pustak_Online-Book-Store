import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8000/api/Books';

  constructor(private http: HttpClient) {}

  // Get a book by its ID
  getBookById(bookId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${bookId}`);
  }

  // Update book details
  updateBook(bookId: string, bookData: any, options: { headers: HttpHeaders }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/${bookId}`, bookData, options);
  }
}
