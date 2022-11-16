import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Book19, Book20, Book20Search, ColsTable} from '../../model/so-thu-ly.model';
import {Spp} from '../../../category/model/category.model';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import * as moment from 'moment';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-hai-muoi',
  templateUrl: './mau-so-hai-muoi.component.html',
  styleUrls: ['./mau-so-hai-muoi.component.css'],
  providers: [
    DatePipe
  ]
})
export class MauSoHaiMuoiComponent implements OnInit {

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  searchModel: Book20Search = {
    sppId: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  inProgress: boolean = false;
  colsTable: ColsTable[];
  listReport: Book20[] = [];
  listSpp: Spp[] = [];
  isLoading = false;
  isActive: boolean;
  editId: number;
  btnDisable: boolean;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('fromDecisionCompensationDatePicker') fromDecisionCompensationDatePicker!: NzDatePickerComponent;
  @ViewChild('fromDecisionEnforcementDatePicker') fromDecisionEnforcementDatePicker!: NzDatePickerComponent;
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
    this.searchModel.sppId = this.listSpp[0].sppId;
    this.colsTable = [
      {
        title: 'STT, Ngày, tháng năm thụ lý (1)',
        width: '5%'
      },
      {
        title: 'Người yêu cầu bồi thường\n(Họ và tên; Địa chỉ...) (2)',
        width: '10%'
      },
      {
        title: 'Người bị thiệt hại\n(Họ và tên, địa chỉ...) (3)',
        width: '10%'
      },
      {
        title: 'Số, ngày, tháng, năm của QĐ hoặc BA xác định bị oan phải bồi thường (4)',
        width: '9%'
      },
      {
        title: 'Nội dung yêu cầu bồi thường\n(Ghi rõ, cụ thể từng số tiền) (5)',
        width: '18%'
      },
      {
        title: 'Số ngày giam, giữ\n(Nếu có) (6)',
        width: '5%'
      },
      {
        title: 'Xác minh và kết thúc việc xác minh\n(Ngày tháng năm) (7)',
        width: '10%'
      },
      {
        title: 'Kết thúc việc thương lượng\n(Ngày tháng năm) (8)',
        width: '10%'
      },
      {
        title: 'QĐ giải quyết việc bồi thường\n(Số; ngày, tháng, năm; Nội dung) (9)',
        width: '10%'
      },
      {
        title: 'Bản án giải quyết bồi thường\n(Số; ngày, tháng, năm; Nội dung) (10)',
        width: '10%'
      },
      {
        title: 'Số tiền tạm bồi thường (11)',
        width: '10%'
      },
      {
        title: 'Công văn đề nghị cấp kinh phí (12)',
        width: '10%'
      },
      {
        title: 'Bộ tài chính cấp kinh phí\n(Số; ngày, tháng, năm) (13)',
        width: '10%'
      },
      {
        title: 'Ngày, tháng, năm chi trả tiền bồi thường (14)',
        width: '10%'
      },
      {
        title: 'Ngày, tháng, năm phục hồi danh dự (15)',
        width: '10%'
      },
      {
        title: 'Số tiền phải bồi hoàn (16)',
        width: '10%'
      },
      {
        title: 'Ghi chú (17)',
        width: '8%'
      }
    ];
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  disabledFromDate(startValue: Date): boolean {
    if (!startValue || !this.searchModel.toDate) {
      return false;
    }
    return startValue.getTime() > this.searchModel.toDate.getTime();
  }

  disabledToDate(endValue: Date): boolean {
    if (!endValue || !this.searchModel.fromDate) {
      return false;
    }
    const startDate: number = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDate).getTime();
    const endDate: number = this.convertTimeToBeginningOfTheDay(endValue).getTime();
    return endDate < startDate;
  }

  convertTimeToBeginningOfTheDay(date: Date): Date {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  checkValidate(): boolean {
    if (!this.searchModel.fromDate) {
      this.toastrService.warning('Chưa nhập từ ngày');
      this.fromDatePicker.open();
      return false;
    }

    if (!this.searchModel.toDate) {
      this.toastrService.warning('Chưa nhập đến ngày');
      this.toDatePicker.open();
      return false;
    }

    this.searchModel.fromDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDate);
    this.searchModel.toDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDate);

