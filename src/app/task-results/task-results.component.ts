import { Component, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Subject, filter, map, take } from 'rxjs';
import { Task, TaskResult, TaskResultEvaluation, TaskTraining } from '../store/task';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { editTask, evaluateTaskResult, findTaskResult } from '../store/task.actions';
import { resultFile } from '../store/task.selector';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'be-task-results',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, DatePipe, ButtonModule, PanelModule, TableModule, SelectButtonModule, DialogModule, ProgressSpinnerModule, TooltipModule],
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

  selectedResult: any = null;
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
      { header: 'AI-model', width: 'auto' },
      { header: 'Resolution', width: 'auto' },
      { header: 'Date', width: 'auto' }
    ];
    if (task!.training === TaskTraining.ENABLED) {
      columns.push({ header: 'Evaluation (Training)', width: '14rem' });
    }
    columns.push({ header: '', width: '10rem' });
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
  taskResult$ = this.task$.pipe(map(task => task.results.find(result => result.filename === (this.selectedResult as TaskResult)?.filename)?.data));

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  changeTraining(task: Task) {
    if (task.training === TaskTraining.ENABLED && !!task.results?.find(result => result.evaluation !== TaskResultEvaluation.NEUTRAL)) {
      this.confirmationService.confirm({
        header: 'Disable task training',
        icon: 'fas fa-robot',
        acceptButtonStyleClass: 'p-button-danger',
        message: 'Are you sure you that want to disable training for this task? All existing training data for this task will be deleted in this case.',
        accept: () => this.store.dispatch(editTask({ taskId: task.id, training: TaskTraining.DISABLED }))
      });
    } else {
      this.store.dispatch(editTask({ taskId: task.id, training: task.training === TaskTraining.ENABLED ? TaskTraining.DISABLED : TaskTraining.ENABLED }))
    }
  }

  evaluateTaskResult(event: { value?: { evaluation: TaskResultEvaluation } }, fileId: string) {
    this.store.dispatch(evaluateTaskResult({
      taskId: this.task.id,
      fileId,
      evaluation: event.value!.evaluation
    }));
  }

  downloadFile(result: TaskResult) {
    const download = (blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob!);
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    if (result.file) {
      download(result.file);
    } else {
      this.store.select(resultFile(this.task.id, result.filename)).pipe(filter(blob => !!blob), take(1)).subscribe(blob => download(blob!));
      this.store.dispatch(findTaskResult({
        taskId: this.task.id,
        fileId: result.filename
      }));
    }
  }

  onSelectResult(event: { data?: TaskResult }) {
    if (event.data && !event.data.data) {
      this.store.dispatch(findTaskResult({
        taskId: this.task.id,
        fileId: event.data.filename.split('.json')[0]
      }));
    } else {
      this.task$.next(this.task);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && !!this.task) {
      this.task$.next(this.task);
    }
  }
}
