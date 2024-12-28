import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RidesRoutingModule } from './rides-routing.module';
import { RideFormComponent } from './ride-form/ride-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RidesListComponent } from './rides-list/rides-list.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RidesPageComponent } from './rides-page/rides-page.component';


@NgModule({
  declarations: [
    RidesPageComponent,
    RidesListComponent,
    RequestsListComponent,
    RideFormComponent
  ],
  imports: [
    CommonModule,
    RidesRoutingModule,
    ReactiveFormsModule,
    RideFormComponent,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    RidesListComponent,
    RequestsListComponent
  ]
})
export class RidesModule { }
