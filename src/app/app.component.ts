import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  hideNavbar = false;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = event.url.includes('/login') || 
                          event.url.includes('/signup') || 
                          event.url.includes('/add-book') || 
                          event.url.includes('/delete-book') || 
                          event.url.includes('/update-book');
      }
    });
  }
}
