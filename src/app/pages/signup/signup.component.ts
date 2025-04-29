import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router for navigation
import { HttpClient } from '@angular/common/http';  // Import HttpClient for API calls
import { environment } from '../../../environments/environment';  // Import environment for API URL
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [HttpClientModule], 
})
export class SignupComponent {
  constructor(
    private router: Router, 
    private http: HttpClient
  ) {}

  // Method to navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Method to handle the signup process
  onSignup(firstName: HTMLInputElement, lastName: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement, confirmPassword: HTMLInputElement, gender: HTMLInputElement) {
    // Check if the passwords match
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match');  // Simple alert for error
      return;
    }

    // Validate if required fields are empty
    if (!firstName.value || !lastName.value || !email.value || !password.value) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare data to send to the backend
    const signupData = {
      firstName: firstName.value,
      lastName: lastName.value,
      username: email.value,  // Assuming email is used as username
      password: password.value,
      gender: gender.value || 'Not Specified'  // If gender is not specified, use "Not Specified"
    };

    // Send POST request to backend API for signup
    this.http.post(`${environment.apiUrl}/api/auth/signup`, signupData).subscribe({
      next: (response) => {
        alert('Signup successful!');  // Simple alert for success
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert('Signup failed. Please try again.');  // Simple alert for error
        console.error(error);
      }
    });
  }
}
