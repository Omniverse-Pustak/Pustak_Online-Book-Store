import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showDropdown = false;
  private hideTimeout: any;

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  onMouseEnter(): void {
    // Cancel any scheduled hide and make sure the dropdown stays visible
    clearTimeout(this.hideTimeout);
    this.showDropdown = true;
  }

  onMouseLeave(): void {
    // Schedule hide only if the mouse leaves both the sign-in and dropdown
    this.hideTimeout = setTimeout(() => {
      this.showDropdown = false;
    }, 5000);
  }
  @Output() cartClicked = new EventEmitter<void>();  // Event to emit when cart is clicked

  emitCartClicked() {
    console.log('Cart icon clicked'); // ✅ Add this
    this.cartClicked.emit();
  }
  

 
}
