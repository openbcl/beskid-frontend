import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Task } from '../store/task';
import { DropdownModule } from 'primeng/dropdown';
import { models } from '../store/model.selector';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { findModels } from '../store/model.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, filter, switchMap } from 'rxjs';
import { Model } from '../store/model';
import { runTask } from '../store/task.actions';
import { isRunning } from '../store/task.selector';

interface ResolutionItem {
  name: string;
  value: number;
}

@Component({
  selector: 'be-task-run',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, PanelModule, ButtonModule, DropdownModule, BlockUIModule, ProgressSpinnerModule],
  templateUrl: './task-run.component.html',
  styleUrl: './task-run.component.scss'
})
export class TaskRunComponent implements OnInit, OnChanges, AfterViewInit {
  @Input({ required: true }) task: Task | undefined;

  taskId$ = new Subject<string>();
  running$ = this.taskId$.pipe(switchMap(taskId => this.store.select(isRunning(taskId))));

  models$ = this.store.select(models);
  resolutions$ = new Subject<ResolutionItem[]>()

  form = this.fb.group({
    selectedModel: this.fb.control({}, { validators: [Validators.required]}),
    selectedResolution: this.fb.control({}, { validators: [Validators.required]}),
  });

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.models$.pipe(takeUntilDestroyed(), filter(models => !!models?.length)).subscribe(models => this.updateSelectedModel(models[0]));
  }

  ngOnInit(): void {
    this.store.dispatch(findModels());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.previousValue && changes['task'].previousValue.id !== this.task?.id) {
      this.taskId$.next(this.task!.id);
    }
  }

  ngAfterViewInit(): void {
    this.taskId$.next(this.task!.id);
  }

  updateSelectedModel(model: Model) {
    this.form.controls.selectedModel.setValue(model);
    this.updateResolutions(model.resolutions);
  }

  updateResolutions(resolutions: number[]) {
    const resolutionItem = (resolution: number): ResolutionItem => ({
      name: `${resolution}`, value: resolution
    });
    this.resolutions$.next(resolutions.map(resolution => resolutionItem(resolution)));
    this.form.controls.selectedResolution.setValue(resolutionItem(resolutions[0]));
  }

  changeModel(event: { value: Model }) {
    this.updateResolutions(event.value.resolutions);
  }

  runTask() {
    this.store.dispatch(runTask({
      taskId: this.task?.id!,
      modelId: (this.form.value.selectedModel as Model).id,
      resolution: (this.form.value.selectedResolution as ResolutionItem).value
    }));
  }
}
