import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Task } from '../store/task';

@Component({
  selector: 'be-task-item',
  standalone: true,
  imports: [DatePipe, CardModule, RouterLink],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input(({ required: true })) task?: Task;
  @Input(({ required: true })) nr?: number;
}
