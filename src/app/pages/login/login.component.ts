import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router to handle navigation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {}  // Inject the Router service

  // Method to navigate to the signup page
  navigateToSignup() {
    this.router.navigate(['/signup']);  // Navigate to '/signup' route
  }
}
