import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../vehicle.service';
import { CommonModule } from '@angular/common';  // For ngIf
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./add-vehicle.component.css'],
})
export class AddVehicleComponent {
  vehicleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.vehicleForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      seats: [1, [Validators.required, Validators.min(1)]],
      licensePlate: ['', [Validators.required]]
    });
  }

  onAddVehicle() {
    if (this.vehicleForm.valid) {
      this.vehicleService.addVehicle(this.vehicleForm.value).subscribe({
        next: () => {
          alert('Vehicle added successfully!');
          this.router.navigate(['/driver-dashboard']); // Redirect after adding vehicle
        },
        error: (err) => {
          console.error('Error adding vehicle:', err);
          alert('Failed to add vehicle. Please try again.');
        },
      });
    }
  }
}
