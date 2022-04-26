import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";
// Ng2-charts
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { PlanComponent } from './plan/plan.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule  } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { OwlDateTimeModule, OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import { EditTablePopupComponent } from './plan/edit-table-popup/edit-table-popup.component';
import { ProductPlanPopupComponent } from './plan/product-plan-popup/product-plan-popup.component';
import { MachineComponent } from './machine/machine.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MachineIndecatorComponent } from './machine-indecator/machine-indecator.component';
import { MachineTagExploreComponent } from './machine-tag-explore/machine-tag-explore.component';
import { MachineStatusPopUp } from './machine/machine-status-pop-up/machine-status-pop-up.component';

export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric'},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,

  },
  {
    path:'Plan',
    component:PlanComponent
  },
  {
    path:'machine',
    component:MachineComponent
  },
  {
    path:'machine-indecators',
    component:MachineIndecatorComponent
  },
  {
    path:'machine-tag-explore',
    component:MachineTagExploreComponent
  },


]

@NgModule({
  declarations: [
    DashboardComponent,
    PlanComponent,
    EditTablePopupComponent,
    ProductPlanPopupComponent,
    MachineComponent,
    MachineIndecatorComponent,
    MachineTagExploreComponent,
    MachineStatusPopUp
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    ChartsModule,MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatTabsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
    ],
    providers: [
      DatePipe,
      { provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
    ],
})
export class DashboardModule { }
