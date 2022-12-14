import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {Book06, Book06Search, Book07, ColsTable} from '../../model/so-thu-ly.model';
import {Code, Decision, Law, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-sau',
  templateUrl: './mau-so-sau.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoSauComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  rowIndexLaw: number = 0;
  rowIndexItem: number = 0;
  rowIndexPoint: number = 0;
  searchModel: Book06Search = {
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
  copyListOfData: Book06[];
  responseData: Book06[];
  listGroupLawCode: Code[] = [];
  listReport: Book06[] = [];
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
    const listDecisionInBook06: string[] = ['5615', '5608', '5601', '5710', '5711', '5708', '5709', '5704', '5701',
      '6309', '5904', '5906', '5910', '5912', '9913', '5902', '5915', '5916', '5917', '9914', '5914', '6111', '6124',
      '6125', '6104', '6103', '6107', '6110', '6105', '6109', '6101', '6121', '6102', '9915', '6112', '5908', '5128',
      '5203', '5920', '6114', '6116', '9905', '9904', '6119', '9916', '6120'];
    const listDecisionInStorage: Decision[] = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.listDecision = listDecisionInStorage.filter((decision: Decision) => listDecisionInBook06.includes(decision.deciId));
    this.listGroupLawCode = JSON.parse(localStorage.getItem('bo_luat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    this.colsTable = [
      {
        title: 'V??? ??n/H??? v?? t??n b??? can (1)',
        width: '5%'
      },
      {
        title: 'Q?? ph?? chu???n/Kh??ng ph?? chu???n l???nh b???t ng?????i b??? gi??? trong tr?????ng h???p kh???n c???p (2)',
        width: '10%'
      },
      {
        title: 'L???nh b???t ng?????i b??? gi??? trong tr?????ng h???p kh???n c???p (3)',
        width: '10%'
      },
      {
        title: 'Q?? kh??ng ph?? chu???n  vi???c gia h???n t???m gi??? (4)',
        width: '10%'
      },
      {
        title: 'Q?? ph?? chu???n vi???c gia h???n t???m gi??? L???n 1/L???n 2 (5)',
        width: '10%'
      },
      {
        title: 'Q?? h???y b??? Q??/L???nh T???m gi??? (6)',
        width: '10%'
      },
      {
        title: 'Q?? tr??? t??? do cho ng?????i b??? t???m gi??? (7)',
        width: '10%'
      },
      {
        title: 'Q?? ph?? chu???n L???nh b???t b??? can ????? t???m giam (8)',
        width: '10%'
      },
      {
        title: 'Q?? kh??ng ph?? chu???n L???nh b???t b??? can ????? t???m giam (9)',
        width: '10%'
      },
      {
        title: 'Q?? ph?? chu???n l???nh t???m giam (10)',
        width: '10%'
      },
      {
        title: 'Q?? kh??ng ph?? chu???n l???nh t???m giam (11)',
        width: '10%'
      },
      {
        title: 'Y??u c???u ??p d???ng bi???n ph??p t???m giam b??? can (12)',
        width: '10%'
      },
      {
        title: 'L???nh b???t b??? can ????? t???m giam (13)',
        width: '10%'
      },
      {
        title: 'Q?? gia h???n th???i h???n t???m giam b??? can L???n 1/L???n 2/L???n 3 (14)',
        width: '10%'
      },
      {
        title: 'Q?? gia h???n th???i h???n t???m giam b??? can ?????c bi???t (15)',
        width: '10%'
      },
      {
        title: 'Q?? h???y b??? bi???n ph??p t???m giam (16)',
        width: '10%'
      },
      {
        title: 'Q?? thay th??? bi???n ph??p ng??n ch???n (17)',
        width: '10%'
      },
      {
        title: 'Q?? ph?? chu???n/Kh??ng ph?? chu???n/H???y b??? bi???n ph??p b???o l??nh (18)',
        width: '10%'
      },
      {
        title: 'Q?? v??? vi???c b???o l??nh (19)',
        width: '10%'
      },
      {
        title: 'Q?? ph?? chu???n/Kh??ng ph?? chu???n Q?? v??? vi???c ?????t ti???n ????? b???o ?????m (20)',
        width: '10%'
      },
      {
        title: 'Q?? v??? vi???c ?????t ti???n ????? b???o ?????m/Q?? h???y b??? bi???n ph??p ?????t ti???n ????? b???o ?????m (21)',
        width: '10%'
      },
      {
        title: 'L???nh c???m ??i kh???i n??i c?? tr?? (22)',
        width: '10%'
      },
      {
        title: 'Th??ng b??o v??? vi???c ??p d???ng bi???n ph??p c???m ??i kh???i n??i c?? tr?? (23)',
        width: '10%'
      },
      {
        title: 'Q?? h???y b??? bi???n ph??p c???m ??i kh???i n??i c?? tr?? (24)',
        width: '10%'
      },
      {
        title: 'Q?? t???m ho??n xu???t c???nh (25)',
        width: '10%'
      },
      {
        title: 'Q?? h???y b??? bi???n ph??p t???m ho??n xu???t c???nh (26)',
        width: '10%'
      },
      {
        title: 'L???nh t???m giam ????? truy t???/Th??ng b??o v??? vi???c t???m giam b??? can (27)',
        width: '10%'
      },
      {
        title: 'L???nh b???t t???m giam b??? can ????? truy t??? (28)',
        width: '10%'
      },
      {
        title: 'Q?? gia h???n th???i h???n t???m giam ????? truy t??? (29)',
        width: '10%'
      },
      {
        title: 'Q?? ??p gi???i b??? can (30)',
        width: '10%'
      },
      {
        title: 'Q?? d???n gi???i (31)',
        width: '10%'
      },
      {
        title: 'L???nh k?? bi??n t??i s???n (32)',
        width: '10%'
      },
      {
        title: 'L???nh kh??m x??t (33)',
        width: '10%'
      },
      {
        title: 'Q?? h???y b??? bi???n ph??p k?? bi??n t??i s???n (34)',
        width: '10%'
      },
      {
        title: 'L???nh phong t???a t??i kho???n (35)',
        width: '10%'
      },
      {
        title: 'Q?? h???y b??? bi???n ph??p phong t???a t??i kho???n (36)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (37)',
        width: '10%'
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
    this.rowIndexLaw = 0;
    this.listLaw = [];

    this.searchModel.lawItem = null;
    this.rowIndexItem = 0;
    this.listLawItem = [];

    this.searchModel.lawPoint = null;
    this.rowIndexPoint = 0;
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book06/requestReport/'
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book06/requestReportPdf/'
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
          const fileName = 'S???_06_s???_????ng_k??_l???nh_quy???t_?????nh_v??n_b???n_v???_??p_d???ng_bi???n_ph??p_ng??n_ch???n_bi???n_ph??p_c?????ng_ch???_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book06/requestReportExcel/'
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
          const fileName = 'S???_06_s???_????ng_k??_l???nh_quy???t_?????nh_v??n_b???n_v???_??p_d???ng_bi???n_ph??p_ng??n_ch???n_bi???n_ph??p_c?????ng_ch???_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book06/requestReportDocx/'
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
          const fileName = 'S???_06_s???_????ng_k??_l???nh_quy???t_?????nh_v??n_b???n_v???_??p_d???ng_bi???n_ph??p_ng??n_ch???n_bi???n_ph??p_c?????ng_ch???_'
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

  copyData(): Book06[] {
    return this.copyListOfData = this.responseData;
  }

  /*
   * Tim kiem du lieu
   */
  search(searchKeyword: string): void {
    const filteredList: Book06[] = [];
    this.copyData().forEach((value: Book06) => {
      const propValueList = Object.values(value);
      for (let i = 0; i < propValueList.length; i++) {
        if (propValueList[i] && propValueList[i].toString().toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1) {
          filteredList.push(value);
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  startEdit(id: string, accucode?: string): void {
    this.editId = {casecode:id ,accucode: accucode};
  }

  checkEditNt = (id: string, accucode?: string) => id === this.editId?.casecode && accucode === this.editId?.accucode

  stopEdit(item: Book06): void {
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
        'casecode': item.s_casecode,
        'accucode': item.s_accucode,
        'bookCode': '06',
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
