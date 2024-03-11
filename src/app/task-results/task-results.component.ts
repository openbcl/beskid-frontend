import { Component, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Subject, map } from 'rxjs';
import { Task, TaskResultEvaluation, TaskTraining } from '../store/task';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { evaluateTaskResult } from '../store/task.actions';

@Component({
  selector: 'be-task-results',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, DatePipe, ButtonModule, PanelModule, TableModule, SelectButtonModule],
  templateUrl: './task-results.component.html',
  styleUrl: './task-results.component.scss'
})
export class TaskResultsComponent implements OnChanges {
  @Input({ required: true }) task!: Task;

  evaluationOptions = [
    { icon: 'far fa-face-frown', evaluation: TaskResultEvaluation.NEGATIVE },
    { icon: 'far fa-face-meh', evaluation: TaskResultEvaluation.NEUTRAL },
    { icon: 'far fa-face-smile-beam', evaluation: TaskResultEvaluation.POSITIVE },
];

  task$ = new Subject<Task>();
  data$ = this.task$.pipe(map(task => {
    if (!task.results.length) {
      return {
        show: false,
        columns: [],
        rows: []
      }
    }
    const columns = [
      { header: 'AI-model' },
      { header: 'Resolution' },
      { header: 'Date' }
    ];
    if (task!.training === TaskTraining.ENABLED) {
      columns.push({ header: 'Evaluation (Training)' });
    }
    columns.push({ header: '' });
    return {
      show: true,
      columns,
      rows: task.results.map(result => ({
        form: this.fb.group({
          evaluation: this.fb.control(this.evaluationOptions.find(option => option.evaluation === result.evaluation), { validators: [Validators.required]})
        }),
        ...result
      })) || []
    };
  }));

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {}

  evaluateTaskResult(event: { value?: { evaluation: TaskResultEvaluation } }, fileId: string) {
    this.store.dispatch(evaluateTaskResult({
      taskId: this.task.id,
      fileId,
      evaluation: event.value!.evaluation
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && !!this.task) {
      this.task$.next(this.task);
    }
  }
}
