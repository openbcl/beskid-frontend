import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Job } from '../store/job';

@Component({
  selector: 'be-job-status',
  standalone: true,
  imports: [AsyncPipe, ChipModule, ProgressSpinnerModule],
  templateUrl: './job-status.component.html',
  styleUrl: './job-status.component.scss'
})
export class JobStatusComponent {
  @Input({ required: true })
  job!: Job;
}
