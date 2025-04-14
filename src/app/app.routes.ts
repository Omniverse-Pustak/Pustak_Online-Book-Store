
import {  Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component'; // ✅ Import this
import { HomeComponent } from './pages/home/home.component';
import { AddBookComponent } from './pages/add-book/add-book.component';
import { DeleteBookComponent } from './pages/delete-book/delete-book.component';
import { UpdateBookComponent } from './pages/update-book/update-book.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }, 
  { path: '', component: HomeComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'delete-book', component: DeleteBookComponent },
  { path: 'update-book', component: UpdateBookComponent }
];


export class AppRoutingModule { }
