import { Component, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, filter, map, take } from 'rxjs';
import { KeepTrainingData, Task, TaskResult, TaskResultEvaluation, TaskTraining } from '../store/task';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { deleteTaskResult, editTask, evaluateTaskResult, findTaskResult } from '../store/task.actions';
import { resultFile } from '../store/task.selector';
import { breakpoint } from '../store/ui.selector';
import { RecreateViewDirective } from '../shared/recreate-view.directive';

@Component({
  selector: 'be-task-results',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, DatePipe, ButtonModule, InputSwitchModule, PanelModule, TableModule, SelectButtonModule, DialogModule, ProgressSpinnerModule, TooltipModule, RecreateViewDirective],
  templateUrl: './task-results.component.html',
  styleUrl: './task-results.component.scss'
})
export class TaskResultsComponent implements OnChanges {
  @Input({ required: true }) task!: Task;

  breakpoint$ = this.store.select(breakpoint);

  evaluationOptions = [
    { icon: 'far fa-face-frown', evaluation: TaskResultEvaluation.NEGATIVE },
    { icon: 'far fa-face-meh', evaluation: TaskResultEvaluation.NEUTRAL },
    { icon: 'far fa-face-smile-beam', evaluation: TaskResultEvaluation.POSITIVE },
  ];

  form = this.fb.group({ training: true });

  selectedResult: any = null;
  task$ = new Subject<Task>();
  data$ = this.task$.pipe(map(task => {
    const columns = [
      { header: 'AI-model', width: 'auto' },
      { header: 'FDS', width: 'auto' },
      { header: 'Date', width: 'auto' }
    ];
    this.form.controls.training.setValue(task.training === TaskTraining.ENABLED);
    if (task.training === TaskTraining.ENABLED) {
      columns.push({ header: 'Evaluation (Training)', width: '14rem' });
    }
    columns.push({ header: '', width: '10rem' });
    return {
      columns,
      rows: task.results?.map(result => ({
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
  ) { }

  changeTraining() {
    if (this.task.training === TaskTraining.ENABLED && !!this.task.results?.find(result => result.evaluation !== TaskResultEvaluation.NEUTRAL)) {
      this.confirmationService.confirm({
        header: 'Disable task training',
        icon: 'fas fa-robot',
        acceptButtonStyleClass: 'p-button-danger',
        message: 'Are you sure that you want to disable training for this task? All existing training data for this task will be deleted in this case.',
        accept: () => this.store.dispatch(editTask({ taskId: this.task.id, training: TaskTraining.DISABLED }))
      });
    } else {
      this.store.dispatch(editTask({ taskId: this.task.id, training: this.task.training === TaskTraining.ENABLED ? TaskTraining.DISABLED : TaskTraining.ENABLED }))
    }
  }

  evaluateTaskResult(event: { value?: { evaluation: TaskResultEvaluation } }, fileId: string) {
    this.store.dispatch(evaluateTaskResult({
      taskId: this.task.id,
      fileId,
      evaluation: event.value!.evaluation
    }));
  }

  deleteTaskResult(result: TaskResult) {
    const dispatchDeleteTaskResult = (keepTrainingData = true) => {
      this.store.dispatch(deleteTaskResult({
        taskId: this.task.id,
        fileId: result.filename,
        keepTrainingData: keepTrainingData ? KeepTrainingData.TRUE : KeepTrainingData.FALSE
      }));
    };
    this.confirmationService.confirm({
      header: 'Delete task result',
      icon: 'fas fa-trash-can',
      acceptButtonStyleClass: 'p-button-danger',
      message: 'Are you sure that you want to delete this result?',
      accept: () => setTimeout(() => {
        if (result.evaluation === TaskResultEvaluation.NEUTRAL) {
          dispatchDeleteTaskResult();
        } else {
          this.confirmationService.confirm({
            header: 'Delete evaluated training data',
            icon: 'fas fa-robot',
            acceptButtonStyleClass: 'p-button-danger',
            message: 'Would you also like to delete the corresponding evaluated training data for this result?',
            accept: () => dispatchDeleteTaskResult(false),
            reject: () => dispatchDeleteTaskResult()
          });
        }
      }, 500)
    });
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
