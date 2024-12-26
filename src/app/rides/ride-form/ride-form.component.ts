import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../vehicle/vehicle.service';
import { RideService } from '../ride.service';
import { CommonModule } from '@angular/common';  // For ngIf
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./ride-form.component.scss'],
})
export class RideFormComponent implements OnInit {
  rideForm: FormGroup;
  maxSeats: number | null = null;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private rideService: RideService,
    private authService: AuthService
  ) {
    this.rideForm = this.fb.group({
      startLocation: ['', Validators.required],
      destination: ['', Validators.required],
      departureTime: ['', Validators.required],
      availableSeats: [
        '',
        [Validators.required, Validators.min(1)] 
      ],
    });
  }

  ngOnInit(): void {
    this.loadMaxSeats();
  }

  loadMaxSeats() {
    this.authService.getDriverVehicle().subscribe({
      next: (vehicle) => {
        console.log('Vehicle data:', vehicle);
        if (vehicle && vehicle.seats) {
          this.maxSeats = vehicle.seats;  // Assuming the response contains the seats property
          
          if (this.maxSeats !== null) {
            // Update the availableSeats form control with dynamic maxSeats
            this.rideForm.controls['availableSeats'].setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(this.maxSeats), // Apply max only if maxSeats is valid
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
  
  

  /**
   * Podnošenje forme za kreiranje vožnje.
   */
  submitForm() {
    if (this.rideForm.valid) {
      this.rideService.createRide(this.rideForm.value).subscribe({
        next: (response) => {
          console.log('Ride created successfully:', response);
          alert('Ride created successfully!');
        },
        error: (error) => {
          console.error('Error creating ride:', error);
          alert('Failed to create ride. Please try again.');
        },
      });
    } else {
      alert('Please correct the form errors before submitting.');
    }
  }
  
}
