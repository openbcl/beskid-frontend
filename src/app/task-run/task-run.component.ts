import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Task } from '../store/task';
import { DropdownModule } from 'primeng/dropdown';
import { compatibleModels } from '../store/model.selector';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { findModels } from '../store/model.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, filter, map, switchMap, tap } from 'rxjs';
import { Experiment, Model } from '../store/model';
import { runTask } from '../store/task.actions';
import { isTaskRunning } from '../store/task.selector';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { uiState } from '../store/ui.selector';
import { RecreateViewDirective } from '../shared/recreate-view.directive';

@Component({
  selector: 'be-task-run',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, PanelModule, ButtonModule, FieldsetModule, TableModule, TooltipModule, DropdownModule, BlockUIModule, ProgressSpinnerModule, RecreateViewDirective],
  templateUrl: './task-run.component.html',
  styleUrl: './task-run.component.scss'
})
export class TaskRunComponent implements OnInit, OnChanges, AfterViewInit {
  @Input({ required: true }) task: Task | undefined;

  taskId$ = new Subject<string>();
  running$ = this.taskId$.pipe(switchMap(taskId => this.store.select(isTaskRunning(taskId))));
  models$ = this.taskId$.pipe(tap(foo => console.log(foo)), switchMap(() => this.store.select(compatibleModels(this.task!))));
  breakpoint$ = this.store.select(uiState).pipe(map(uiState => uiState.showTaskListSidebar ? '1200px' : '830px'));

  form = this.fb.group({
    selectedModel: this.fb.control<Model | undefined>(undefined, { validators: [Validators.required]}),
  });

  columns = [
    { header: 'AI-model', width: 'auto' },
    { header: 'FDS', width: 'auto' },
  ];

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.models$.pipe(takeUntilDestroyed(), filter(models => !!models?.length)).subscribe(models => this.onRowSelect({ data: models[0] }));
  }
  
  ngOnInit(): void {
    this.store.dispatch(findModels());
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(Math.random())
    if (changes['task']?.previousValue && changes['task'].previousValue.id !== this.task?.id) {
      this.taskId$.next(this.task!.id);
    }
  }

  ngAfterViewInit(): void {
    this.taskId$.next(this.task!.id);
  }

  runTask() {
    this.store.dispatch(runTask({
      taskId: this.task?.id!,
      modelId: this.form.value.selectedModel!.id
    }));
  }

  onRowSelect(event: { data?: Model }){
    this.form.controls.selectedModel.setValue(event.data!);
  }
}
