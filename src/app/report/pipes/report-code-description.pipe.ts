import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'reportCodeDescription'
})
export class ReportCodeDescriptionPipe implements PipeTransform {

  transform(value: string): string {
    let description: string;
    switch (value) {
      case '01':
        description = 'Biểu 01/2019 - Thống kê thực hành quyền công tố, kiểm sát viêc tiếp nhận, giải quyết tố giác, tin báo về tội phạm, kiến nghị khởi tố';
        break;
      case '07':
        description = 'Biểu 07/2019 - Thống kê kiểm sát việc giam giữ, tạm giam và thi hành án hình sự\n';
        break;
      case '08':
        description = 'Biểu 08/2019 - Thống kê giải quyết tố giác, tin báo tội phạm, kiến nghị khởi tố của cơ quan điều tra viện kiểm sát nhân dân';
        break;
      case '09':
        description = 'Biểu 09/2019 - Thống kê kết quả điều tra các vụ án hình sự của cơ quan điều tra viện kiểm sát nhân dân';
        break;
      case '33':
        description = 'Biểu 33/2019 - Thống kê vi phạm pháp luật trong hoạt động tư pháp';
        break;
      default:
        description = null;
    }
    return description;
  }

}
