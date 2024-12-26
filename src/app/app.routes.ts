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
    redirectTo: determineRedirectRoute(), // Dinamička ruta
    pathMatch: 'full',
  },
  {
    path: 'profile', // Add the profile route
    component: UserProfileComponent,
    canActivate: [AuthGuard], // Optionally, you can use the AuthGuard here too
  },
  {
    path: 'driver-dashboard', // Add the profile route
    component: DriverDashboardComponent,
    canActivate: [AuthGuard], // Optionally, you can use the AuthGuard here too
  },
  {
    path: 'passenger-dashboard', // Add the profile route
    component: PassengerDashboardComponent,
    canActivate: [AuthGuard], // Optionally, you can use the AuthGuard here too
  },
  {
    path: 'manage-vehicles', // Add the profile route
    component: ManageVehiclesComponent,
    canActivate: [AuthGuard], // Optionally, you can use the AuthGuard here too
  },
];

/**
 * Dinamičko određivanje rute na osnovu tokena i role.
 * @returns Ruta za preusmeravanje.
 */
function determineRedirectRoute(): string {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Pretpostavljamo da je uloga sačuvana u localStorage

  if (token) {
    if (role === 'driver') {
      return '/rides'; // Vozač ide na rides
    } else if (role === 'passenger') {
      return '/dashboard'; // Putnik ide na dashboard
    }
  }
  return '/login'; // Ako korisnik nije ulogovan, ide na login
}
