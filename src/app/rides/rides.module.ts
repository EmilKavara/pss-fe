import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RidesRoutingModule } from './rides-routing.module';
import { RideFormComponent } from './ride-form/ride-form.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RidesRoutingModule,
    ReactiveFormsModule,
    RideFormComponent
  ]
})
export class RidesModule { }
