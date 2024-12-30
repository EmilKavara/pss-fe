import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideFormComponent } from './ride-form/ride-form.component';  

const routes: Routes = [
  {
    path: '',        
    component: RideFormComponent,  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule], 
})
export class RidesRoutingModule {}
