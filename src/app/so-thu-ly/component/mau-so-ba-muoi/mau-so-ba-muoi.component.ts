import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {DateService} from '../../../common/util/date.service';
import {Book27, Book29, Book30, Book30Search, ColsTable} from '../../model/so-thu-ly.model';
import {Code, Decision, Law, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import * as moment from 'moment';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-mau-so-ba-muoi',
  templateUrl: './mau-so-ba-muoi.component.html',
  providers: [
    DatePipe
  ]
})
export class MauSoBaMuoiComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  searchModel: Book30Search = {
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  listReport: Book30[] = [];
  inProgress: boolean = false;
  listDecision: Decision[] = [];
  listSpp: Spp[] = [];
  colsTable: ColsTable[] = [];
  copylistOfData: Book30[] = [];
  responseData: Book30[] = [];
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
    //this.listDecision = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.listGroupLawCode = JSON.parse(localStorage.getItem('bo_luat'));
    this.searchModel.unitId = this.listSpp[0].sppId;
    // load Quy???t ?????nh
    const decisions: Decision[] = JSON.parse(localStorage.getItem(this.constantService.QUYET_DINH));
    const decisionsInBook30: string[] = ['8721','8723','8727', '8730'];
    if (decisions.length > 0) {
      this.listDecision = decisions.filter((decision: Decision) => decisionsInBook30.includes(decision.deciId));
    }
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '2%'
      },
      {
        title: 'H??? v?? t??n (Ng??y, th??ng, n??m, sinh; n??i c?? tr??) (2)',
        width: '8%'
      },
      {
        title: 'T???i danh, ??i???u lu???t,  M???c h??nh ph???t (3)',
        width: '26%'
      },
      {
        title: 'Th???i gian ???? ch???p h??nh ??n ph???t t?? (4)',
        width: '10%'
      },
      {
        title: 'Q?? tha t?? tr?????c th???i h???n c?? ??i???u ki???n (S???; ng??y, th??ng, n??m; Th???i gian th??? th??ch) (5)',
        width: '10%'
      },
      {
        title: 'Chuy????n ??inh n??i kha??c (Nga??y, tha??ng, n??m; Ly?? do) (6)',
        width: '10%'
      },
      {
        title: 'N??i kha??c chuy????n ??????n (Nga??y, tha??ng, n??m; Ly?? do) (7)',
        width: '10%'
      },
      {
        title: 'C?? quan ???????c giao nhi???m v??? qu???n l?? (8)',
        width: '10%'
      },
      {
        title: 'Q?? r??t ng???n th???i gian th??? th??ch (S???; ng??y, th??ng, n??m; To??a a??n ra Q??; Th???i gian r??t ng???n) (9)',
        width: '10%'
      },
      {
        title: 'Q?? h???y Quy???t ?????nh tha t?? tr?????c th???i h???n c?? ??i???u ki???n (S???; ng??y, th??ng, n??m; L?? do h???y) (10)',
        width: '10%'
      },
      {
        title: 'Ch???t (Ng??y, th??ng, n??m) (11)',
        width: '8%'
      },
      {
        title: 'Q?? ??i??nh chi?? thi ha??nh a??n (S????; nga??y, tha??ng, n??m; Ly?? do) (12)',
        width: '8%'
      },
      {
        title: 'Gi???y ch???ng nh???n ch???p h??nh xong h??nh ph???t (S???; ng??y, th??ng, n??m) (13)',
        width: '8%'
      },
      {
        title: 'Ghi ch?? (14)',
        width: '5%'
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
  };

  disabledToDate = (endValue: Date): boolean => {
    if (!endValue || !this.searchModel.fromDate) {
      return false;
    }
    return endValue.getTime() <= this.searchModel.fromDate.getTime();
  };

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

  onSearch(): void {
    if (this.checkValidate() === false) {
      return;
    }
    this.getListData();
  }

  getListData(): void {
    if (this.checkValidate() === false) {
      return;
    }

    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book30/requestReport/'
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
          this.totalRecords = this.listReport.length;
          this.responseData = resJson.responseData;
          this.listReport.length ? this.btnDisable = true : this.btnDisable = false;
        } else {
          this.listReport = new Array<Book30>();
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book30/requestReportPdf/'
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
          const fileName = 'S???_30_ki???m_s??t_vi???c_thi_h??nh_quy???t_?????nh_tha_t??_tr?????c_th???i_h???n_c??_??i???u_ki???n_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book30/requestReportExcel/'
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
          const fileName = 'S???_30_ki???m_s??t_vi???c_thi_h??nh_quy???t_?????nh_tha_t??_tr?????c_th???i_h???n_c??_??i???u_ki???n_' +
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book30/requestReportDocx/'
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
          const fileName = 'S???_30_ki???m_s??t_vi???c_thi_h??nh_quy???t_?????nh_tha_t??_tr?????c_th???i_h???n_c??_??i???u_ki???n_' +
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

  copyData() {
    return this.copylistOfData = this.responseData;
  }

  /*
   * Tim kiem du lieu
   */
  search(searchKeyword: string): void {
    const filteredList: Book29[] = [];
    let stt = 1;
    this.copyData().forEach((value: Book29) => {
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

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(item: Book30): void {
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
        'bookCode': '30',
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
