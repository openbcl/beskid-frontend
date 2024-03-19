import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  constructor(private numberPipe: DecimalPipe) {}

  transform(size: number): string {
    if (size < 1024) {
      return `${size} Byte`;
    }
    if (size < 1048576) {
      return `${this.numberPipe.transform(size / 1024, '1.2-2')} KB`;
    }
    if (size < 1073741824) {
      return `${this.numberPipe.transform(size / 1024 / 1024, '1.2-2')} MB`;
    }
    return `${this.numberPipe.transform(size / 1024 / 1024 / 1024, '1.2-2')} GB`;

  }

}
