import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import * as XLSX from 'xlsx';
import {Response} from '../../../common/model/base.model';
import {Area} from '../../model/category.model';

declare var $: any;
type AOA = any[][];

@Component({
  selector: 'app-import-area',
  templateUrl: './import-area.component.html',
  styleUrls: ['./import-area.component.css']
})
export class ImportAreaComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  listData: Area[];
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = {bookType: 'xlsx', type: 'array'};
  fileName: string = 'SheetJS.xlsx';
  isExcelFile: boolean;

  totalError: number = 0;
  totalSuccess: number = 0;
  inProgress: boolean = false;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<Area>();
  }

  ngOnInit(): void {
  }

  public onPageChange(event) {
    this.currentPage = event;
    this.recordTo = (this.currentPage * 10) - (10 - this.listData.length);
    this.recordFrom = this.currentPage - 1;
  }

  onClick(ev) {
    ev.target.value = null;
    this.listData = new Array<Area>();
  }

  onFileChange(evt: any) {
    this.listData = new Array<Area>();
    /* check file is excel */
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.toLowerCase().match(/(.xls|.xlsx)/);
    if (!this.isExcelFile) {
      this.toastrService.success( 'File kh??ng ????ng ?????nh d???ng xls/xlsx c???a Excel');
      return;
    }
    /* wire up file reader */
    if (target.files.length !== 1) {
      this.toastrService.success( 'Kh??ng th??? x??? l?? nhi???u file');
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {range: 0}));
      this.data.forEach(x => {
        const obj = <Area>{
          provinceName: x['T???nh Th??nh Ph???'],
          provinceCode: x['M?? TP'],
          districtName: x['Qu???n Huy???n'],
          districtCode: x['M?? QH'],
          communeName: x['Ph?????ng X??'],
          communeCode: x['M?? PX']
        };
        this.listData.push(obj);
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async importData() {
    this.inProgress = true;
    this.totalSuccess = 0;
    this.totalError = 0;
    if (this.listData.length === 0) {
      this.toastrService.success( 'Kh??ng c?? b???n ghi n??o c???n nh???p l??n h??? th???ng. Vui l??ng nh???p file XML d??? li???u h??a ????n');
      this.inProgress = false;
      return;
    }
    for (const data of this.listData) {
      const response = <Response>(await this.importArea(data));
      data.responseCode = response.responseCode;
      data.responseMessage = response.responseMessage;
      if (response.responseCode === '0000') {
        this.totalSuccess += 1;
      } else {
        this.totalError += 1;
      }
    }
    this.inProgress = false;
    this.toastrService.success(
      'T???ng s??? b???n ghi th???c hi???n nh???p ' + this.listData.length + '. Th??nh c??ng ' + this.totalSuccess + ' v?? l???i ' + this.totalError + ' b???n ghi.');
  }

  importArea(area: Area) {
    return new Promise((resolve, reject) => {
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/importArea/'
        , area).toPromise()
        .then(res => res.json())
        .then(resJson => {
          const response = {
            responseCode: resJson.responseCode,
            responseMessage: resJson.responseMessage
          };
          resolve(response);
        })
        .catch(err => {
          const response = {
            responseCode: '9999',
            responseMessage: 'L???i khi th???c hi???n, ' + err
          };
          resolve(response);
        });
    });
  }
}
