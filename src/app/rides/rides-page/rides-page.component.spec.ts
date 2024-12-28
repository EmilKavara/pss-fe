import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesPageComponent } from './rides-page.component';

describe('RidesPageComponent', () => {
  let component: RidesPageComponent;
  let fixture: ComponentFixture<RidesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
