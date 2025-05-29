import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router for navigation
import { HttpClient } from '@angular/common/http';  // Import HttpClient for API calls
import { environment } from '../../../environments/environment';  // Import environment for API URL
import { HttpClientModule } from '@angular/common/http';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component'; // Adjust path as needed


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [HttpClientModule, AlertPopupComponent], 
})
export class SignupComponent {
  constructor(
    private router: Router, 
    private http: HttpClient
  ) {}
showAlert: boolean = false;
alertMessage: string = '';

  // Method to navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Method to handle the signup process
  onSignup(
  firstName: HTMLInputElement,
  lastName: HTMLInputElement,
  email: HTMLInputElement,
  password: HTMLInputElement,
  confirmPassword: HTMLInputElement,
  gender: HTMLInputElement
) {
  const passwordValue = password.value;

  if (passwordValue !== confirmPassword.value) {
    this.alertMessage = 'Passwords do not match';
    this.showAlert = true;
    return;
  }

  if (!firstName.value || !lastName.value || !email.value || !passwordValue) {
    this.alertMessage = 'Please fill in all required fields';
    this.showAlert = true;
    return;
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPasswordRegex.test(passwordValue)) {
    this.alertMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.';
    this.showAlert = true;
    return;
  }

  const signupData = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: email.value,
    password: passwordValue,
    gender: gender.value || 'Not Specified'
  };

  this.http.post(`${environment.apiUrl}/api/auth/signup`, signupData).subscribe({
    next: () => {
      this.alertMessage = 'Signup successful!';
      this.showAlert = true;
      // Wait for user to click "OK" before redirecting
    },
    error: () => {
      this.alertMessage = 'Signup failed. Please try again.';
      this.showAlert = true;
    }
  });
}
onAlertOkClick() {
  if (this.alertMessage === 'Signup successful!') {
    this.router.navigate(['/login']);
  }
  this.showAlert = false;
}


}
