import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numbersToStrings',
  standalone: true
})
export class NumbersToStringsPipe implements PipeTransform {

  transform(values: number[]): string[] {
    return values.map(value => value.toExponential(18));
  }

}
