import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Task } from '../store/task';
import { DropdownModule } from 'primeng/dropdown';
import { models } from '../store/model.selector';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { findModels } from '../store/model.actions';

@Component({
  selector: 'be-task-run',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, PanelModule, ButtonModule, DropdownModule],
  templateUrl: './task-run.component.html',
  styleUrl: './task-run.component.scss'
})
export class TaskRunComponent implements OnInit {
  @Input({ required: true }) task: Task | undefined;

  models$ = this.store.select(models);

  form = this.fb.group({
    selectedModel: this.fb.control(null, { validators: [Validators.required]}),
    selectedResolution: this.fb.control(null, { validators: [Validators.required]}),
  });

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.store.dispatch(findModels());
  }


}
