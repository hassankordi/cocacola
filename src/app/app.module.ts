import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BulletChartAllModule } from '@syncfusion/ej2-angular-charts';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule  } from '@syncfusion/ej2-angular-charts';
import { CategoryService, LineSeriesService,} from '@syncfusion/ej2-angular-charts' 
import { EditService, GridAllModule, GridModule, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



//import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    FeahterIconModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    FormsModule,
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    ChartsModule,
    NgApexchartsModule,
    BulletChartAllModule,
    ChartAllModule, 
    AccumulationChartAllModule, 
    RangeNavigatorAllModule,
    GridAllModule, 
    GridModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
 
  ],
 
  providers: [
    AuthGuard,
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    },
    CategoryService, LineSeriesService, EditService, ToolbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
