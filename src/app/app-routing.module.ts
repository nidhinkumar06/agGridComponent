import { UserComponent } from './user/user.component';
import { CarComponent } from './car/car.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { SwitchesComponent } from './switches/switches.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes = [
  { path: '', redirectTo: '/cars', pathMatch: 'full' },
  { path: 'cars', component: CarComponent },
  { path: 'users', component: UserComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'switches', component: SwitchesComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
