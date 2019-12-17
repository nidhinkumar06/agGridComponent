import { UserComponent } from './user/user.component';
import { CarComponent } from './car/car.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes = [
  { path: '', redirectTo: '/cars', pathMatch: 'full' },
  { path: 'cars', component: CarComponent },
  { path: 'users', component: UserComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