    if (this.searchModel.fromDate.getTime() > this.searchModel.toDate.getTime()) {
      this.toastrService.warning('Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
      this.fromDatePicker.open();
      return false;
    }

    if (this.searchModel.fromDecisionCompensationDate && this.searchModel.toDecisionCompensationDate) {
      this.searchModel.fromDecisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDecisionCompensationDate);
      this.searchModel.toDecisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDecisionCompensationDate);
      if (this.searchModel.fromDecisionCompensationDate.getTime() > this.searchModel.toDecisionCompensationDate.getTime()) {
        this.toastrService.warning('Ngày ra QĐ/ Bản án XĐ bị oan từ phải nhỏ hơn hoặc bằng Ngày ra QĐ/ Bản án XĐ bị oan đến');
        this.fromDecisionCompensationDatePicker.open();
        return false;
      }
    }

    if (this.searchModel.fromDecisionEnforcementDate && this.searchModel.toDecisionEnforcementDate) {
      this.searchModel.fromDecisionEnforcementDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDecisionEnforcementDate);
      this.searchModel.toDecisionEnforcementDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDecisionEnforcementDate);
      if (this.searchModel.fromDecisionEnforcementDate.getTime() > this.searchModel.toDecisionEnforcementDate.getTime()) {
        this.toastrService.warning('Ngày QĐ giải quyết bồi thường từ phải nhỏ hơn hoặc bằng Ngày QĐ giải quyết bồi thường đến');
        this.fromDecisionEnforcementDatePicker.open();
        return false;
      }
    }

    if (!this.searchModel.sppId) {
      this.toastrService.warning('Chưa chọn đơn vị');
      this.sppIdSelect.onHostClick();
      return false;
    }
    return true;
  }

  getListData(request: Book20Search) {
    if (this.checkValidate() === false) {
      return;
    }

    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book20/requestReport/'
      , {
        ...request,
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'fromDecisionCompensationDate': this.datePipe.transform(this.searchModel.fromDecisionCompensationDate, 'dd/MM/yyyy'),
        'toDecisionCompensationDate': this.datePipe.transform(this.searchModel.toDecisionCompensationDate, 'dd/MM/yyyy'),
        'fromDecisionEnforcementDate': this.datePipe.transform(this.searchModel.fromDecisionEnforcementDate, 'dd/MM/yyyy'),
        'toDecisionEnforcementDate': this.datePipe.transform(this.searchModel.toDecisionEnforcementDate, 'dd/MM/yyyy'),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listReport = resJson.responseData;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.recordTo = (this.currentPage * this.pageSize) - (this.pageSize - this.listReport.length);
    this.recordFrom = this.currentPage - 1;
  }

  numberKeyEvent(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }
  }

  exportPdf(request: Book20Search): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book20/requestReportPdf/'
      , {
        ...request,
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'fromDecisionCompensationDate': this.datePipe.transform(this.searchModel.fromDecisionCompensationDate, 'dd/MM/yyyy'),
        'toDecisionCompensationDate': this.datePipe.transform(this.searchModel.toDecisionCompensationDate, 'dd/MM/yyyy'),
        'fromDecisionEnforcementDate': this.datePipe.transform(this.searchModel.fromDecisionEnforcementDate, 'dd/MM/yyyy'),
        'toDecisionEnforcementDate': this.datePipe.transform(this.searchModel.toDecisionEnforcementDate, 'dd/MM/yyyy'),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_20_sổ_quản_lý_việc_bồi_thường_trong_tố_tụng_hình_sự_thuộc_trách_nhiệm_của_ngành_ksnd_' +
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

  exportExcel(request: Book20Search): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book20/requestReportExcel/'
      , {
        ...request,
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'fromDecisionCompensationDate': this.datePipe.transform(this.searchModel.fromDecisionCompensationDate, 'dd/MM/yyyy'),
        'toDecisionCompensationDate': this.datePipe.transform(this.searchModel.toDecisionCompensationDate, 'dd/MM/yyyy'),
        'fromDecisionEnforcementDate': this.datePipe.transform(this.searchModel.fromDecisionEnforcementDate, 'dd/MM/yyyy'),
        'toDecisionEnforcementDate': this.datePipe.transform(this.searchModel.toDecisionEnforcementDate, 'dd/MM/yyyy'),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_20_sổ_quản_lý_việc_bồi_thường_trong_tố_tụng_hình_sự_thuộc_trách_nhiệm_của_ngành_ksnd_' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
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

  exportDocx(request: Book20Search): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book20/requestReportDocx/'
      , {
        ...request,
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'fromDecisionCompensationDate': this.datePipe.transform(this.searchModel.fromDecisionCompensationDate, 'dd/MM/yyyy'),
        'toDecisionCompensationDate': this.datePipe.transform(this.searchModel.toDecisionCompensationDate, 'dd/MM/yyyy'),
        'fromDecisionEnforcementDate': this.datePipe.transform(this.searchModel.fromDecisionEnforcementDate, 'dd/MM/yyyy'),
        'toDecisionEnforcementDate': this.datePipe.transform(this.searchModel.toDecisionEnforcementDate, 'dd/MM/yyyy'),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_20_sổ_quản_lý_việc_bồi_thường_trong_tố_tụng_hình_sự_thuộc_trách_nhiệm_của_ngành_ksnd_' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(item: Book20): void {
    this.editId = null;
    item.s_ghi_chu = WebUtilRemoveFisrtSpace.onHandle(item.s_ghi_chu);
    if (item.s_ghi_chu && item.s_ghi_chu.length > 200) {
      this.toastrService.warning('Nội dung ghi chú không vượt quá 200 ký tự!');
      item.s_ghi_chu = null;
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'notebook/createOrUpdate/'
      , {
        'compensationId': item.n_compensation_id,
        'bookCode': '20',
        'note': item.s_ghi_chu
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.toastrService.success('Cập nhật ghi chú thành công!');
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
}
