import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { AgGridModule } from 'ag-grid-angular'; // Importer AgGridModule
import { LeaderboardComponent } from './leaderboard/leaderboard.component'; 
import { ClientSideRowModelModule } from 'ag-grid-community';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartModule,
    LeaderboardComponent,
    AgGridModule,
  ],
  providers: [],
})
export class AppModule {}
