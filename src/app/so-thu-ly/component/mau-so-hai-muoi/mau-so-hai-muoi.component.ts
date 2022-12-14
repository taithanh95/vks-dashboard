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
        title: 'STT, Ng??y, th??ng n??m th??? l?? (1)',
        width: '5%'
      },
      {
        title: 'Ng?????i y??u c???u b???i th?????ng\n(H??? v?? t??n; ?????a ch???...) (2)',
        width: '10%'
      },
      {
        title: 'Ng?????i b??? thi???t h???i\n(H??? v?? t??n, ?????a ch???...) (3)',
        width: '10%'
      },
      {
        title: 'S???, ng??y, th??ng, n??m c???a Q?? ho???c BA x??c ?????nh b??? oan ph???i b???i th?????ng (4)',
        width: '9%'
      },
      {
        title: 'N???i dung y??u c???u b???i th?????ng\n(Ghi r??, c??? th??? t???ng s??? ti???n) (5)',
        width: '18%'
      },
      {
        title: 'S??? ng??y giam, gi???\n(N???u c??) (6)',
        width: '5%'
      },
      {
        title: 'X??c minh v?? k???t th??c vi???c x??c minh\n(Ng??y th??ng n??m) (7)',
        width: '10%'
      },
      {
        title: 'K???t th??c vi???c th????ng l?????ng\n(Ng??y th??ng n??m) (8)',
        width: '10%'
      },
      {
        title: 'Q?? gi???i quy???t vi???c b???i th?????ng\n(S???; ng??y, th??ng, n??m; N???i dung) (9)',
        width: '10%'
      },
      {
        title: 'B???n ??n gi???i quy???t b???i th?????ng\n(S???; ng??y, th??ng, n??m; N???i dung) (10)',
        width: '10%'
      },
      {
        title: 'S??? ti???n t???m b???i th?????ng (11)',
        width: '10%'
      },
      {
        title: 'C??ng v??n ????? ngh??? c???p kinh ph?? (12)',
        width: '10%'
      },
      {
        title: 'B??? t??i ch??nh c???p kinh ph??\n(S???; ng??y, th??ng, n??m) (13)',
        width: '10%'
      },
      {
        title: 'Ng??y, th??ng, n??m chi tr??? ti???n b???i th?????ng (14)',
        width: '10%'
      },
      {
        title: 'Ng??y, th??ng, n??m ph???c h???i danh d??? (15)',
        width: '10%'
      },
      {
        title: 'S??? ti???n ph???i b???i ho??n (16)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (17)',
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
        this.toastrService.warning('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        this.searchModel.fromDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ng??y th??ng kh??ng h???p l???.');
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
        this.toastrService.warning('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        this.searchModel.toDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ng??y th??ng kh??ng h???p l???.');
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
      this.toastrService.warning('Ch??a nh???p t??? ng??y');
      this.fromDatePicker.open();
      return false;
    }

    if (!this.searchModel.toDate) {
      this.toastrService.warning('Ch??a nh???p ?????n ng??y');
      this.toDatePicker.open();
      return false;
    }

    this.searchModel.fromDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDate);
    this.searchModel.toDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDate);

    if (this.searchModel.fromDate.getTime() > this.searchModel.toDate.getTime()) {
      this.toastrService.warning('T??? ng??y ph???i nh??? h??n ho???c b???ng ?????n ng??y');
      this.fromDatePicker.open();
      return false;
    }

    if (this.searchModel.fromDecisionCompensationDate && this.searchModel.toDecisionCompensationDate) {
      this.searchModel.fromDecisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDecisionCompensationDate);
      this.searchModel.toDecisionCompensationDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDecisionCompensationDate);
      if (this.searchModel.fromDecisionCompensationDate.getTime() > this.searchModel.toDecisionCompensationDate.getTime()) {
        this.toastrService.warning('Ng??y ra Q??/ B???n ??n X?? b??? oan t??? ph???i nh??? h??n ho???c b???ng Ng??y ra Q??/ B???n ??n X?? b??? oan ?????n');
        this.fromDecisionCompensationDatePicker.open();
        return false;
      }
    }

    if (this.searchModel.fromDecisionEnforcementDate && this.searchModel.toDecisionEnforcementDate) {
      this.searchModel.fromDecisionEnforcementDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDecisionEnforcementDate);
      this.searchModel.toDecisionEnforcementDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDecisionEnforcementDate);
      if (this.searchModel.fromDecisionEnforcementDate.getTime() > this.searchModel.toDecisionEnforcementDate.getTime()) {
        this.toastrService.warning('Ng??y Q?? gi???i quy???t b???i th?????ng t??? ph???i nh??? h??n ho???c b???ng Ng??y Q?? gi???i quy???t b???i th?????ng ?????n');
        this.fromDecisionEnforcementDatePicker.open();
        return false;
      }
    }

    if (!this.searchModel.sppId) {
      this.toastrService.warning('Ch??a ch???n ????n v???');
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
          const fileName = 'S???_20_s???_qu???n_l??_vi???c_b???i_th?????ng_trong_t???_t???ng_h??nh_s???_thu???c_tr??ch_nhi???m_c???a_ng??nh_ksnd_' +
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
          const fileName = 'S???_20_s???_qu???n_l??_vi???c_b???i_th?????ng_trong_t???_t???ng_h??nh_s???_thu???c_tr??ch_nhi???m_c???a_ng??nh_ksnd_' +
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
          const fileName = 'S???_20_s???_qu???n_l??_vi???c_b???i_th?????ng_trong_t???_t???ng_h??nh_s???_thu???c_tr??ch_nhi???m_c???a_ng??nh_ksnd_' +
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
      this.toastrService.warning('N???i dung ghi ch?? kh??ng v?????t qu?? 200 k?? t???!');
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
          this.toastrService.success('C???p nh???t ghi ch?? th??nh c??ng!');
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
