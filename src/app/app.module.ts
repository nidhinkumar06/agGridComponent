import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridComponent } from './grid/grid.component';
import { UserComponent } from './user/user.component';
import { AppRoutingModule } from './app-routing.module';
import { CarComponent } from './car/car.component';
import { listReducer } from './redux/reducers/auditListReducer';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { gridReducer } from './redux/reducers/gridWidthReducer';
import { SwitchesComponent } from './switches/switches.component';
import { MultiSelectDropDownModule } from './multi-select-drop-down';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    UserComponent,
    CarComponent,
    VehiclesComponent,
    SwitchesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({
      auditList: listReducer,
      gridList: gridReducer
    }),
    MultiSelectDropDownModule,
    NgMultiSelectDropDownModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
