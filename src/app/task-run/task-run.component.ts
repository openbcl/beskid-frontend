import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Task } from '../store/task';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { Model } from '../store/model';
import { runTask } from '../store/task.actions';
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
export class TaskRunComponent {
  @Input({ required: true }) task!: Task;
  @Input({ required: true }) running!: boolean;
  @Input({ required: true }) models!: Model[];

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
  ) { }

  runTask() {
    this.store.dispatch(runTask({
      taskId: this.task.id,
      modelId: this.form.value.selectedModel!.id
    }));
  }

  onRowSelect(event: { data?: Model }){
    this.form.controls.selectedModel.setValue(event.data!);
  }
}
