import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDecision'
})
export class SortDecisionPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (!a.deciId.localeCompare(b.deciId)) {
        return a.deciId.localeCompare(b.deciId);
      }
      return a.deciId.localeCompare(b.deciId);
    });
    return array;
  }

}
