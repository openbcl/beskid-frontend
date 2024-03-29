import { Component, ViewChild, isDevMode } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { addTask } from '../store/task.actions';
import { TaskTraining } from '../store/task';
import { toastError } from '../store/toast.actions';
import { TaskChartComponent } from "../task-chart/task-chart.component";
import { environment } from '../../environments/environment';
import { FileSizePipe } from '../shared/file-size.pipe';

@Component({
    selector: 'be-task-create',
    standalone: true,
    imports: [AsyncPipe, FileSizePipe, FormsModule, ReactiveFormsModule, InputSwitchModule, TableModule, InputTextModule, FileUploadModule, DialogModule, ButtonModule, TooltipModule, PanelModule, TaskChartComponent],
    providers: [DecimalPipe],
    templateUrl: './task-create.component.html',
    styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent {
  isDevMode = () => isDevMode() || !environment.production
  numberPattern = /^-?\d+\.?\d*(e[+-]\d+)?$/;
  help = 'You should submit exactly 100 values (numbers), separated either by commas, semicolons, line breaks or spaces.';

  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  form = this.fb.group({
    values: this.fb.array<FormControl<string>>([], { validators: [Validators.required]}),
    training: false
  });

  values$ = this.form.controls.values.valueChanges;

  showUploadDialog = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store
  ) { }

  async pasteFromClipboard() {
    const clipboard = await navigator.clipboard.readText();
    if (clipboard) {
      this.updateValues(clipboard);
    } else {
      this.store.dispatch(toastError({ summary: 'Browser Error', detail: 'Can not access clipboard.' }));
    }
  }

  updateValues(input: string) {
    const errors = [];
    const splittedInput = input.replace(/\r\n|\s|;/g, ',').split(',');
    const rightValues = splittedInput.filter(value => !!value && value.match(this.numberPattern));
    this.form.controls.values.clear();
    if (rightValues.length == 100) {
      rightValues.forEach(value => this.form.controls.values.push(this.fb.control(value, { validators: [Validators.pattern(this.numberPattern)] })));
    } else if (!!input?.length) {
      const wrongValues = splittedInput.filter(value => !!value?.length && !value.match(this.numberPattern));
      if (rightValues.length + wrongValues.length < 100) {
        errors.push(this.help);
      }
      if (!!wrongValues.length) {
        errors.push(`You have submitted ${rightValues.length} correct and ${wrongValues.length} incorrect values.`);
        errors.push(`The following values do not appear to represent numbers: ${wrongValues.join(', ')}`);
      }
    }
    errors.forEach(detail => this.store.dispatch(toastError({ summary: 'Format Error', detail })));
  }

  addRandomValues() {
    const values = [ ...Array(100) ].map(() => (Math.random() * 100 * [0.25, 1][Math.round(Math.random())])).sort((a, b) => a - b);
    const valuesUp = values.filter((_, i) => i % 4);
    const valuesDown = values.filter((_, i) => !(i % 4)).reverse();
    this.updateValues(valuesUp.concat(valuesDown).map(value => value.toExponential(18)).join(','));
  }

  async uploadFile(event: { files: File[] }) {
    if (event.files?.length === 1) {
      const buffer = await event.files[0].arrayBuffer();
      const textDecoder = new TextDecoder();
      this.updateValues(textDecoder.decode(buffer));
      this.fileUpload.clear();
      this.showUploadDialog = false;
    }
  }

  removeFile(file: File ) {
    this.fileUpload.files = this.fileUpload.files.filter(value => value.name !== file.name);
  }

  addTask() {
    const createTask = {
      values: (this.form.value.values as string[]).map(value => Number.parseFloat(value)),
      training: this.form.value.training ? TaskTraining.ENABLED : TaskTraining.DISABLED
    };
    this.store.dispatch(addTask({ createTask }));
  }
}
