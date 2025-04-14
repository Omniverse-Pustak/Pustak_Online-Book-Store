import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isAdmin = true;
  categories = [
    { name: 'Fiction', icon: 'favorite' },
    { name: 'Non-Fiction', icon: 'library_books' },
    { name: 'Competitive Exams', icon: 'school' },
    { name: 'Academic Texts', icon: 'import_contacts' },
    { name: 'Children & Young Adults', icon: 'child_care' },
    { name: 'School', icon: 'school' },
    { name: 'Self Help', icon: 'psychology' },
    { name: 'Philosophy', icon: 'emoji_objects' },
    { name: 'Family & Relationships', icon: 'group' },
    { name: 'Religion & Spirituality', icon: 'auto_stories' }
  ];

  // Scroll right
  scrollRight(scrollContainer: HTMLElement) {
    const scrollAmount = 320; // Adjust this value as needed
    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // Scroll left (optional)
  scrollLeft(scrollContainer: HTMLElement) {
    const scrollAmount = 320; // Adjust this value as needed
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  // Method to handle category click
  onCategoryClick(category: any) {
    console.log('Category clicked:', category.name);  // Example action
    // You can add more logic here, like routing to a category details page
  }
  constructor(private router: Router) {}
  handleAction(action: string) {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1); // Capitalize first letter
    console.log(`Admin wants to ${action} a book`);
    this.router.navigate([`/${action}-book`]);
  }

  isLoggedIn: boolean = true;  // Set to true for logged-in users
  cartItems: any[] = [];  // Sample cart items (add/remove items to test)

  // For the alert box
  showCartAlert: boolean = false;
  alertMessage: string = '';

  // Handle the Cart Alert from NavbarComponent
  onCartAlert() {
    console.log('onCartAlert triggered'); // ✅ Log to verify
    if (this.isLoggedIn) {
      if (this.cartItems.length === 0) {
        this.alertMessage = `🛒 Your cart is currently empty, but don't worry! 
  Explore our wide selection of books and start adding your favorites. 📚 
  Every book has a story waiting for you!`;
      }
    } else {
      this.alertMessage = `🚪 You need to sign in to view your cart! 🔑 
  Signing in will unlock all your favorites and let you add books to your cart.`;
    }
  
    if (this.alertMessage) {
      this.showCartAlert = true;
    }
  }
  

  // Hide the Cart Alert when OK is clicked
  onOkClick() {
    this.showCartAlert = false;
  }

  
}
