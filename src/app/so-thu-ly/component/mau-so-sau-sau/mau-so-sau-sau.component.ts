import {Component, OnInit, ViewChild} from '@angular/core';
import {
  Book66,
  Book66Search,
  ColsTable,
  LstArmy,
  LstBorderGuards,
  LstCustoms,
  LstPolice,
  LstRanger,
  LstSPC
} from '../../model/so-thu-ly.model';
import {Code, Pol, Spp} from '../../../category/model/category.model';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-sau-sau',
  templateUrl: './mau-so-sau-sau.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoSauSauComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  rowIndexPolice: number = 0;
  rowIndexArmy: number = 0;
  rowIndexCustoms: number = 0;
  rowIndexRanger: number = 0;
  rowIndexBorderGuards: number = 0;
  rowIndexSPC: number = 0;
  searchModel: Book66Search = {
    documentFromDate: null,
    documentToDate: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate(),
    resultFromDate: null,
    resultToDate: null,
    documentCode: null,
    resultCode: null,
    unitId: null,
    violatedAgency: null,
    violatedUnitsId: null,
    violatedUnitsName: null,
    documentNumber: null,
    resultNumber: null
  };
  inProgress: boolean = false;
  colsTable: ColsTable[];
  responseData: Book66[];
  listGroupLawCode: Code[] = [];
  listReport: Book66[] = [];
  listPol: Pol[] = [];
  listPolLocalStorage: Pol[] = [];
  listSpp: Spp[] = [];
  lstPolices: LstPolice[] = [];
  lstArmies: LstArmy[] = [];
  lstCustoms: LstCustoms[] = [];
  lstRanger: LstRanger[] = [];
  lstBorderGuards: LstBorderGuards[] = [];
  lstSPC: LstSPC[] = [];
  isLoading = false;
  isDataLoaded: string;
  searchPoliceChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchArmyChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchCustomsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchRangerChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchBorderGuardsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchSPCChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  editId: number;
  btnDisable: boolean;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;

  constructor(private fb: FormBuilder,
              private constantService: ConstantService,
              private toastrService: ToastrService,
              private dateService: DateService,
              private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    for (let i = 0; i < this.listPolLocalStorage.length; i++) {
      if (this.listPolLocalStorage[i].polId === '12' || this.listPolLocalStorage[i].polId === '02'
        || this.listPolLocalStorage[i].polId === '04' || this.listPolLocalStorage[i].polId === '06'
        || this.listPolLocalStorage[i].polId === '08' || this.listPolLocalStorage[i].polId === '10'
        || this.listPolLocalStorage[i].polId === '09') {
        this.listPol.push(this.listPolLocalStorage[i]);
      }
    }
    const lstSpp = {} as Pol;
    lstSpp.polId = 'SPP';
    lstSpp.name = 'Vi???n ki???m s??t';
    const lstSpc = {} as Pol;
    lstSpc.polId = 'SPC';
    lstSpc.name = 'T??a ??n';
    this.listPol.push(lstSpp);
    this.listPol.push(lstSpc);
    this.searchModel.unitId = this.listSpp[0].sppId;
    this.searchPoliceChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMorePolice(value);
      });
    this.searchArmyChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreArmy(value);
      });
    this.searchCustomsChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreCustoms(value);
      });
    this.searchRangerChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreRanger(value);
      });
    this.searchBorderGuardsChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreBorderGuards(value);
      });
    this.searchSPCChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreSPC(value);
      });
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '5%'
      },
      {
        title: 'C?? quan vi ph???m (2)',
        width: '10%'
      },
      {
        title: 'Kh??ng ngh??? (N???i dung) (3)',
        width: '10%'
      },
      {
        title: 'Ki???n ngh??? (N???i dung) (4)',
        width: '10%'
      },
      {
        title: 'Th??ng b??o r??t kinh nghi???m (N???i dung) (5)',
        width: '10%'
      },
      {
        title: 'Y??u c???u (N???i dung) (6)',
        width: '10%'
      },
      {
        title: 'Kh??c (N???i dung) (7)',
        width: '10%'
      },
      {
        title: 'Ch???p nh???n (N???i dung) (8)',
        width: '10%'
      },
      {
        title: 'Trong ????: Ch???p nh???n m???t ph???n (N???i dung) (9)',
        width: '10%'
      },
      {
        title: 'Kh??ng ch???p nh???n (N???i dung) (10)',
        width: '10%'
      },
      {
        title: 'Trong ????: Kh??ng ch???p nh???n m???t ph???n (N???i dung) (11)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (12)',
        width: '10%'
      }
    ];
  }

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  onFromDateValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
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

  onToDateValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
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

  onDocumentToDateValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        this.searchModel.documentToDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ng??y th??ng kh??ng h???p l???.');
        this.searchModel.documentToDate = null;
        return;
      } else {
        this.searchModel.documentToDate = date;
      }
    }
  }

  onDocumentFromDateValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        this.searchModel.documentFromDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ng??y th??ng kh??ng h???p l???.');
        this.searchModel.documentFromDate = null;
        return;
      } else {
        this.searchModel.documentFromDate = date;
      }
    }
  }

  onResultFromDateValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        this.searchModel.resultFromDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ng??y th??ng kh??ng h???p l???.');
        this.searchModel.resultFromDate = null;
        return;
      } else {
        this.searchModel.resultFromDate = date;
      }
    }
  }

  onResultToDateValueChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.warning('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        this.searchModel.resultToDate = null;
        return;
      }
      const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.warning('Ng??y th??ng kh??ng h???p l???.');
        this.searchModel.resultToDate = null;
        return;
      } else {
        this.searchModel.resultToDate = date;
      }
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
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

    if (!this.searchModel.unitId) {
      this.toastrService.warning('Ch??a ch???n ????n v???');
      this.sppIdSelect.onHostClick();
      return false;
    }
    return true;
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
    this.onPageChange(1);
    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book66/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'documentFromDate': this.datePipe.transform(this.searchModel.documentFromDate, 'dd/MM/yyyy'),
        'documentToDate': this.datePipe.transform(this.searchModel.documentToDate, 'dd/MM/yyyy'),
        'resultFromDate': this.datePipe.transform(this.searchModel.resultFromDate, 'dd/MM/yyyy'),
        'resultToDate': this.datePipe.transform(this.searchModel.resultToDate, 'dd/MM/yyyy'),
        'documentCode': this.searchModel.documentCode,
        'resultCode': this.searchModel.resultCode,
        'violatedAgency': this.searchModel.violatedAgency,
        'violatedUnitsId': this.searchModel.violatedUnitsId,
        'violatedUnitsName': this.searchModel.violatedUnitsName,
        'documentNumber': this.searchModel.documentNumber,
        'resultNumber': this.searchModel.resultNumber,
        'unitId': this.searchModel.unitId
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

  exportPdf(): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book66/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'documentFromDate': this.datePipe.transform(this.searchModel.documentFromDate, 'dd/MM/yyyy'),
        'documentToDate': this.datePipe.transform(this.searchModel.documentToDate, 'dd/MM/yyyy'),
        'resultFromDate': this.datePipe.transform(this.searchModel.resultFromDate, 'dd/MM/yyyy'),
        'resultToDate': this.datePipe.transform(this.searchModel.resultToDate, 'dd/MM/yyyy'),
        'documentCode': this.searchModel.documentCode,
        'resultCode': this.searchModel.resultCode,
        'violatedAgency': this.searchModel.violatedAgency,
        'violatedUnitsId': this.searchModel.violatedUnitsId,
        'violatedUnitsName': this.searchModel.violatedUnitsName,
        'documentNumber': this.searchModel.documentNumber,
        'resultNumber': this.searchModel.resultNumber,
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_66_s???_theo_d??i_vi_ph???m_ph??p_lu???t_trong_H??TP_v??_vi???c_th???c_hi???n_y??u_c???u_th??ng_b??o_r??t_kinh_nghi???m_KN_KN_c???a_VKS_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book66/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'documentFromDate': this.datePipe.transform(this.searchModel.documentFromDate, 'dd/MM/yyyy'),
        'documentToDate': this.datePipe.transform(this.searchModel.documentToDate, 'dd/MM/yyyy'),
        'resultFromDate': this.datePipe.transform(this.searchModel.resultFromDate, 'dd/MM/yyyy'),
        'resultToDate': this.datePipe.transform(this.searchModel.resultToDate, 'dd/MM/yyyy'),
        'documentCode': this.searchModel.documentCode,
        'resultCode': this.searchModel.resultCode,
        'violatedAgency': this.searchModel.violatedAgency,
        'violatedUnitsId': this.searchModel.violatedUnitsId,
        'violatedUnitsName': this.searchModel.violatedUnitsName,
        'documentNumber': this.searchModel.documentNumber,
        'resultNumber': this.searchModel.resultNumber,
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_66_s???_theo_d??i_vi_ph???m_ph??p_lu???t_trong_H??TP_v??_vi???c_th???c_hi???n_y??u_c???u_th??ng_b??o_r??t_kinh_nghi???m_KN_KN_c???a_VKS_' +
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

  exportDocx(): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book66/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'documentFromDate': this.datePipe.transform(this.searchModel.documentFromDate, 'dd/MM/yyyy'),
        'documentToDate': this.datePipe.transform(this.searchModel.documentToDate, 'dd/MM/yyyy'),
        'resultFromDate': this.datePipe.transform(this.searchModel.resultFromDate, 'dd/MM/yyyy'),
        'resultToDate': this.datePipe.transform(this.searchModel.resultToDate, 'dd/MM/yyyy'),
        'documentCode': this.searchModel.documentCode,
        'resultCode': this.searchModel.resultCode,
        'violatedAgency': this.searchModel.violatedAgency,
        'violatedUnitsId': this.searchModel.violatedUnitsId,
        'violatedUnitsName': this.searchModel.violatedUnitsName,
        'documentNumber': this.searchModel.documentNumber,
        'resultNumber': this.searchModel.resultNumber,
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_66_s???_theo_d??i_vi_ph???m_ph??p_lu???t_trong_H??TP_v??_vi???c_th???c_hi???n_y??u_c???u_th??ng_b??o_r??t_kinh_nghi???m_KN_KN_c???a_VKS_'
            + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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

  loadMorePolice(name?: string): void {
    if (name !== undefined && name != null) {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstPolice/getList/?page=' + this.rowIndexPolice + '&size=' + this.pageSize + '&name=' + name + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ policeId: string; name: string }> = [];
              resJson.datas.forEach((lstPolice: LstPolice) => {
                listOfOption.push({
                  policeId: lstPolice.policeId,
                  name: lstPolice.name
                });
              });
              this.lstPolices = [...this.lstPolices, ...listOfOption];
              this.rowIndexPolice = this.rowIndexPolice + 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    } else {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstPolice/getList/?page=' + this.rowIndexPolice + '&size=' + this.pageSize + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ policeId: string; name: string }> = [];
              resJson.datas.forEach((lstPolice: LstPolice) => {
                listOfOption.push({
                  policeId: lstPolice.policeId,
                  name: lstPolice.name
                });
              });
              this.lstPolices = [...this.lstPolices, ...listOfOption];
              this.rowIndexPolice = this.rowIndexPolice + 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreArmy(name?: string): void {
    if (name !== undefined && name != null) {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstArmy/getList/?page=' + this.rowIndexArmy + '&size=' + this.pageSize + '&name=' + name + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ armyid: string; name: string }> = [];
              resJson.datas.forEach((lstArmy: LstArmy) => {
                listOfOption.push({
                  armyid: lstArmy.armyid,
                  name: lstArmy.name
                });
              });
              this.lstArmies = [...this.lstArmies, ...listOfOption];
              this.rowIndexArmy += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    } else {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstArmy/getList/?page=' + this.rowIndexArmy + '&size=' + this.pageSize + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ armyid: string; name: string }> = [];
              resJson.datas.forEach((lstArmy: LstArmy) => {
                listOfOption.push({
                  armyid: lstArmy.armyid,
                  name: lstArmy.name
                });
              });
              this.lstArmies = [...this.lstArmies, ...listOfOption];
              this.rowIndexArmy += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreCustoms(name?: string): void {
    if (name !== undefined && name != null) {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstCustoms/getList/?page=' + this.rowIndexCustoms + '&size=' + this.pageSize + '&name=' + name + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ customid: string; name: string }> = [];
              resJson.datas.forEach((lstCustoms: LstCustoms) => {
                listOfOption.push({
                  customid: lstCustoms.customid,
                  name: lstCustoms.name
                });
              });
              this.lstCustoms = [...this.lstCustoms, ...listOfOption];
              this.rowIndexCustoms += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    } else {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstCustoms/getList/?page=' + this.rowIndexCustoms + '&size=' + this.pageSize + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ customid: string; name: string }> = [];
              resJson.datas.forEach((lstCustoms: LstCustoms) => {
                listOfOption.push({
                  customid: lstCustoms.customid,
                  name: lstCustoms.name
                });
              });
              this.lstCustoms = [...this.lstCustoms, ...listOfOption];
              this.rowIndexCustoms += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));

    }
  }

  loadMoreRanger(name?: string): void {
    if (name !== undefined && name != null) {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstRanger/getList/?page=' + this.rowIndexRanger + '&size=' + this.pageSize + '&name=' + name + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ rangid: string; name: string }> = [];
              resJson.datas.forEach((lstRanger: LstRanger) => {
                listOfOption.push({
                  rangid: lstRanger.rangid,
                  name: lstRanger.name
                });
              });
              this.lstRanger = [...this.lstRanger, ...listOfOption];
              this.rowIndexRanger += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    } else {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstRanger/getList/?page=' + this.rowIndexRanger + '&size=' + this.pageSize + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ rangid: string; name: string }> = [];
              resJson.datas.forEach((lstRanger: LstRanger) => {
                listOfOption.push({
                  rangid: lstRanger.rangid,
                  name: lstRanger.name
                });
              });
              this.lstRanger = [...this.lstRanger, ...listOfOption];
              this.rowIndexRanger += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreBorderGuards(name?: string): void {
    if (name !== undefined && name != null) {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstBorderGuards/getList/?page=' + this.rowIndexBorderGuards + '&size=' + this.pageSize + '&name=' + name + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ borguaid: string; name: string }> = [];
              resJson.datas.forEach((lstBorderGuards: LstBorderGuards) => {
                listOfOption.push({
                  borguaid: lstBorderGuards.borguaid,
                  name: lstBorderGuards.name
                });
              });
              this.lstBorderGuards = [...this.lstBorderGuards, ...listOfOption];
              this.rowIndexBorderGuards += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    } else {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstBorderGuards/getList/?page=' + this.rowIndexBorderGuards + '&size=' + this.pageSize + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ borguaid: string; name: string }> = [];
              resJson.datas.forEach((lstBorderGuards: LstBorderGuards) => {
                listOfOption.push({
                  borguaid: lstBorderGuards.borguaid,
                  name: lstBorderGuards.name
                });
              });
              this.lstBorderGuards = [...this.lstBorderGuards, ...listOfOption];
              this.rowIndexBorderGuards += 1;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreSPC(name?: string): void {
    if (name !== undefined && name != null) {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstSPC/getList/?page=' + this.rowIndexSPC + '&size=' + this.pageSize + '&name=' + name + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ spcid: string; name: string }> = [];
              resJson.datas.forEach((lstSPC: LstSPC) => {
                listOfOption.push({
                  spcid: lstSPC.spcid,
                  name: lstSPC.name
                });
              });
              this.lstSPC = [...this.lstSPC, ...listOfOption];
              this.rowIndexSPC += 10;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    } else {
      this.isLoading = true;
      this.constantService.getRequest(this.constantService.QUAN_LY_AN +
        'LstSPC/getList/?page=' + this.rowIndexSPC + '&size=' + this.pageSize + '&sortField=name')
        .toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson != null) {
              const listOfOption: Array<{ spcid: string; name: string }> = [];
              resJson.datas.forEach((lstSPC: LstSPC) => {
                listOfOption.push({
                  spcid: lstSPC.spcid,
                  name: lstSPC.name
                });
              });
              this.lstSPC = [...this.lstSPC, ...listOfOption];
              this.rowIndexSPC += 10;
              this.isLoading = false;
            }
            this.isLoading = false;
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  onPoliceChange(lstPolice: LstPolice): void {
    this.loadMorePolice();
  }

  onSearchPoliceFromServer(value: string): void {
    this.rowIndexPolice = 0;
    this.lstPolices = [];
    this.searchPoliceChange$.next(value);
  }

  onArmyChange(lstArmy: LstArmy): void {
    this.loadMoreArmy();
  }

  onSearchArmyFromServer(value: string): void {
    this.rowIndexArmy = 0;
    this.lstArmies = [];
    this.searchArmyChange$.next(value);
  }

  onCustomsChange(lstCustoms: LstCustoms): void {
    this.loadMoreCustoms();
  }

  onSearchCustomsFromServer(value: string): void {
    this.rowIndexCustoms = 0;
    this.lstCustoms = [];
    this.searchCustomsChange$.next(value);
  }

  onRangerChange(lstRanger: LstRanger): void {
    this.loadMoreRanger();
  }

  onSearchRangerFromServer(value: string): void {
    this.rowIndexRanger = 0;
    this.lstRanger = [];
    this.searchRangerChange$.next(value);
  }

  onBorderGuardsChange(lstRanger: LstRanger): void {
    this.loadMoreRanger();
  }

  onSearchBorderGuardsFromServer(value: string): void {
    this.rowIndexBorderGuards = 0;
    this.lstBorderGuards = [];
    this.searchBorderGuardsChange$.next(value);
  }

  onSPCChange(lstSPC: LstSPC): void {
    this.loadMoreSPC();
  }

  onSearchSPCFromServer(value: string): void {
    this.rowIndexSPC = 0;
    this.lstSPC = [];
    this.searchSPCChange$.next(value);
  }

  onViolatedAgencyChange(value: any): void {
    this.isDataLoaded = value;
  }

  handleOpenChange(open: boolean): void {
    if (open && !this.searchModel.violatedUnitsId) {
      this.toastrService.warning('Y??u c???u ch???n C?? quan vi ph???m tr?????c');
    }
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(item: Book66): void {
    this.editId = null;
    item.s_column_12 = WebUtilRemoveFisrtSpace.onHandle(item.s_column_12);
    if (item.s_column_12 && item.s_column_12.length > 200) {
      this.toastrService.warning('N???i dung ghi ch?? kh??ng v?????t qu?? 200 k?? t???!');
      item.s_column_12 = null;
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'notebook/createOrUpdate/'
      , {
        'violationId': item.n_violation_id,
        'bookCode': '66',
        'note': item.s_column_12
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
