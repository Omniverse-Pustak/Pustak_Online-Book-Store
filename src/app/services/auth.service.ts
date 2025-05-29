import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Now you can safely use localStorage here
      const token = localStorage.getItem('authToken');
      console.log(token);
    }
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('firstName');
  }
}
