import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { HttpClientTestingModule } from '@angular/common/http/testing'; // For testing HttpClient
import { RouterTestingModule } from '@angular/router/testing';  // For testing routing

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,  // Necessary for ngModel
        HttpClientTestingModule,  // Mock HTTP requests in tests
        RouterTestingModule  // Mock router for navigation
      ],
      declarations: [LoginComponent]  // Declare the LoginComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
