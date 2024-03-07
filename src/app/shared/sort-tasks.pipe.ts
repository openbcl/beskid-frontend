import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../store/task';

@Pipe({
  name: 'sortTasks',
  standalone: true
})
export class SortTasksPipe implements PipeTransform {

  transform(tasks: Task[] | null, sort: 'asc'|'desc'): Task[] {
    return tasks === null ? [] : [ ...tasks ].sort((a, b) => sort === 'asc' ? +Date.parse(a.date.toString()) - +Date.parse(b.date.toString()) : +Date.parse(b.date.toString()) - +Date.parse(a.date.toString()));
  }

}
