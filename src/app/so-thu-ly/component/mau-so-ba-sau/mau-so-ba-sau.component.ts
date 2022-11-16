import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {DateService} from '../../../common/util/date.service';
import {Book36, Book36Search, ColsTable} from '../../model/so-thu-ly.model';
import {Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';

@Component({
  selector: 'app-mau-so-ba-sau',
  templateUrl: './mau-so-ba-sau.component.html',
  providers: [DatePipe]
})
export class MauSoBaSauComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  searchModel: Book36Search = {
    unitId: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate(),
    fromDateVB: null,
    toDateVB: null,
    fromDateVBXL: null,
    toDateVBXL: null
  };
  inProgress: boolean = false;
  colsTable: ColsTable[];
  copyListOfData: Book36[];
  responseData: Book36[];
  listReport: Book36[] = [];
  listSpp: Spp[] = [];
  isLoading = false;
  btnDisable: boolean;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;

  constructor(
    private constantService: ConstantService,
    private dateService: DateService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '5%'
      },
      {
        title: 'Ngày tiếp nhận (2)',
        width: '10%'
      },
      {
        title: 'Cơ quan thực hiện (3)',
        width: '10%'
      },
      {
        title: 'Số văn bản (4)',
        width: '10%'
      },
      {
        title: 'Ngày văn bản (5)',
        width: '10%'
      },
      {
        title: 'Tên yêu cầu (6)',
        width: '10%'
      },
      {
        title: 'Kết quả tương trợ (7)',
        width: '10%'
      },
      {
        title: 'Số văn bản (8)',
        width: '10%'
      },
      {
        title: 'Ngày văn bản (9)',
        width: '10%'
      },
      {
        title: 'Cơ quan nhận (10)',
        width: '10%'
      },
      {
        title: 'Cán bộ thụ lý (11)',
        width: '10%'
      },
      {
        title: 'Ghi chú (12)',
        width: '10%'
      }
    ];
  }

  public checkValidate() {
    if (!this.searchModel.fromDate) {
      this.toastrService.success('Chưa nhập từ ngày');
      return false;
    }
    if (!this.searchModel.toDate) {
      this.toastrService.success('Chưa nhập đến ngày');
      return false;
    }
    // const fromDate: NgbDateStruct = this.customDateParserFormatter.parse(this.searchModel.fromDate);
    // const toDate: NgbDateStruct = this.customDateParserFormatter.parse(this.searchModel.toDate);
    //
    // if (this.customDateParserFormatter.ngbDateStructToDate(fromDate) > this.customDateParserFormatter.ngbDateStructToDate(toDate)) {
    //   this.toastrService.success( 'Từ ngày phải nhỏ hơn đến ngày');
    //   return false;
    // }
    // if (moment(this.customDateParserFormatter.formatToString(fromDate), 'DD/MM/YYYY', true).isValid() === false) {
    //   this.searchModel.fromDate = null;
    //   this.toastrService.success( 'Yêu cầu nhập đúng định dạng ngày, tháng, năm dd/mm/yyyy');
    //   return false;
    // }
    // if (moment(this.customDateParserFormatter.formatToString(toDate), 'DD/MM/YYYY', true).isValid() === false) {
    //   this.searchModel.toDate = null;
    //   this.toastrService.success( 'Yêu cầu nhập đúng định dạng ngày, tháng, năm dd/mm/yyyy');
    //   return false;
    // }
    if (!this.searchModel.unitId) {
      this.toastrService.warning('Chưa chọn đơn vị');
      this.sppIdSelect.onHostClick();
      return false;
    }
  }

  public onSearch() {
    if (this.checkValidate() === false) {
      return;
    }
    this.getListData();
  }

  getListData() {
    if (this.checkValidate() === false) {
      return;
    }

    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book36/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'unitId': this.searchModel.unitId,
        'damageId': this.searchModel.damageId,
        'damageName': this.searchModel.damageName
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listReport = resJson.responseData;
          this.responseData = resJson.responseData;
          this.totalRecords = this.listReport.length;
          this.listReport.length ? this.btnDisable = true : this.btnDisable = false;
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.inProgress = false;
      });
  }


  public onPageChange(event) {
    this.currentPage = event;
    this.recordTo = (this.currentPage * this.pageSize) - (this.pageSize - this.listReport.length);
    this.recordFrom = this.currentPage - 1;
  }

  numberKeyEvent(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }
  }

  exportPdf(): void {
    if (this.checkValidate() === false) {
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book36/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'SỔ_36_SỔ_GIẢI_QUYẾT_TƯƠNG_TRỢ_TƯ_PHÁP_VỀ_HÌNH_SỰ_CỦA_NƯỚC_NGOÀI_' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.inProgress = false;
      });
  }

  exportExcel(): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book36/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'SỔ_36_SỔ_GIẢI_QUYẾT_TƯƠNG_TRỢ_TƯ_PHÁP_VỀ_HÌNH_SỰ_CỦA_NƯỚC_NGOÀI_' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.inProgress = false;
      });
  }

  exportDocx(): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book36/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'SỔ_36_SỔ_GIẢI_QUYẾT_TƯƠNG_TRỢ_TƯ_PHÁP_VỀ_HÌNH_SỰ_CỦA_NƯỚC_NGOÀI_' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.inProgress = false;
      });
  }

  onResize({width}: NzResizeEvent, col: string): void {
    this.colsTable = this.colsTable.map(e => (e.title === col ? {...e, width: `${width}px`} : e));
  }

  addFocusInput() {
    document.getElementById('fromDate').focus();
  }

  copyData(): Book36[] {
    return this.copyListOfData = this.responseData;
  }

// ham tim kiem du lieu
  search(search) {
    const targetValue: any[] = [];
    this.copyData().forEach((value: any) => {
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search.toLowerCase())) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.onPageChange(1);
    this.listReport = targetValue;
    this.totalRecords = this.listReport.length;
    if (targetValue.length === 0) {
      this.toastrService.success('Không tìm thấy dữ liệu cần tra cứu');
    }
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onFromDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
        this.searchModel.fromDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ngày tháng không hợp lệ.');
        this.searchModel.fromDate = null;
        return;
      } else {
        this.searchModel.fromDate = date;
      }
    }
  }

  onToDateValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
        this.searchModel.toDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ngày tháng không hợp lệ.');
        this.searchModel.toDate = null;
        return;
      } else {
        this.searchModel.toDate = date;
      }
    }
  }

  onFromDateVBValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
        this.searchModel.fromDateVB = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ngày tháng không hợp lệ.');
        this.searchModel.fromDateVB = null;
        return;
      } else {
        this.searchModel.fromDateVB = date;
      }
    }
  }

  onToDateVBValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
        this.searchModel.toDateVB = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ngày tháng không hợp lệ.');
        this.searchModel.toDateVB = null;
        return;
      } else {
        this.searchModel.toDateVB = date;
      }
    }
  }

  onFromDateVBXLValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
        this.searchModel.fromDateVBXL = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ngày tháng không hợp lệ.');
        this.searchModel.fromDateVBXL = null;
        return;
      } else {
        this.searchModel.fromDateVBXL = date;
      }
    }
  }

  onToDateVBXLValueChange(event: any): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
        this.searchModel.toDateVBXL = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ngày tháng không hợp lệ.');
        this.searchModel.toDateVBXL = null;
        return;
      } else {
        this.searchModel.toDateVBXL = date;
      }
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
