import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {Book11, Book23, Book23Search, ColsTable} from '../../model/so-thu-ly.model';
import {Code, Decision, Law, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-hai-ba',
  templateUrl: './mau-so-hai-ba.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoHaiBaComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  rowIndexLaw: number = 0;
  rowIndexItem: number = 0;
  rowIndexPoint: number = 0;
  searchModel: Book23Search = {
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  listReport: Book23[] = [];
  inProgress: boolean = false;
  listDecision: Decision[] = [];
  listSpp: Spp[] = [];
  colsTable: ColsTable[] = [];
  copylistOfData: Book23[] = [];
  responseData: Book23[] = [];
  listGroupLawCode: Code[] = [];
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
    private dateService: DateService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    const listDecisionInBook23: string[] = ['8719', '8703', '5305', '8708', '8707', '5507', '6106', '5619', '8702'];
    const listDecisionInStorage: Decision[] = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.listDecision = listDecisionInStorage.filter((decision: Decision) => listDecisionInBook23.includes(decision.deciId));
    this.listGroupLawCode = JSON.parse(localStorage.getItem('bo_luat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '3%'
      },
      {
        title: 'H??? v?? t??n (Ng??y, th??ng, n??m sinh; N??i c?? tr??) (2)',
        width: '10%'
      },
      {
        title: 'B???n ??n, quy???t ?????nh c?? hi???u l???c ph??p lu???t (S???; ng??y, th??ng, n??m; T??a ??n ???? x??t x???) (3)',
        width: '10%'
      },
      {
        title: 'T???i danh, ??i???u lu???t (4)',
        width: '32%'
      },
      {
        title: 'H??nh ph???t, m???c ??n (5)',
        width: '12%'
      },
      {
        title: 'Q?? ???y th??c ??i n??i kh??c ra quy???t ?????nh thi h??nh ??n (S???; ng??y, th??ng, n??m) (6)',
        width: '10%'
      },
      {
        title: 'Nh???n ???y th??c t??? n??i kh??c chuy???n ?????n ????? ra quy???t ?????nh thi h??nh ??n (ng??y, th??ng, n??m) (7)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh thi h??nh ??n (S???; ng??y, th??ng, n??m) (8)',
        width: '10%'
      },
      {
        title: 'B???n ??n G??T,TT tuy??n h???y ??n, tuy??n kh??ng ph???m t???i (S???; ng??y, th??ng, n??m) (9)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh ho??n ch???p h??nh ??n (S???; ng??y, th??ng, n??m; L?? do; Th???i h???n ho??n) (10)',
        width: '12%'
      },
      {
        title: 'Quy???t ?????nh t???m ????nh ch??? ch???p h??nh ??n (S???; ng??y, th??ng, n??m; L?? do; Th???i h???n T??C) (11)',
        width: '32%'
      },
      {
        title: 'Quy???t ?????nh ????nh ch??? ch???p h??nh ??n (S???; ng??y, th??ng, n??m; L?? do) (12)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh mi???n ch???p h??nh h??nh ph???t (S???; ng??y, th??ng, n??m; Ly?? do) (13)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh h?????ng th???i hi???u (S???; ng??y, th??ng, n??m) (14)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh ??p d???ng bi???n ph??p b???t bu???c ch???a b???nh (S???; ng??y, th??ng, n??m) (15)',
        width: '10%'
      }, {
        title: 'Ch???t (Ng??y, th??ng, n??m) (16)',
        width: '10%'
      },
      {
        title: 'Ph???m t???i m???i (Quy???t ?????nh kh???i t??? S???; ng??y, th??ng, n??m) (17)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh truy n?? (S???; ng??y, th??ng, n??m; L?? do) (18)',
        width: '30%'
      },
      {
        title: '???? thi h??nh ??n (Ng??y, th??ng, n??m) (19)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (20)',
        width: '6%'
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

  onSearch(): void {
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book23/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book23/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
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
          const fileName = 'S???_23_theo_d??i_vi???c_ra_quy???t_?????nh_thi_h??nh_??n_c???a_t??a_??n_'
            + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book23/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
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
          const fileName = 'S???_23_theo_d??i_vi???c_ra_quy???t_?????nh_thi_h??nh_??n_c???a_t??a_??n_'
            + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book23/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
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
          const fileName = 'S???_23_theo_d??i_vi???c_ra_quy???t_?????nh_thi_h??nh_??n_c???a_t??a_??n_'
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

  copyData(): Book23[] {
    return this.copylistOfData = this.responseData;
  }

  /*
   * Tim kiem du lieu
   */
  search(searchKeyword: string): void {
    const filteredList: Book23[] = [];
    let stt = 1;
    this.copyData().forEach((value: Book23) => {
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

  convertTimeToBeginningOfTheDay(date: Date): Date {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(item: Book23): void {
    this.editId = null;
    item.ghiChu = WebUtilRemoveFisrtSpace.onHandle(item.ghiChu);
    if (item.ghiChu && item.ghiChu.length > 200) {
      this.toastrService.warning('N???i dung ghi ch?? kh??ng v?????t qu?? 200 k?? t???!');
      item.ghiChu = null;
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'notebook/createOrUpdate/'
      , {
        'accucode': item.s_accucode,
        'bookCode': '23',
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
