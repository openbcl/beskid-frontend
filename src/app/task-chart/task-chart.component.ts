import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'be-task-chart',
  standalone: true,
  imports: [AsyncPipe, ChartModule],
  templateUrl: './task-chart.component.html',
  styleUrl: './task-chart.component.scss'
})
export class TaskChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) values: string[] = [];

  data = {
    labels: this.values.map((_, key) => `${key + 1}`),
    datasets: [{
      label: 'Input values',
      data: this.values,
    }]
  }

  options: any;

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

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['values'] && this.values) {
      this.data = {
        labels: this.values.map((_, key) => `${key + 1}`),
        datasets: [{
          label: 'Input values',
          data: this.values,
        }]
      }
    }
  }
}
