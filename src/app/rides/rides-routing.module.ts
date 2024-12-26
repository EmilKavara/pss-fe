// rides/rides-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideFormComponent } from './ride-form/ride-form.component';  // Importujte komponentu

const routes: Routes = [
  {
    path: '',        // Putanja koja je aktivna kada korisnik poseti "/rides"
    component: RideFormComponent,  // Komponenta koja će biti prikazana
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Registrujte rute za ovaj modul
  exports: [RouterModule],  // Izvozite RouterModule da bi rute bile dostupne
})
export class RidesRoutingModule {}
