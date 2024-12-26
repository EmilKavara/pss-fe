import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-manage-vehicles',
  templateUrl: './manage-vehicles.component.html',
  styleUrls: ['./manage-vehicles.component.css'],
})
export class ManageVehiclesComponent implements OnInit {
  vehicles: any[] = [];
  vehicleForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentVehicleId: number | null = null;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      seats: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => (this.vehicles = data),
      error: (err) => console.error('Failed to load vehicles', err),
    });
  }

  openAddVehicleModal() {
    this.isEditing = false;
    this.vehicleForm.reset({ seats: 1 });
    this.isModalOpen = true;
  }

  editVehicle(vehicle: any) {
    this.isEditing = true;
    this.currentVehicleId = vehicle.id;
    this.vehicleForm.patchValue(vehicle);
    this.isModalOpen = true;
  }

  deleteVehicle(vehicleId: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter((v) => v.id !== vehicleId);
          alert('Vehicle deleted successfully');
        },
        error: (err) => console.error('Failed to delete vehicle', err),
      });
    }
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      if (this.isEditing && this.currentVehicleId) {
        this.vehicleService
          .updateVehicle(this.currentVehicleId, this.vehicleForm.value)
          .subscribe({
            next: () => {
              this.loadVehicles();
              this.closeModal();
              alert('Vehicle updated successfully');
            },
            error: (err) => console.error('Failed to update vehicle', err),
          });
      } else {
        this.vehicleService.addVehicle(this.vehicleForm.value).subscribe({
          next: () => {
            this.loadVehicles();
            this.closeModal();
            alert('Vehicle added successfully');
          },
          error: (err) => console.error('Failed to add vehicle', err),
        });
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditing = false;
    this.currentVehicleId = null;
  }
}
