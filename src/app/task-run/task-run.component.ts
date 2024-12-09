import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { NonNullableFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { Task } from '../store/task';
import { LockableModel, Model } from '../store/model';
import { runTask } from '../store/task.actions';
import { breakpoint } from '../store/ui.selector';
import { RecreateViewDirective } from '../shared/recreate-view.directive';

@Component({
  selector: 'be-task-run',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, PanelModule, MessagesModule, ButtonModule, TableModule, TooltipModule, BlockUIModule, ProgressSpinnerModule, RecreateViewDirective, TagModule],
  templateUrl: './task-run.component.html',
  styleUrl: './task-run.component.scss'
})
export class TaskRunComponent implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Input({ required: true }) running!: boolean;
  @Input({ required: true }) lockableModels!: LockableModel[];

  @ViewChild('beModelTable')
  beModelTable!: Table;

  breakpoint$ = this.store.select(breakpoint);

  form = this.fb.group({
    selectedModels: this.fb.control<Model[]>([], { validators: [Validators.required]}),
  });

  columns = [
    { header: '', width: '1px' },
    { header: 'AI-model', width: 'auto' },
    { header: 'FDS', width: 'auto' },
    { header: 'Description', width: 'auto' },
  ];

  constructor(
    private store: Store,
    private fb: NonNullableFormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.currentValue.id !== changes['task']?.previousValue?.id) {
      const lockableModelIds = (changes['lockableModels'].currentValue as LockableModel[]).map((model) => model.id);
      const selection = [ ...(this.form.value.selectedModels || []).filter(model => !!lockableModelIds.find(id => id === model.id)) ];
      this.form.controls.selectedModels.setValue(selection);
      if (this.beModelTable) {
        this.beModelTable.selection = selection;
      }
    }
  }

  runTask() {
    this.form.value.selectedModels?.forEach(model => {
      this.store.dispatch(runTask({
        taskId: this.task.id,
        modelId: model.id
      }));
    });
    this.beModelTable.selection = [];
    this.form.controls.selectedModels.setValue([]);
  }

  selectRow(model: Model) {
    this.form.controls.selectedModels.setValue([ ...(this.form.value.selectedModels || []), model ])
  }

  unselectRow(model: Model) {
    this.form.controls.selectedModels.setValue((this.form.value.selectedModels || []).filter(selectedModel => selectedModel.id !== model.id))
  }
}
