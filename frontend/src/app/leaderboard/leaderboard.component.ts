import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface LeaderboardUser {
  id: number;
  username: string;
  points: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  standalone: true,
  imports: [CommonModule, AgGridAngular, HighchartsChartModule]
})
export class LeaderboardComponent implements OnInit, OnDestroy, AfterViewInit {
  leaderboard: LeaderboardUser[] = [];
  scoreUpdatedSubscription: Subscription = new Subscription();
  private gridApi!: GridApi;

  colDefs: ColDef[] = [
    { headerName: 'Id', field: 'id', minWidth: 100 },
    { headerName: 'Username', field: 'username', minWidth: 200 },
    { headerName: 'Points', field: 'points', minWidth: 100 }
  ];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      renderTo: 'chart-container' 
    },
    title: {
      text: 'Leaderboard Points'
    },
    xAxis: {
      categories: [],
      title: {
        text: 'Users'
      }
    },
    yAxis: {
      title: {
        text: 'Points'
      }
    },
    series: [{
      type: 'bar',
      name: 'Points',
      data: []
    }]
  };

  constructor(private http: HttpClient, private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchLeaderboard();
    this.scoreUpdatedSubscription = this.eventService.scoreUpdated$.subscribe(() => {
      this.fetchLeaderboard();
    });
  }

  ngAfterViewInit(): void {
    this.updateChart(this.leaderboard);
  }

  ngOnDestroy(): void {
    if (this.scoreUpdatedSubscription) {
      this.scoreUpdatedSubscription.unsubscribe();
    }
  }

  fetchLeaderboard(): void {
    this.http.get<LeaderboardUser[]>('http://localhost:3010/api/leaderboard')
      .subscribe(
        (data) => {
          this.leaderboard = data;
          this.updateChart(data);
        },
        (error) => {
          console.error('Error fetching leaderboard', error);
        }
      );
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  updateChart(data: LeaderboardUser[]): void {
    const categories = data.map(user => user.username);
    const points = data.map(user => user.points);

    if (Array.isArray(this.chartOptions.xAxis)) {
      this.chartOptions.xAxis[0].categories = categories;
    } else {
      (this.chartOptions.xAxis as Highcharts.XAxisOptions).categories = categories;
    }

    const series = this.chartOptions.series![0] as Highcharts.SeriesBarOptions;
    series.data = points;

    //Update the chart
    const chartContainer = document.getElementById(this.chartOptions.chart!.renderTo as string);
    if (chartContainer) {
      Highcharts.chart(chartContainer, this.chartOptions);
    }
  }

  addPoint(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.http.put(`http://localhost:3010/api/users/${userId}/points`, { points: 1 }, { responseType: 'text' })
        .subscribe(
          () => {
            console.log('Point added successfully.');
            this.eventService.announceScoreUpdated();
          },
          (error) => {
            console.error('Error adding point', error);
          }
        );
    }
  }
}
