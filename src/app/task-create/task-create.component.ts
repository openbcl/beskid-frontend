import { Component } from '@angular/core';
import { isDevMode } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { addTask } from '../store/task.actions';
import { TaskTraining } from '../store/task';
import { toastError } from '../store/toast.actions';

@Component({
  selector: 'be-task-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputSwitchModule, TableModule, InputTextModule, ButtonModule, TooltipModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent {
  isDevMode = isDevMode;
  numberPattern = /^-?\d+\.?\d*(e[+-]\d+)?$/;
  help = 'You should submit exactly 100 values (numbers), separated either by commas, semicolons, line breaks or spaces.';

  form = this.fb.group({
    values: this.fb.array<string>([], { validators: [Validators.required]}),
    training: false
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) { }

  async pasteFromClipboard() {
    const clipboard = await navigator.clipboard.readText();
    if (clipboard) {
      this.updateValues(clipboard)
    } else {
      this.store.dispatch(toastError({ summary: 'Browser Error', detail: 'Can not access clipboard.' }))
    }
  }

  updateValues(input: string) {
    const values = input.replace(/\r\n|\s|;/g, ',').split(',').filter(value => !!value && value.match(this.numberPattern)).map(value => 
      this.fb.control(value, { validators: [Validators.pattern(this.numberPattern)] })
    );
    this.form.controls.values.clear();
    if (values.length == 100) {
      values.forEach(value => this.form.controls.values.push(value));
    } else if (!!input?.length) {
      const wrongValues = input.replace(/\r\n|\s|;/g, ',').split(',').filter(value => !!value?.length && !value.match(this.numberPattern));
      const errors = [];
      if (values.length + wrongValues.length < 100) {
        errors.push(this.help);
      }
      if (!!wrongValues.length) {
        errors.push(`You have submitted ${values.length} correct and ${wrongValues.length} incorrect values.`);
        errors.push(`The following values do not appear to represent numbers: ${wrongValues.join(', ')}`);
      }
      errors.forEach(detail => this.store.dispatch(toastError({ summary: 'Format Error', detail })));
    }
  }

  addRandomValues() {
    this.updateValues([ ...Array(100) ].map(() => (Math.random() * 100).toExponential(18)).join(','))
  }

  addTask() {
    const createTask = {
      values: (this.form.value.values as string[]).map(value => Number.parseFloat(value)),
      training: this.form.value.training ? TaskTraining.ENABLED : TaskTraining.DISABLED
    };
    this.store.dispatch(addTask({ createTask }))
  }
}
