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
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() class: string = '';

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
                color: textColor,
                font: {
                  family: documentStyle.getPropertyValue('--font-family')
                }
            }
        },
        title: {
          display: true,
          text: this.title,
          color: textColor,
          font: {
            size: 15,
            family: documentStyle.getPropertyValue('--font-family')
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
    if (changes['title'] && this.title && this.options) {
      this.options.plugins.title.text = this.title;
    }
    if (changes['values'] && this.values) {
      this.data = {
        labels: this.values.map((_, key) => `${key + 1}`),
        datasets: [{
          label: this.label,
          data: this.values,
        }]
      }
    }
  }
}
