import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularizeBookComponent } from './popularize-book.component';

describe('PopularizeBookComponent', () => {
  let component: PopularizeBookComponent;
  let fixture: ComponentFixture<PopularizeBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularizeBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularizeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
