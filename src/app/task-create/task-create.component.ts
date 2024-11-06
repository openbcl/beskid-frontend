import { Component, OnInit, ViewChild, isDevMode } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { addTask } from '../store/task.actions';
import { CreateTask, TaskTraining } from '../store/task';
import { toastError } from '../store/toast.actions';
import { TaskChartComponent } from "../task-chart/task-chart.component";
import { environment } from '../../environments/environment';
import { FileSizePipe } from '../shared/file-size.pipe';
import { RecreateViewDirective } from '../shared/recreate-view.directive';
import { ExperimentOption, ExperimentConditionOption, experimentOptions, models } from '../store/model.selector';
import { filter, first, map } from 'rxjs';
import { findModels } from '../store/model.actions';
import { Experiment, Model } from '../store/model';
import { breakpoint } from '../store/ui.selector';

@Component({
    selector: 'be-task-create',
    standalone: true,
    imports: [AsyncPipe, FileSizePipe, FormsModule, ReactiveFormsModule, InputSwitchModule, TableModule, InputTextModule, DropdownModule, FileUploadModule, DialogModule, ButtonModule, TooltipModule, PanelModule, TaskChartComponent, RecreateViewDirective, AccordionModule],
    providers: [DecimalPipe],
    templateUrl: './task-create.component.html',
    styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent implements OnInit {
  isDevMode = () => isDevMode() || !environment.production
  numberPattern = /^-?\d+\.?\d*(e[+-]\d+)?$/;

  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  form = this.fb.group({
    values: this.fb.array<FormControl<string>>([], { validators: [Validators.required]}),
    experimentOption: this.fb.control<ExperimentOption | undefined>(undefined, { validators: [Validators.required] }),
    experimentCondition: this.fb.control<ExperimentConditionOption | undefined>({ value: undefined, disabled: true }, { validators: [Validators.required] }),
    experimentResolution: this.fb.control<number | undefined>({ value: undefined, disabled: true }, { validators: [Validators.required] }),
    training: true
  });

  help = () => `You should submit exactly ${this.form.value.experimentResolution} values (numbers), separated either by commas, semicolons, line breaks or spaces.`;

  experimentOptions$ = this.store.select(experimentOptions).pipe(first(eO => !!eO?.length));
  breakpoint$ = this.store.select(breakpoint);
  values$ = this.form.controls.values.valueChanges;

  showUploadDialog = false;

  columns = [
    { header: 'AI-model', width: 'auto' },
    { header: 'Resolution', width: 'auto' },
    { header: 'FDS', width: 'auto' },
    { header: 'Experiment', width: 'auto' },
    { header: 'Condition', width: 'auto' },
    { header: 'Scale', width: 'auto' }
  ];

  rows$ = this.store.select(models).pipe(
    filter(models => !!models.length),
    map(models =>
      models.map(model => model.experiments
        .map(exp => exp.conditions
          .map(condition => {
            const experiment: Experiment & { condition: number } = {
              ...exp,
              condition
            }
            const row: Model & { experiment: Experiment & { condition: number } } = {
              ...model,
              experiment
            }
            return row;
          }).flat()
        ).flat()
      ).flat()
    )
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(findModels());
  }

  onChanges(fc: FormControl, event?: { value: ExperimentConditionOption }) {
    if (event?.value.resolutions.length === 1) {
      fc.setValue(event.value.resolutions[0]);
    } else if (!event?.value || !this.form.value.experimentResolution || !event.value.resolutions.includes(this.form.value.experimentResolution)) {
      fc.setValue(undefined);
      this.form.controls.values.clear();
    }
    if (!this.form.value.experimentCondition?.value) {
      this.form.controls.experimentCondition.enable();
      this.form.controls.experimentResolution.disable();
    } else {
      this.form.controls.experimentResolution.enable();
    }
  }

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
    if (rightValues.length == this.form.value.experimentResolution!) {
      rightValues.forEach(value => this.form.controls.values.push(this.fb.control(value, { validators: [Validators.pattern(this.numberPattern)] })));
    } else if (!!input?.length) {
      const wrongValues = splittedInput.filter(value => !!value?.length && !value.match(this.numberPattern));
      if (rightValues.length + wrongValues.length < this.form.value.experimentResolution!) {
        errors.push(this.help());
      }
      if (!!wrongValues.length) {
        errors.push(`You have submitted ${rightValues.length} correct and ${wrongValues.length} incorrect values.`);
        errors.push(`The following values do not appear to represent numbers: ${wrongValues.join(', ')}`);
      }
    }
    errors.forEach(detail => this.store.dispatch(toastError({ summary: 'Format Error', detail })));
  }

  addRandomValues() {
    const values = [ ...Array(this.form.value.experimentResolution!) ].map(() => (Math.random() * this.form.value.experimentResolution! * [0.25, 1][Math.round(Math.random())])).sort((a, b) => a - b);
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
    const createTask: CreateTask = {
      values: (this.form.value.values as string[]).map(value => Number.parseFloat(value)),
      setting: {
        id: this.form.value.experimentOption!.id,
        resolution: this.form.value.experimentResolution as number,
        condition: this.form.value.experimentCondition!.value as number
      },
      training: this.form.value.training ? TaskTraining.ENABLED : TaskTraining.DISABLED
    };
    this.store.dispatch(addTask({ createTask }));
  }
}
