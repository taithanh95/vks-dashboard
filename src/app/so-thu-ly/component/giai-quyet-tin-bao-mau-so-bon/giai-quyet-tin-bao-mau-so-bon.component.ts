import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {CommonService} from '../../../common/service/common.service';
import {DateService} from '../../../common/util/date.service';
import {Book03, Book04, Book04Search, ColsTable} from '../../model/so-thu-ly.model';
import {Decision, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-giai-quyet-tin-bao-mau-so-bon',
  templateUrl: './giai-quyet-tin-bao-mau-so-bon.component.html',
  providers: [
    DatePipe
  ]
})
export class GiaiQuyetTinBaoMauSoBonComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  searchModel: Book04Search = {
    maDonVi: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  listReport: Book04[] = [];
  inProgress: boolean = false;
  listDecision: Decision[] = [];
  listSpp: Spp[] = [];
  colsTable!: ColsTable[];
  copylistOfData: Book04[] = [];
// khai bao du lieu ban dau de tim kiem
  responseData: Book04[] = [];
  btnDisable: boolean;
  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;
  editId: number;

  constructor(
    private constantService: ConstantService,
    private commonService: CommonService,
    private dateService: DateService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    this.listDecision = JSON.parse(localStorage.getItem('quyet_dinh'));
    this.searchModel.maDonVi = this.listSpp[0].sppId;
    this.addFocusInput();
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '3%'
      },
      {
        title: 'Ng??y VKS th??? l?? (2)',
        width: '6%'
      },
      {
        title: 'H??? v?? t??n, ?????a ch??? c?? nh??n, c?? quan, t??? ch???c cung c???p tin b??o, t??? gi??c t???i ph???m (3)',
        width: '11%'
      },
      {
        title: 'T??m t???t n???i dung s??? vi???c (4)',
        width: '11%'
      },
      {
        title: 'H??? v?? t??n, ?????a ch??? ng?????i, ph??p nh??n b??? t??? gi??c (5)',
        width: '11%'
      },
      {
        title: 'H??? t??n Ki???m s??t vi??n th??? l?? (6)',
        width: '11%'
      },
      {
        title: 'Y??u c???u c???a Vi???n ki???m s??t (7)',
        width: '11%'
      },
      {
        title: 'Q?? gia h???n th???i h???n gi???i quy???t ngu???n tin v??? t???i ph???m (8)',
        width: '11%'
      },
      {
        title: 'Q?? t???m ????nh ch??? vi???c gi???i quy???t ngu???n tin v??? t???i ph???m (9)',
        width: '11%'
      },
      {
        title: 'Q?? h???y b??? Q?? t???m ????nh ch??? vi???c gi???i quy???t ngu???n tin v??? t???i ph???m (10)',
        width: '11%'
      },
      {
        title: 'Q?? ph???c h???i vi???c gi???i quy???t tin b??o, t??? gi??c t???i ph???m, ki???n ngh??? kh???i t??? (11)',
        width: '10%'
      },
      {
        title: 'Q?? gi???i quy???t tranh ch???p v??? th???m quy???n (12)',
        width: '10%'
      },
      {
        title: 'Th??ng b??o: Ki???m s??t Quy???t ?????nh kh???i t???/ Kh??ng kh???i t??? /T???m ????nh ch??? gi???i quy???t t??? gi??c, tin b??o??? (13)',
        width: '11%'
      },
      {
        title: 'Y??u c???u Kh???i t??? v??? ??n/Kh??ng kh???i t???/H???y b??? Q?? kh???i t??? v??? ??n h??nh s??? (14)',
        width: '11%'
      },
      {
        title: 'K???t qu??? th???c hi???n y??u c???u c???a VKS (15)',
        width: '10%'
      },
      {
        title: 'K???t qu??? gi???i quy???t (Kh???i t???; Kh??ng kh???i t???) (16)',
        width: '10%'
      },
      {
        title: 'Ghi ch?? (17)',
        width: '6%'
      },
      {
        title: ' '
      }
    ];
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

  handleFromDateOpenChange(open: boolean): void {
    if (!open && this.searchModel.fromDate) {
      this.toDatePicker.open();
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

    if (!this.searchModel.maDonVi) {
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

  getListData() {
    if (this.checkValidate() === false) {
      return;
    }
    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book04/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
        'danhSachMaQuyetDinh': this.searchModel.decisionIdList,
        'maDonVi': this.searchModel.maDonVi
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book04/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
        'danhSachMaQuyetDinh': this.searchModel.decisionIdList,
        'maDonVi': this.searchModel.maDonVi
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_04_gi???i_quy???t_tin_b??o_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book04/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
        'danhSachMaQuyetDinh': this.searchModel.decisionIdList,
        'maDonVi': this.searchModel.maDonVi
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_04_gi???i_quy???t_tin_b??o_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book04/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
        'danhSachMaQuyetDinh': this.searchModel.decisionIdList,
        'maDonVi': this.searchModel.maDonVi
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'S???_04_gi???i_quy???t_tin_b??o_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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

  onResize({width}: NzResizeEvent, col: string): void {
    this.colsTable = this.colsTable.map(e => (e.title === col ? {...e, width: `${width}px`} : e));
  }

  addFocusInput() {
    document.getElementById('fromDate').focus();
  }

  // ham coppy responseData de tim kiem, trong do this.responseData la du lieu ban dau
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

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(item: Book04): void {
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
        'denouncementId': item.denouncementId,
        'bookCode': '04',
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
