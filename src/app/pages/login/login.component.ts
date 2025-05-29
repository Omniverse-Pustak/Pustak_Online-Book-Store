import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    HttpClientModule ,
     AlertPopupComponent  // 👈 Add HttpClientModule here
  ],
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;
  alertMessage = '';
  showAlert = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  showPopup(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.showPopup('Please fill in all fields!');
      return;
    }

    const loginData = {
      username: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    // Send to a single endpoint, let backend determine role
    this.http.post<any>('http://localhost:8000/api/auth/login', loginData).subscribe({
      next: (response) => {
        console.log('Login success', response);

        // Save to local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);  // Could be 'admin' or 'user'
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('userId', response.userId?.toString() ?? '');
        localStorage.setItem('cartId', response.cartId?.toString() ?? '');

        this.authService.login();

        // Optional: navigate differently if admin
        if (response.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);  // Adjust as needed
        } else {
          this.router.navigate(['/home']);  // or just `['']`
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.showPopup('Invalid username or password!');
      }
    });
  }
}
