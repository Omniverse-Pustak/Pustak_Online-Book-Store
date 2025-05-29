import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import for form modules
import { HttpClientModule } from '@angular/common/http'; // Import for HttpClient
import { RouterTestingModule } from '@angular/router/testing'; // Import for routing in tests
import { AddBookComponent } from './add-book.component';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component'; // Import for AlertPopup

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, // Required for form handling
        HttpClientModule, // Required for HttpClient usage
        RouterTestingModule, // Required for routing
        AlertPopupComponent, // Import the AlertPopupComponent
        AddBookComponent // Import the AddBookComponent itself
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional test cases can be added here
});
