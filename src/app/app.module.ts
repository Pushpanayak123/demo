import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { Exercise2Component } from './exercise2/exercise2.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    HomeComponent,
    Exercise2Component,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    Exercise2Component
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
