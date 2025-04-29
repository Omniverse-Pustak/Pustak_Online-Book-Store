import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    HttpClientModule   // 👈 Add HttpClientModule here
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: [false]
    });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      alert('Please fill in all fields!');
      return;
    }
  
    const loginData = {
      username: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };
  
    const isAdmin = this.loginForm.value.isAdmin;
    const apiUrl = isAdmin 
      ? 'http://localhost:8000/api/auth/admin-login' 
      : 'http://localhost:8000/api/auth/login';
  
    this.http.post<any>(apiUrl, loginData).subscribe({
      next: (response) => {
        console.log('Login success', response);
  
        // Save to local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('userId', response.userId?.toString() ?? '');  // Ensure the UserId is saved
        localStorage.setItem('cartId', response.cartId?.toString() ?? '');  // Ensure the CartId is saved
  
        // ✅ Update isLoggedIn
        this.authService.login();
  
        // Redirect to /home
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Invalid username or password!');
      }
    });
  }
  
  
}