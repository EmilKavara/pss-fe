import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RideFormComponent } from './rides/ride-form/ride-form.component';
import { SignupComponent } from './signup/signup.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard';
import { AddVehicleComponent } from './vehicle/add-vehicle/add-vehicle.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { PassengerDashboardComponent } from './passenger-dashboard/passenger-dashboard.component';
import { ManageVehiclesComponent } from './vehicle/manage-vehicles/manage-vehicles.component';
import { RidesPageComponent } from './rides/rides-page/rides-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'add-vehicle',
    component: AddVehicleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rides',
    component: RideFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: determineRedirectRoute(), 
    pathMatch: 'full',
  },
  {
    path: 'profile', 
    component: UserProfileComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'driver-dashboard', 
    component: DriverDashboardComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'passenger-dashboard', 
    component: PassengerDashboardComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'manage-vehicles',
    component: ManageVehiclesComponent,
    canActivate: [AuthGuard], 
  },
  { 
    path: 'rides-page', 
    component: RidesPageComponent ,
    canActivate: [AuthGuard],
  },
];


function determineRedirectRoute(): string {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 

  if (token) {
    if (role === 'driver') {
      return '/rides'; 
    } else if (role === 'passenger') {
      return '/dashboard'; 
    }
  }
  return '/login'; 
}
