import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {Book15, Book15Search, ColsTable} from '../../model/so-thu-ly.model';
import {Code, Decision, Law, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-mau-so-muoi-nam',
  templateUrl: './mau-so-muoi-nam.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoMuoiNamComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  rowIndexLaw: number = 0;
  searchModel: Book15Search = {
    decisionIdList: [],
    groupLawCode: null,
    soVCC: null,
    lawId: null,
    lawItem: null,
    lawPoint: null,
    unitId: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  inProgress: boolean = false;
  colsTable: ColsTable[];
  copyListOfData: Book15[];
  responseData: Book15[];
  listGroupLawCode: Code[] = [];
  listReport: Book15[] = [];
  listDecision: Decision[] = [];
  listDecisionLocalStorage: Decision[] = [];
  listSpp: Spp[] = [];
  listLaw: Law[] = [];
  listLawItem: Law[] = [];
  listLawPoint: Law[] = [];
  isLoading = false;
  btnDisable: boolean;

  searchLawChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchItemChange$: BehaviorSubject<string> = new BehaviorSubject(null);
  searchPointChange$: BehaviorSubject<string> = new BehaviorSubject(null);

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

  loadMoreLaw(lawName?: string): void {
    if (this.searchModel.groupLawCode) {
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.MANAGE_URI + 'law/searchLawId/'
        , {
          'rowIndex': this.rowIndexLaw,
          'pageSize': 10,
          'codeId': this.searchModel.groupLawCode,
          'lawName': lawName
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              /*
              * Lo???i b??? c??c fields kh??ng c???n thi???t m?? ch??? l???y 2 fields ????? ????? ra ComboBox
              */
              const listOfOption: Array<{ lawId: string; fullName: string }> = [];
              resJson.responseData.forEach((law: Law) => {
                listOfOption.push({
                  lawId: law.lawId,
                  fullName: law.fullName
                });
              });
              this.listLaw = [...this.listLaw, ...listOfOption];
              this.rowIndexLaw += 10;
              this.isLoading = false;
            } else {
              this.isLoading = false;
            }
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreLawItem(item?: string): void {
    if (this.searchModel.lawId) {
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.MANAGE_URI + 'law/searchLawItem/'
        , {
          'codeId': this.searchModel.groupLawCode,
          'lawId': this.searchModel.lawId?.lawId,
          'item': item
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              /*
               * Lo???i b??? c??c fields kh??ng c???n thi???t m?? ch??? l???y 2 fields ????? ????? ra ComboBox
               */
              const listOfOption: Array<{ item: string; lawName: string }> = [];
              resJson.responseData.forEach((law: Law) => {
                listOfOption.push({
                  item: law.item,
                  lawName: law.lawName
                });
              });
              this.listLawItem = [...this.listLawItem, ...listOfOption];
              this.isLoading = false;
            } else {
              this.isLoading = false;
            }
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreLawPoint(point?: string): void {
    if (this.searchModel.lawItem) {
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.MANAGE_URI + 'law/searchLawPoint/'
        , {
          'codeId': this.searchModel.groupLawCode,
          'lawId': this.searchModel.lawId?.lawId,
          'item': this.searchModel.lawItem?.item,
          'point': point
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              /*
               * Lo???i b??? c??c fields kh??ng c???n thi???t m?? ch??? l???y 2 fields ????? ????? ra ComboBox
               */
              const listOfOption: Array<{ point: string; lawName: string }> = [];
              resJson.responseData.forEach((law: Law) => {
                listOfOption.push({
                  point: law.point,
                  lawName: law.lawName
                });
              });
              this.listLawPoint = [...this.listLawPoint, ...listOfOption];
              this.isLoading = false;
            } else {
              this.isLoading = false;
            }
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    this.listDecisionLocalStorage = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.listGroupLawCode = JSON.parse(localStorage.getItem('bo_luat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    for (let i = 0; i < this.listDecisionLocalStorage.length; i++) {
      if (this.listDecisionLocalStorage[i].deciId === '0701' || this.listDecisionLocalStorage[i].deciId === '1901'
        || this.listDecisionLocalStorage[i].deciId === '1903' || this.listDecisionLocalStorage[i].deciId === '1908') {
        this.listDecision.push(this.listDecisionLocalStorage[i]);
      }
    }
    this.searchLawChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreLaw(value);
      });
    this.searchItemChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreLawItem(value);
      });
    this.searchPointChange$.asObservable().pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.loadMoreLawPoint(value);
      });
    this.colsTable = [
      {
        title: 'STT, ng??y th??ng n??m th??? l?? (1)',
        width: '5%'
      },
      {
        title: 'V??? ??n/ B??? c??o (H??? v?? t??n; ng??y, th??ng, n??m sinh; n??i th?????ng tr??, ?????ng vi??n???) (2)',
        width: '8%'
      },
      {
        title: 'B???n ??n s?? th???m (S???; ng??y, th??ng, n??m; ??i???u kho???n, h??nh ph???t...) (3)',
        width: '17%'
      },
      {
        title: 'Ki???m s??t vi??n (4)',
        width: '10%'
      },
      {
        title: 'Th???m ph??n (Ch??? t???a phi??n t??a) (5)',
        width: '10%'
      },
      {
        title: 'Kh??ng c??o ph??c th???m (Ng??y, th??ng, n??m; ng?????i kh??ng c??o; n???i dung) (6)',
        width: '10%'
      },
      {
        title: 'Kh??ng ngh??? ph??c th???m (S???; ng??y, th??ng, n??m; n???i dung) (7)',
        width: '10%'
      },
      {
        title: '????nh ch??? x??t x??? ph??c th???m (S???; ng??y, th??ng, n??m; L?? do) (8)',
        width: '10%'
      },
      {
        title: '????a v??? ??n ra x??t x??? (S???; ng??y, th??ng, n??m) (9)',
        width: '10%'
      },
      {
        title: 'Ng??y x??t x??? ph??c th???m (10)',
        width: '10%'
      },
      {
        title: 'T???m ng???ng ho???c ho??n phi??n t??a (S???; ng??y, th??ng, n??m; L?? do) (11)',
        width: '10%'
      },
      {
        title: 'Quan ??i???m c???a VKS t???i phi??n t??a (12)',
        width: '10%'
      },
      {
        title: 'B???n ??n (S???; ng??y, th??ng, n??m; N???i dung) (13)',
        width: '7%'
      },
      {
        title: '????? ngh??? VKS c???p tr??n kh??ng ngh??? G??T, TT (S???; ng??y, th??ng, n??m) (14)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (Ghi th??m c??c ti??u ch?? nh??: Phi??n t??a r??t kinh nghi???m, ng?????i b??o ch???a (n???u c??)???(15)',
        width: '8%'
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

  /*
   * S??? ki???n B??? lu???t thay ?????i
   */
  onCodeIdChange(value: any): void {
    this.searchModel.lawId = null;
    this.rowIndexLaw = 0;
    this.listLaw = [];

    this.searchModel.lawItem = null;
    this.listLawItem = [];

    this.searchModel.lawPoint = null;
    this.listLawPoint = [];
    this.loadMoreLaw();
  }

  /*
   * S??? ki???n ??i???u lu???t thay ?????i
   */
  onLawIdChange(law: Law): void {
    this.searchModel.lawItem = null;
    this.listLawItem = [];

    this.searchModel.lawPoint = null;
    this.listLawPoint = [];
    this.loadMoreLawItem();
  }

  handleLawIdOpenChange(open: boolean): void {
    if (open && !this.searchModel.groupLawCode) {
      this.toastrService.warning('Y??u c???u ch???n B??? lu???t tr?????c');
    }
  }

  onSearchLawNameFromServer(value: string): void {
    this.rowIndexLaw = 0;
    this.listLaw = [];
    this.searchLawChange$.next(value);
  }

  /*
   * S??? ki???n Kho???n thay ?????i
   */
  onItemChange(value: any): void {
    this.searchModel.lawPoint = null;
    this.listLawPoint = [];
    this.loadMoreLawPoint();
  }

  handleItemOpenChange(open: boolean): void {
    if (open && !this.searchModel.lawId) {
      this.toastrService.warning('Y??u c???u ch???n ??i???u lu???t tr?????c');
    }
  }

  /*
   * S??? ki???n ??i???m thay ?????i
   */
  handlePointChange(): void {
    if (open && !this.searchModel.lawItem) {
      this.toastrService.warning('Y??u c???u ch???n Kho???n tr?????c');
    }
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

    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book15/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'soVCC': this.searchModel.soVCC,
        'groupLawCode': this.getLawCode(),
        'lawId': this.searchModel.lawId?.lawId,
        'item': this.searchModel.lawItem?.item,
        'point': this.searchModel.lawPoint?.point,
        'unitId': this.searchModel.unitId,
        'decisionIdList': this.searchModel.decisionIdList
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book15/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'soVCC': this.searchModel.soVCC,
        'groupLawCode': this.searchModel.groupLawCode,
        'lawId': this.searchModel.lawId?.lawId,
        'item': this.searchModel.lawItem?.item,
        'point': this.searchModel.lawPoint?.point,
        'unitId': this.searchModel.unitId,
        'decisionIdList': this.searchModel.decisionIdList
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_15_S???_THQCT_KSXX_PH??C_TH???M_C??C_V???_??N_H??NH_S???_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book15/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'soVCC': this.searchModel.soVCC,
        'groupLawCode': this.searchModel.groupLawCode,
        'lawId': this.searchModel.lawId?.lawId,
        'item': this.searchModel.lawItem?.item,
        'point': this.searchModel.lawPoint?.point,
        'unitId': this.searchModel.unitId,
        'decisionIdList': this.searchModel.decisionIdList
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_15_S???_THQCT_KSXX_PH??C_TH???M_C??C_V???_??N_H??NH_S???_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book15/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
        'soVCC': this.searchModel.soVCC,
        'groupLawCode': this.searchModel.groupLawCode,
        'lawId': this.searchModel.lawId?.lawId,
        'item': this.searchModel.lawItem?.item,
        'point': this.searchModel.lawPoint?.point,
        'unitId': this.searchModel.unitId,
        'decisionIdList': this.searchModel.decisionIdList
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_15_S???_THQCT_KSXX_PH??C_TH???M_C??C_V???_??N_H??NH_S???_' +
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

  addFocusInput() {
    document.getElementById('fromDate').focus();
  }

  copyData(): Book15[] {
    return this.copyListOfData = this.responseData;
  }

  search(search: string): void {
    const targetValue: Book15[] = [];
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
      this.toastrService.warning('Kh??ng t??m th???y d??? li???u c???n tra c???u');
    }
  }

  isVCC(): boolean {
    return this.searchModel.unitId === '0180' || this.searchModel.unitId === '0182' || this.searchModel.unitId === '0184';
  }

  private getLawCode(): string | null {
    if (this.isVCC()) {
      console.log(this.listGroupLawCode.find(code => code.codeId === this.searchModel.groupLawCode));
      const groupLawCode = this.listGroupLawCode.find(code => code.codeId === this.searchModel.groupLawCode);
      return groupLawCode ? groupLawCode.codeName : null;
    }
    return this.searchModel.groupLawCode;
  }
}
