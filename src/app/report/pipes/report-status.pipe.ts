import {Pipe, PipeTransform} from '@angular/core';
import {Constant} from '../../common/constant/constant';
import {ValueLabel} from '../../common/model/base.model';

@Pipe({
  name: 'reportStatus'
})
export class ReportStatusPipe implements PipeTransform {
  reportStatus: ValueLabel[] = Constant.LST_REPORT_STATUS;

  transform(value: number, args?: string): string {
    const status = this.reportStatus.find(v => v.value === value);
    if (args && args === 'badge') {
      let badgeClass: string;
      switch (status.value) {
        case 1:
          badgeClass = 'badge badge-secondary';
          break;
        case 2:
          badgeClass = 'badge badge-info';
          break;
        case 3:
          badgeClass = 'badge badge-success';
          break;
        case 4:
          badgeClass = 'badge badge-danger';
          break;
        default:
          badgeClass = 'badge badge-secondary';
      }
      return badgeClass;
    } else {
      return status.label;
    }
  }

}
