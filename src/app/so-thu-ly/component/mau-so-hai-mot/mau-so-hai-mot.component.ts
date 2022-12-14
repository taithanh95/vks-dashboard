import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbDateAdapter, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../../common/service/common.service';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {CustomAdapter, CustomDateParserFormatter, DateService} from '../../../common/util/date.service';
import {ApParam, Book04, Book21, Book21Search, ColsTable} from '../../model/so-thu-ly.model';
import {Decision, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {DatePipe} from '@angular/common';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';


@Component({
  selector: 'app-mau-so-hai-mot',
  templateUrl: './mau-so-hai-mot.component.html',
  providers: [DatePipe,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class MauSoHaiMotComponent implements OnInit {
  constructor(
    private customDateParserFormatter: CustomDateParserFormatter,
    private customAdapter: CustomAdapter,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private dateService: DateService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) {
    this.listReport = new Array<Book21>();
    this.listQuyetDinh = new Array<Decision>();
    this.listVienKiemSat = new Array<Spp>();
  }

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  searchModel: Book21Search = {
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  listReport: Book21[];
  inProgress: boolean = false;
  listQuyetDinhLocalStorage: Decision[];
  listQuyetDinh: Decision[];
  quyetDinhSelected = [];
  vienKiemSat: Spp;
  listVienKiemSat: Spp[];
  listApParam: ApParam[];
  sppIdSelected: string;
  colsTable: ColsTable[];
  copylistOfData: Book21[];
// khai bao du lieu ban dau de tim kiem
  responseData: Book21[];
  isLoading = false;
  editId: number;
  btnDisable: boolean;

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;

  ngOnInit(): void {
    this.listVienKiemSat = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    const decisions: Decision[] = JSON.parse(localStorage.getItem('quyet_dinh'));
    const decisionsInBook21: string[] = ['5702', '5706', '5707', '5708', '5709', '9917', '9918', '6126', '5908',
      '5712', '5129', '5619', '5130', '5131'];
    if (decisions.length > 0) {
      this.listQuyetDinh = decisions.filter((decision: Decision) => decisionsInBook21.includes(decision.deciId));
    }
    this.sppIdSelected = this.listVienKiemSat[0].sppId;
    // for (let i = 0; i < this.listQuyetDinhLocalStorage.length; i++) {
    //   if (this.listQuyetDinhLocalStorage[i].deciId === '5702' || this.listQuyetDinhLocalStorage[i].deciId === '5706'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '5707 '
    //     || this.listQuyetDinhLocalStorage[i].deciId === '5708' || this.listQuyetDinhLocalStorage[i].deciId === '5709'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '9917'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '9918' || this.listQuyetDinhLocalStorage[i].deciId === '6126'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '5908'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '5712' || this.listQuyetDinhLocalStorage[i].deciId === '5129'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '5619'
    //     || this.listQuyetDinhLocalStorage[i].deciId === '5130' || this.listQuyetDinhLocalStorage[i].deciId === '5131') {
    //     this.listQuyetDinh.push(this.listQuyetDinhLocalStorage[i]);
    //   }
    // }
    // for (let i = 0; i < this.listQuyetDinh.length; i++) {
    //   this.listQuyetDinh.push(this.listQuyetDinh[i]);
    // }
    this.getParams();
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
        title: 'Ng??y b???t t???m gi??? (3)',
        width: '8%'
      },
      {
        title: 'C??c tr?????ng h???p b???t (4)',
        width: '12%'
      },
      {
        title: 'B???t kh??ng c?? c??n c???, tr??i PL;Vi ph???m th???m quy???n;Vi ph???m th??? t???c, tr??nh t??? (5)',
        width: '12%'
      },
      {
        title: 'Q?? t???m gi??? (S???; ng??y, th??ng, n??m; C?? quan ra Q??; T??? ng??y ?????n ng??y) (6)',
        width: '12%'
      },
      {
        title: 'L?? do t???m gi??? (7)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh gia h???n t???m gi??? l???n 1 (8)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh  gia h???n t???m gi??? l???n 2 (9)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh ph?? chu???n Quy???t ?????nh gia h???n t???m gi??? (S???; ng??y, th??ng, n??m) (10)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh h???y b??? bi???n ph??p t???m gi???; Kh??ng ph?? chu???n gia h???n t???m gi??? (S???; ng??y, th??ng, n??m; C?? quan ra quy???t ?????nh; L?? do) (11)',
        width: '10%'
      },
      {
        title: 'Chuy???n ??i n??i kh??c (Ng??y, th??ng, n??m; L?? do) (12)',
        width: '10%'
      },
      {
        title: 'N??i kh??c chuy???n ?????n (Ng??y, th??ng, n??m; L?? do) (13)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh ADBPNC kh??c (S???; ng??y, th??ng, n??m) (14)',
        width: '10%'
      },
      {
        title: 'L???nh t???m giam (S???; ng??y, th??ng, n??m) (15)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh tr??? t??? do (S???; ng??y, th??ng, n??m; L?? do; C?? quan tr??? t??? do) (16)',
        width: '10%'
      },
      {
        title: 'Quy???t ?????nh tr??? t??? do c???a VKS (S???; ng??y, th??ng, n??m; L?? do) (17)',
        width: '10%'
      },
      {
        title: 'Tr???n ng??y, th??ng, n??m (18)',
        width: '8%'
      },
      {
        title: 'Quy???t ?????nh truy n?? (S???; ng??y, th??ng, n??m) (19)',
        width: '10%'
      },
      {
        title: 'Ng??y b???t l???i (20)',
        width: '8%'
      },
      {
        title: 'Quy???t ?????nh x??? l?? khi b???t l???i (S???; ng??y, th??ng, n??m) (21)',
        width: '10%'
      },
      {
        title: 'Ng??y vi ph???m, n???i dung vi ph???m (22)',
        width: '11%'
      },
      {
        title: 'Quy???t ?????nh x??? l?? vi ph???m (S???; ng??y, th??ng, n??m; H??nh th???c x??? l??) (23)',
        width: '11%'
      },
      {
        title: 'Ch???t (Ng??y, th??ng, n??m; Nguy??n nh??n ch???t) (24)',
        width: '11%'
      },
      {
        title: 'Ghi ch?? (25)',
        width: '6%'
      },
      {
        title: ' '
      }
    ];
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
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

  getParams() {
    this.constantService.postRequest(this.constantService.SOTHULY_URI + 'dm/ApParam/getParams'
      , {
        'code': 'ARREST_TYPE'
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.listApParam = resJson.responseData;
          } else {
            this.toastrService.warning(resJson.responseMessage);
          }
        }
      )
      .catch(err => {
      });
  }

  public checkValidate() {
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
    const maVienKiemSat = this.getSppId();
    if (!maVienKiemSat) {
      this.toastrService.warning('Ch??a ch???n ????n v???');
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

  getListQuyetDinh() {
    const listQuyetDinh = [];
    this.quyetDinhSelected.forEach((currentValue, index) => {
      listQuyetDinh.push(currentValue);
    });
    return listQuyetDinh;
  }

  getSppId() {
    if (this.sppIdSelected != null) {
      return this.sppIdSelected;
    } else {
      return null;
    }
  }

  getListData() {
    if (this.checkValidate() === false) {
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book21/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'arrestName': this.searchModel.arrestName,
        'arrestType': this.searchModel.arrestType,
        'fromDateDecision': this.datePipe.transform(this.searchModel.fromDateDecision, 'dd/MM/yyyy'),
        'toDateDecision': this.datePipe.transform(this.searchModel.toDateDecision, 'dd/MM/yyyy'),
        'unitId': this.getSppId(),
        'decisionIdList': this.getListQuyetDinh(),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listReport = resJson.responseData;
          this.totalRecords = this.listReport.length;
          this.responseData = resJson.responseData;
          this.listReport.length ? this.btnDisable = true : this.btnDisable = false;

        } else {
          this.toastrService.warning(resJson.responseMessage);
          this.listReport = new Array<Book21>();
          this.totalRecords = this.listReport.length;
          this.responseData = resJson.responseData;
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book21/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'arrestName': this.searchModel.arrestName,
        'arrestType': this.searchModel.arrestType,
        'fromDateDecision': this.datePipe.transform(this.searchModel.fromDateDecision, 'dd/MM/yyyy'),
        'toDateDecision': this.datePipe.transform(this.searchModel.toDateDecision, 'dd/MM/yyyy'),
        'unitId': this.getSppId(),
        'decisionIdList': this.getListQuyetDinh(),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_21_s???_ki???m_s??t_vi???c_thi_h??nh_t???m_gi???_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book21/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'arrestName': this.searchModel.arrestName,
        'arrestType': this.searchModel.arrestType,
        'fromDateDecision': this.datePipe.transform(this.searchModel.fromDateDecision, 'dd/MM/yyyy'),
        'toDateDecision': this.datePipe.transform(this.searchModel.toDateDecision, 'dd/MM/yyyy'),
        'unitId': this.getSppId(),
        'decisionIdList': this.getListQuyetDinh(),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_21_s???_ki???m_s??t_vi???c_thi_h??nh_t???m_gi???_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          // tslint:disable-next-line:max-line-length
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book21/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'arrestName': this.searchModel.arrestName,
        'arrestType': this.searchModel.arrestType,
        'fromDateDecision': this.datePipe.transform(this.searchModel.fromDateDecision, 'dd/MM/yyyy'),
        'toDateDecision': this.datePipe.transform(this.searchModel.toDateDecision, 'dd/MM/yyyy'),
        'unitId': this.getSppId(),
        'decisionIdList': this.getListQuyetDinh(),
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_21_s???_ki???m_s??t_vi???c_thi_h??nh_t???m_gi???_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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

  coppyData() {
    return this.copylistOfData = this.responseData;
  }

// ham tim kiem du lieu
  search(search) {
    const targetValue: any[] = [];
    let stt = 1;
    this.coppyData().forEach((value: any) => {
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search.toLowerCase())) {
          targetValue.push({...value,stt: stt++});
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

  convertTimeToBeginningOfTheDay(date: Date): Date {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(item: Book21): void {
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
        'arresteeId': item.n_arrestee_id,
        'bookCode': '21',
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
