import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {Book10, Book10Search, Book16, ColsTable} from '../../model/so-thu-ly.model';
import {Code, Decision, Law, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-muoi',
  templateUrl: './mau-so-muoi.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoMuoiComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  rowIndexLaw: number = 0;
  rowIndexItem: number = 0;
  rowIndexPoint: number = 0;
  searchModel: Book10Search = {
    decisionIdList: [],
    groupLawCode: null,
    lawId: null,
    lawItem: null,
    lawPoint: null,
    unitId: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  inProgress: boolean = false;
  colsTable: ColsTable[];
  copyListOfData: Book10[];
  responseData: Book10[];
  listGroupLawCode: Code[] = [];
  listReport: Book10[] = [];
  listDecision: Decision[] = [];
  listSpp: Spp[] = [];
  listLaw: Law[] = [];
  listLawItem: Law[] = [];
  listLawPoint: Law[] = [];
  isLoading = false;
  editId: any;
  btnDisable: boolean;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;

  constructor(
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private dateService: DateService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    const listDecisionInBook10: string[] = ['1302', '1304', '1303', '1301', '1306', '1308', '13', '1310', '1305',
      '1307', '1309', '1312', '1313', '1311', '1314', '0706', '5504', '0503', '5301', '0402', '4922', '4915', '0502',
      '5302', '0702', '5502', '0407', '0409'];
    const listDecisionInStorage: Decision[] = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.listDecision = listDecisionInStorage.filter((decision: Decision) => listDecisionInBook10.includes(decision.deciId));
    this.listGroupLawCode = JSON.parse(localStorage.getItem('bo_luat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '4%'
      },
      {
        title: 'V??? ??n/B??? can (2)',
        width: '9%'
      },
      {
        title: 'T???i danh(??i???u lu???t) (3)',
        width: '15%'
      },
      {
        title: 'Ki???m s??t vi??n th??? l?? THQCT, KS??T/KSXX (4)',
        width: '10%'
      },
      {
        title: '??i???u tra vi??n th??? l?? (5)',
        width: '10%'
      },
      {
        title: 'Th???m ph??n th??? l?? (6)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh tr??? h??? s?? (S???; ng??y  th??ng, n??m; C?? quan tra?? h???? s??) (7)',
        width: '10%'
      },
      {
        title: 'L?? do tr??? h??? s?? ????? ??TBS (8)',
        width: '10%'
      },
      {
        title: 'Ng??y Giao/Nh???n h??? s?? ??i???u tra b??? sung (9)',
        width: '10%'
      },
      {
        title: '????nh ch??? ??i???u tra  V??? ??n/ B??? can (S???; ng??y, th??ng, n??m) (10)',
        width: '10%'
      },
      {
        title: 'T???m ????nh ch??? ??i???u tra V??? ??n/ B??? can (S???; ng??y, th??ng, n??m) (11)',
        width: '10%'
      },
      {
        title: 'Gi??? nguy??n Q?? ????? ngh??? truy t??? (12)',
        width: '10%'
      },
      {
        title: 'Thay ?????i quan ??i???m ????? ngh??? truy t??? (13)',
        width: '10%'
      },
      {
        title: 'VKS gi??? nguy??n C??o tr???ng truy t???, chuy???n l???i h??? s?? ????? T??a ??n x??t x??? (CV S???; ng??y, th??ng, n??m) (14)',
        width: '10%'
      },
      {
        title: 'VKS tr??? h??? s?? cho CQ??T ????? ??i???u tra b??? sung theo y??u c???u c???a T??a ??n (15)',
        width: '10%'
      },
      {
        title: 'T???m ????nh ch??? V??? ??n/B??? can (S???; ng??y, th??ng, n??m) (16)',
        width: '10%'
      },
      {
        title: '????nh ch??? V??? ??n/ B??? can (S???; ng??y, th??ng, n??m) (17)',
        width: '10%'
      },
      {
        title: 'Thay ?????i C??o tr???ng (18)',
        width: '10%'
      },
      {
        title: 'Gi??? nguy??n C??o tr???ng (19)',
        width: '10%'
      },
      {
        title: 'X??? l?? kh??c (20)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (21)',
        width: '7%'
      },
      {
        title: ' '
      }
    ];
  }

  loadMoreLaw(): void {
    if (this.searchModel.groupLawCode) {
      if (!this.isLoading) {
        this.isLoading = true;
      }
      this.constantService.postRequest(this.constantService.MANAGE_URI + 'law/findLawByCodeId/'
        , {
          'codeId': this.searchModel.groupLawCode,
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              /*
              * Lo???i b??? c??c fields kh??ng c???n thi???t m?? ch??? l???y 2 fields ????? ????? ra ComboBox
              */
              const listOfOption: Array<{ lawId: string; lawName: string }> = [];
              resJson.responseData.forEach((law: Law) => {
                listOfOption.push({
                  lawId: law.lawId,
                  lawName: law.lawName
                });
              });
              this.listLaw = listOfOption;
              this.isLoading = false;
            } else {
              this.isLoading = false;
            }
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreLawItem(): void {
    if (this.searchModel.lawId) {
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.MANAGE_URI + 'law/findItemByLawId/'
        , {
          'codeId': this.searchModel.groupLawCode,
          'lawId': this.searchModel.lawId?.lawId,
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
              this.listLawItem = listOfOption;
              this.isLoading = false;
            } else {
              this.isLoading = false;
            }
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
  }

  loadMoreLawPoint(): void {
    if (this.searchModel.lawItem) {
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.MANAGE_URI + 'law/findPointByItemId/'
        , {
          'codeId': this.searchModel.groupLawCode,
          'lawId': this.searchModel.lawId?.lawId,
          'item': this.searchModel.lawItem?.item,
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
              this.listLawPoint = listOfOption;
              this.isLoading = false;
            } else {
              this.isLoading = false;
            }
          }
        )
        .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    }
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

  /*
   * S??? ki???n B??? lu???t thay ?????i
   */
  onCodeIdChange(value: any): void {
    this.searchModel.lawId = null;
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

    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book10/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book10/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
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
          const fileName = 'S???_10_s???_qu???n_l??_??n_h??nh_s???_tr???_h???_s??_??i???u_tra_b???_sung_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book10/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
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
          const fileName = 'S???_10_s???_qu???n_l??_??n_h??nh_s???_tr???_h???_s??_??i???u_tra_b???_sung_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book10/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'caseCode': this.searchModel.caseCode,
        'caseName': this.searchModel.caseName,
        'accuCode': this.searchModel.accuCode,
        'accuName': this.searchModel.accuName,
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
          const fileName = 'S???_10_s???_qu???n_l??_??n_h??nh_s???_tr???_h???_s??_??i???u_tra_b???_sung_' +
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

  copyData(): Book10[] {
    return this.copyListOfData = this.responseData;
  }

  /*
   * Tim kiem du lieu
   */
  search(searchKeyword: string): void {
    const filteredList: Book10[] = [];
    let stt = 1;
    this.copyData().forEach((value: Book10) => {
      const propValueList = Object.values(value);
      for (let i = 0; i < propValueList.length; i++) {
        if (propValueList[i] && propValueList[i].toString().toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1) {
          filteredList.push({...value,stt: stt++});
          break;
        }
      }
    });
    if (filteredList.length === 0) {
      this.toastrService.warning('Kh??ng t??m th???y d??? li???u c???n tra c???u');
    } else {
      this.onPageChange(1);
      this.listReport = filteredList;
      this.totalRecords = this.listReport.length;
    }
  }

  startEdit(id: string, accucode?: string): void {
    this.editId = {casecode:id ,accucode: accucode};
  }

  checkEditNt = (id: string, accucode?: string) => id === this.editId?.casecode && accucode === this.editId?.accucode

  stopEdit(item: Book10): void {
    this.editId = null;
    item.ghiChu = WebUtilRemoveFisrtSpace.onHandle(item.ghiChu);
    if (item.ghiChu && item.ghiChu.length > 200) {
      this.toastrService.warning('N???i dung ghi ch?? kh??ng v?????t qu?? 200 k?? t???!');
      item.ghiChu = null;
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book10/createOrUpdateNote/'
      , {
        'caseCode': item.s_casecode,
        'accucode': item.s_accucode,
        'bookCode': '10',
        'note': item.ghiChu
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
