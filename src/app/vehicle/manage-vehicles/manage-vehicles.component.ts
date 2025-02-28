import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../vehicle.service';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleDTO } from '../vehicle.model';

@Component({
  selector: 'app-manage-vehicles',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-vehicles.component.html',
  styleUrls: ['./manage-vehicles.component.css'],
})
export class ManageVehiclesComponent implements OnInit, OnDestroy {
  vehicles: VehicleDTO[] = [];
  vehicleForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentVehicleId: number | null = null;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private renderer: Renderer2) {
    this.vehicleForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      seats: [1, [Validators.required, Validators.min(1)]],
      licensePlate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'manage-vehicles-body');
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehiclesByDriver().subscribe({
      next: (data) => {
        console.log(data);  
        this.vehicles = data;
        console.log(this.vehicles);
        if (this.vehicles && this.vehicles.length > 0) {
          console.log(this.vehicles[0].make);  
        } else {
          console.log('No vehicles available');
        }
        
      },
      error: (err) => console.error('Failed to load vehicles', err),
    });
  }
  

  openAddVehicleModal() {
    this.isEditing = false;
    this.vehicleForm.reset({ seats: 1 });
    this.vehicleForm.reset({ seats: 1, licensePlate: '' }); 
    this.isModalOpen = true;
  }

  editVehicle(vehicle: any) {
    this.isEditing = true;
    this.currentVehicleId = vehicle.vehicleId;
    this.vehicleForm.patchValue(vehicle);
    this.vehicleForm.patchValue(vehicle); 
    this.isModalOpen = true;
  }

  deleteVehicle(vehicleId: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter((v) => v.vehicleId !== vehicleId);
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

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'manage-vehicles-body');
  }
}
