
import {  Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component'; // ✅ Import this
import { HomeComponent } from './pages/home/home.component';
import { AddBookComponent } from './pages/add-book/add-book.component';
import { DeleteBookComponent } from './pages/delete-book/delete-book.component';
import { UpdateBookComponent } from './pages/update-book/update-book.component';
import { BooksByCategoryComponent } from './pages/books-by-category/books-by-category.component';
import { BookSummaryComponent } from './pages/book-summary/book-summary.component';
import { PopularizeBookComponent } from './pages/popularize-book/popularize-book.component';
import { CartComponent } from './pages/cart/cart.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { CustomerOrdersComponent } from './pages/customer-orders/customer-orders.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }, 
  { path: '', component: HomeComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'delete-book', component: DeleteBookComponent },
  { path: 'update-book', component: UpdateBookComponent },
  { path: 'books/:category', component: BooksByCategoryComponent },
  { path: 'popularize-book', component: PopularizeBookComponent },
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  {
    path: 'search-results',
    component: SearchResultsComponent
  },
 
{
  path: 'book/:id',
  component: BookSummaryComponent,
},
{
  path: 'customer-orders',
  component: CustomerOrdersComponent,
},
{ path: 'home', component: HomeComponent } // 👈 add this



];


export class AppRoutingModule { }
