import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {
  Book03,
  Book11,
  Book13,
  Book13Search,
  ColsTable,
  LstArmy,
  LstBorderGuards,
  LstCustoms,
  LstPolice,
  LstRanger,
  LstSPC
} from '../../model/so-thu-ly.model';
import {Code, Decision, Pol, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {DatePipe} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-muoi-ba',
  templateUrl: './mau-so-muoi-ba.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoMuoiBaComponent implements OnInit {
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
  searchModel: Book13Search = {
    caseCode: null,
    caseName: null,
    accuCode: null,
    accuName: null,
    unitId: null,
    organIdDelivery: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  inProgress: boolean = false;
  colsTable: ColsTable[];
  copyListOfData: Book13[];
  responseData: Book13[];
  listGroupLawCode: Code[] = [];
  listReport: Book13[] = [];
  listDecision: Decision[] = [];
  listPol: Pol[] = [];
  listPolLocalStorage: Pol[] = [];
  listSpp: Spp[] = [];
  lstPolice: LstPolice[] = [];
  lstArmy: LstArmy[] = [];
  lstCustoms: LstCustoms[] = [];
  lstRanger: LstRanger[] = [];
  lstBorderGuards: LstBorderGuards[] = [];
  lstSPC: LstSPC[] = [];
  isLoading = false;
  isDataLoaded: string;
  editId: any;
  btnDisable: boolean;

  searchPoliceChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchArmyChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchCustomsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchRangerChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchBorderGuardsChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchSPCChange$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private dateService: DateService,
    private datePipe: DatePipe
  ) {
  }

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;


  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    this.listDecision = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.listGroupLawCode = JSON.parse(localStorage.getItem('bo_luat'));
    this.listPolLocalStorage = JSON.parse(localStorage.getItem('co_quan'));
    for (let i = 0; i < this.listPolLocalStorage.length; i++) {
      if (this.listPolLocalStorage[i].polId === '12' || this.listPolLocalStorage[i].polId === '02'
        || this.listPolLocalStorage[i].polId === '04' || this.listPolLocalStorage[i].polId === '06'
        || this.listPolLocalStorage[i].polId === '08' || this.listPolLocalStorage[i].polId === '10'
        || this.listPolLocalStorage[i].polId === '09') {
        this.listPol.push(this.listPolLocalStorage[i]);
      }
    }
    const lstSpp = {} as Pol;
    lstSpp.polId = '01';
    lstSpp.name = 'Viện kiểm sát';
    const lstSpc = {} as Pol;
    lstSpc.polId = '00';
    lstSpc.name = 'Tòa án';
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
        title: 'STT/Ngày, tháng, năm giao, nhận hồ sơ (1)',
        width: '9%'
      },
      {
        title: 'Vụ án/Bị can chính/Tổng số bút lục (2)',
        width: '20%'
      },
      {
        title: 'Vật chứng (3)',
        width: '20%'
      },
      {
        title: 'Lý do chuyển (4)',
        width: '20%'
      },
      {
        title: 'Bên giao (Họ và tên; Cơ quan) (5)',
        width: '15%'
      },
      {
        title: 'Bên nhận (Họ và tên; Cơ quan)(6)',
        width: '15%'
      },
      {
        title: 'Ghi chú (7)',
        width: '10%'
      },
      {
        title: ' '
      }
    ];
  }

  handleFromDateOpenChange(open: boolean): void {
    if (!open && this.searchModel.fromDate) {
      this.toDatePicker.open();
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  disabledFromDate = (startValue: Date): boolean => {
    if (!startValue || !this.searchModel.toDate) {
      return false;
    }
    return startValue.getTime() > this.searchModel.toDate.getTime();
  }

  disabledToDate = (endValue: Date): boolean => {
    if (!endValue || !this.searchModel.fromDate) {
      return false;
    }
    return endValue.getTime() <= this.searchModel.fromDate.getTime();
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

    if (this.searchModel.fromDate.getTime() > this.searchModel.toDate.getTime()) {
      this.toastrService.warning('Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
      this.fromDatePicker.open();
      return false;
    }

    if (!this.searchModel.unitId) {
      this.toastrService.warning('Chưa chọn đơn vị');
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

    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book13/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'organIdDelivery': this.searchModel.organIdDelivery,
        'unitIdDelivery': this.searchModel.unitIdDelivery,
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book13/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'organIdDelivery': this.searchModel.organIdDelivery,
        'unitIdDelivery': this.searchModel.unitIdDelivery,
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_13_giao_nhận_hồ_sơ_vụ_án_hình_sự_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book13/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'organIdDelivery': this.searchModel.organIdDelivery,
        'unitIdDelivery': this.searchModel.unitIdDelivery,
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_13_giao_nhận_hồ_sơ_vụ_án_hình_sự_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book13/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'organIdDelivery': this.searchModel.organIdDelivery,
        'unitIdDelivery': this.searchModel.unitIdDelivery,
        'unitId': this.searchModel.unitId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_13_giao_nhận_hồ_sơ_vụ_án_hình_sự_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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

  copyData(): Book13[] {
    return this.copyListOfData = this.responseData;
  }

  onOrganIdDeliveryChange(value: any): void {
    this.isDataLoaded = value;
  }

  search(search: string): void {
    const targetValue: Book13[] = [];
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
      this.toastrService.warning('Không tìm thấy dữ liệu cần tra cứu');
    }
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
              this.lstPolice = [...this.lstPolice, ...listOfOption];
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
              this.lstPolice = [...this.lstPolice, ...listOfOption];
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
              this.lstArmy = [...this.lstArmy, ...listOfOption];
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
              this.lstArmy = [...this.lstArmy, ...listOfOption];
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
    this.lstPolice = [];
    this.searchPoliceChange$.next(value);
  }

  onArmyChange(lstArmy: LstArmy): void {
    this.loadMoreArmy();
  }

  onSearchArmyFromServer(value: string): void {
    this.rowIndexArmy = 0;
    this.lstArmy = [];
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


  startEdit(id: string, regicode?: string): void {
    this.editId = {casecode:id ,regicode: regicode};
  }

  checkEditNt = (id: string, regicode?: string) => id === this.editId?.casecode && regicode === this.editId?.regicode

  stopEdit(item: Book13): void {
    this.editId = null;
    item.ghiChu = WebUtilRemoveFisrtSpace.onHandle(item.ghiChu);
    if (item.ghiChu && item.ghiChu.length > 200) {
      this.toastrService.warning('Nội dung ghi chú không vượt quá 200 ký tự!');
      item.ghiChu = null;
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'notebook/createOrUpdate/'
      , {
        'casecode': item.s_casecode,
        'regicode': item.s_regicode,
        'bookCode': '13',
        'note': item.ghiChu
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
