import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, filter, map, switchMap, take, tap } from 'rxjs';
import { BlobFile, KeepTrainingData, Task, TaskResult, TaskResultEvaluation } from '../store/task';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { deleteTaskResult, evaluateTaskResult, findTaskResult, findTaskResultTemplateData, findTaskResultTemplateFile } from '../store/task.actions';
import { resultFile, selectedTask, templateFile } from '../store/task.selector';
import { breakpoint } from '../store/ui.selector';
import { RecreateViewDirective } from '../shared/recreate-view.directive';
import { filterNullish } from '../shared/rx.filter';
import { models } from '../store/model.selector';

@Component({
  selector: 'be-task-results',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, DatePipe, ButtonModule, TabViewModule, MenuModule, InputSwitchModule, PanelModule, TableModule, SelectButtonModule, DialogModule, ProgressSpinnerModule, TooltipModule, RecreateViewDirective, TagModule],
  templateUrl: './task-results.component.html',
  styleUrl: './task-results.component.scss'
})
export class TaskResultsComponent {

  task$ = this.store.select(selectedTask).pipe(filterNullish());
  breakpoint$ = this.store.select(breakpoint);

  evaluationOptions = [
    { icon: 'far fa-face-frown', evaluation: TaskResultEvaluation.NEGATIVE },
    { icon: 'far fa-face-meh', evaluation: TaskResultEvaluation.NEUTRAL },
    { icon: 'far fa-face-smile-beam', evaluation: TaskResultEvaluation.POSITIVE },
  ];

  showResultDialog = false;

  columns = [
    { header: 'AI-model', width: 'auto' },
    { header: 'FDS', width: 'auto' },
    { header: 'Date', width: 'auto' },
    { header: 'Evaluation (Training)', width: '14rem' },
    { header: '', width: '10rem' }
  ];

  models$ = this.store.select(models).pipe(filterNullish());

  rows$ = combineLatest([this.task$, this.models$]).pipe(
    map(combinedArray => ({task: combinedArray[0], models: combinedArray[1]})),
    map(combined => combined.task.results?.map(result => {
      const model = combined.models.find(model => model.id === result.model.id);
      return {
        form: this.fb.group({
          evaluation: this.fb.control(this.evaluationOptions.find(option => option.evaluation === result.evaluation), { validators: [Validators.required]})
        }),
        ...result,
        downloadTemplateItems: !!model?.templates.length ? [{
          label: 'Available FDS templates',
          items: model.templates.map(template => {
            const experiment = model.experiments.find(exp => exp.id === template.experimentId);
            return !!experiment ? {
              icon: 'fas fa-file-code',
              label: `${experiment.name}: ${template.condition} ${experiment.conditionMU}`,
              command: () => this.downloadTemplate(result, combined.task, template.experimentId, template.condition)
            } : undefined
          }).filter(item => !!item)
        }] : undefined
      }
    }) || []
  ));

  selectedResult$ = new BehaviorSubject<TaskResult & { taskId: string }>(null!);
  
  taskResult$ = this.selectedResult$.pipe(
    filterNullish(),
    switchMap(selectedResult =>
      this.task$.pipe(
        map(task => task.results.find(result => result.filename === selectedResult.filename)),
        tap(taskResult => !!taskResult && !taskResult.dataResult && this.store.dispatch(findTaskResult({
          taskId: selectedResult.taskId,
          fileId: selectedResult.filename.split('.json')[0]
        }))),
        filterNullish(),
        map(taskResult => taskResult.dataResult)
      )
    )
  );

  templates$ = combineLatest([this.task$, this.selectedResult$.pipe(filterNullish()), this.models$]).pipe(
    map(combinedArray => ({task: combinedArray[0], selectedResult: combinedArray[1], models: combinedArray[2]})),
    map(combined => {
      const taskResult = combined.task.results.find(result => result.filename === combined.selectedResult.filename);
      if (!taskResult) {
        return undefined;
      }
      const model = combined.models.find(model => model.id === taskResult.model.id);
      if (!model) {
        return undefined;
      }
      const templates = taskResult.templates || [];
      const template = model.templates.find(modelTemplate => 
        !templates.find(resultTemplate => 
          modelTemplate.experimentId == resultTemplate.experimentId && modelTemplate.condition === resultTemplate.condition && !!resultTemplate.data
        )
      );
      if (!!template) {
        this.store.dispatch(findTaskResultTemplateData({
          taskId: combined.selectedResult.taskId,
          fileId: combined.selectedResult.filename,
          ...template
        }))
      }
      const dataTemplates = templates.filter(template => !!template.data).map(template => ({ ...template, data: template.data!.split(/\r?\n/) }));
      return model.templates.map(modelTemplate =>
        dataTemplates.find(dataTemplate => dataTemplate.experimentId === modelTemplate.experimentId && dataTemplate.condition === modelTemplate.condition) || {
          ...modelTemplate,
          data: ''
        }
      );
    }),
    filterNullish()
  );

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) { }

  onSelectResult(event: { data?: TaskResult, originalEvent?: { target: any } }, taskId: string) {
    if (!(event.originalEvent?.target?.classList as DOMTokenList)?.contains('p-button')) {
      event.data && this.selectedResult$.next({ ...event.data, taskId });
      this.showResultDialog = true;
    }
  }

  evaluateTaskResult(event: { value?: { evaluation: TaskResultEvaluation } }, task: Task, fileId: string) {
    this.store.dispatch(evaluateTaskResult({
      taskId: task.id,
      fileId,
      evaluation: event.value!.evaluation
    }));
  }

  deleteTaskResult(result: TaskResult, task: Task) {
    const dispatchDeleteTaskResult = (keepTrainingData = true) => {
      this.store.dispatch(deleteTaskResult({
        taskId: task.id,
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
  
  download(blobFile: BlobFile) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blobFile.blob);
    link.download = blobFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadResult(result: TaskResult, task: Task) {
    if (result.fileResult) {
      this.download(result.fileResult);
    } else {
      this.store.select(resultFile(task.id, result.filename)).pipe(filter(blobFile => !!blobFile), take(1)).subscribe(blobFile => this.download(blobFile!));
      this.store.dispatch(findTaskResult({
        taskId: task.id,
        fileId: result.filename
      }));
    }
  }

  downloadTemplate(result: TaskResult, task: Task, experimentId: string, condition: number) {
    const file = result.templates?.find(template => template.experimentId === experimentId && template.condition === condition)?.file;
    if (file) {
      this.download(file);
    } else {
      this.store.select(templateFile(task.id, result.filename, experimentId, condition)).pipe(filter(blobFile => !!blobFile), take(1)).subscribe(blobFile => this.download(blobFile!));
      this.store.dispatch(findTaskResultTemplateFile({
        taskId: task.id,
        fileId: result.filename,
        experimentId,
        condition
      }));
    }
  }

  showEvaluationHelpDialog() {
    this.confirmationService.confirm({
      header: 'Share input and result data with us',
      icon: 'fas fa-robot',
      acceptButtonStyleClass: 'p-button-info',
      message: `Optionally, you can evaluate the results of this task to improve the AI algorithm.
        Negative and positive evaluated results and their corresponding input data will be shared with us.
        This allows us to further train and improve the AI model through machine learning.
        By setting the neutral rating again, the data previously shared with us will be deleted.`,
      acceptLabel: 'Ok',
      rejectVisible: false,
    });
  }
}

