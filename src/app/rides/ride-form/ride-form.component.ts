import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../vehicle/vehicle.service';
import { RideService } from '../ride.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./ride-form.component.css'],
})
export class RideFormComponent implements OnInit, OnDestroy {
  rideForm: FormGroup;
  maxSeats: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private rideService: RideService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.rideForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureTime: ['', Validators.required],
      availableSeats: [
        '',
        [Validators.required, Validators.min(1)] 
      ],
    });
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'ride-form-body');
    this.loadMaxSeats();
  }

  loadMaxSeats() {
    this.authService.getDriverVehicle().subscribe({
      next: (vehicle) => {
        console.log('Vehicle data:', vehicle);
        if (vehicle && vehicle.seats) {
          this.maxSeats = vehicle.seats; 
          
          if (this.maxSeats !== null) {
            this.rideForm.controls['availableSeats'].setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(this.maxSeats), 
            ]);
            this.rideForm.controls['availableSeats'].updateValueAndValidity();
          }
        } else {
          console.error('Vehicle not found for the driver or no seats found');
          alert('No vehicle found for the driver or no seats available.');
        }
      },
      error: (err) => {
        console.error('Failed to load vehicle for driver:', err);
        alert('Failed to load vehicle data. Please try again.');
      },
    });
  }

  submitForm() {
    if (this.rideForm.valid) {
      const rideData = {
        ...this.rideForm.value,
        status: "ACTIVE",
        driverName: "", 
        id: null, 
      };
      this.loading = true;
      this.rideService.createRide(rideData).subscribe({
        next: (response) => {
          console.log('Ride created successfully:', response);
          alert('Ride created successfully!');
          this.router.navigate(['/rides-page']);
        },
        error: (error) => {
          console.error('Error creating ride:', error);
          alert('Failed to create ride. Please try again.');
        },
        complete: () => {
          this.loading = false; 
        },
      });
    } else {
      alert('Please correct the form errors before submitting.');
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'ride-form-body');
  }
  
}
