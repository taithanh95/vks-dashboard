import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Injectable()
export class ExcelService {
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = {bookType: 'xlsx', type: 'array'};
  isExcelFile: boolean;
  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportExcel(jsonData: any[], fileName: string): void {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = {Sheets: {'data': ws}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }
}
