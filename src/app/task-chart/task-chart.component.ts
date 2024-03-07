import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { Subject, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'be-task-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './task-chart.component.html',
  styleUrl: './task-chart.component.scss'
})
export class TaskChartComponent implements OnInit, OnChanges {

  @Input({ required: true }) values: string[] = [];
  data$ = new Subject<string[]>();
  data = {
    labels: [ ...Array(100) ].map((_val, key) => `${key + 1}`),
    datasets: [{
      label: 'Input values',
      data: [] as string[],
    }]
  };

  options: any;
  counter = 0;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
              }
          }
      }
    }
  };

  constructor() {
    this.data$.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged((previous, current) => previous === current || previous && current?.find((value, i) => previous[i] !== value) === undefined)
    ).subscribe(values => {
      this.data.datasets[0].data = values;
      this.data = { ...this.data };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['values']) {
      this.data$.next(this.values);
    }
  }


}
