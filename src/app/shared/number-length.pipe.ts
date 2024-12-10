import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberLength',
  standalone: true
})
export class NumberLengthPipe implements PipeTransform {

  transform(value: number | undefined, add = 0): number {
    return value !== undefined ? Math.floor(Math.log10(value)) + 1 + add : 0;
  }

}