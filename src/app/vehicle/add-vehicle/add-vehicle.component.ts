import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../vehicle.service';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./add-vehicle.component.css'],
})
export class AddVehicleComponent implements OnInit, OnDestroy {
  vehicleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private renderer: Renderer2
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
          this.router.navigate(['/driver-dashboard']); 
        },
        error: (err) => {
          console.error('Error adding vehicle:', err);
          alert('Failed to add vehicle. Please try again.');
        },
      });
    }
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'add-vehicle-body');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'add-vehicle-body');
  }

}
