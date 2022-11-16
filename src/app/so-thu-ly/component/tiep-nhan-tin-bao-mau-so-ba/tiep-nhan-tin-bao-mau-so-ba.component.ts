import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {DateService} from '../../../common/util/date.service';
import {Book03, Book03Search, ColsTable} from '../../model/so-thu-ly.model';
import {Decision, Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
  selector: 'app-tiep-nhan-tin-bao-mau-so-ba',
  templateUrl: './tiep-nhan-tin-bao-mau-so-ba.component.html',
  providers: [
    DatePipe
  ]
})
export class TiepNhanTinBaoMauSoBaComponent implements OnInit {
  constructor(
    private constantService: ConstantService,
    private dateService: DateService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) {
    this.listReport = new Array<Book03>();
    this.listQuyetDinh = new Array<Decision>();
    this.listVienKiemSat = new Array<Spp>();
  }
  btnDisable: boolean;
  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  pageSize: number = 10;
  searchModel: Book03Search = {
    maDonVi: null,
    fromDate: this.dateService.getFirstDayOfYearVKS(),
    toDate: this.dateService.getCurrentDate()
  };
  listReport: Book03[];
  inProgress: boolean = false;
  listQuyetDinh: Decision[];
  listVienKiemSat: Spp[];
  sppIdSelected: string;
  vienKiemSat: Spp;
  colsTable: ColsTable[];
  copylistOfData: Book03[];
// khai bao du lieu ban dau de tim kiem
  responseData: Book03[];
  editId: number;

  ngOnInit(): void {
    this.listVienKiemSat = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    this.sppIdSelected = this.listVienKiemSat[0].sppId;
    this.addFocusInput();
    this.colsTable = [
      {
        title: 'STT (1)',
        width: '3%'
      },
      {
        title: 'Ngày Viện kiểm sát tiếp nhận (2)',
        width: '6%'
      },
      {
        title: 'Họ và tên, địa chỉ cá nhân, cơ quan, tổ chức cung cấp tin báo tố giác tội phạm, kiến nghị khởi tố (3)',
        width: '10%'
      },
      {
        title: 'Tóm tắt nội dung sự việc (4)',
        width: '32%'
      },
      {
        title: 'Họ và tên, địa chỉ người, pháp nhân bị tố giác (5)',
        width: '10%'
      },
      {
        title: 'Người tiếp nhận (6)',
        width: '6%'
      },
      {
        title: 'Phiếu chuyển tin (Số, ngày, tháng, năm...) (7)',
        width: '9%'
      },
      {
        title: 'Kết quả giải quyết(Số, ngày, tháng, năm...) (8)',
        width: '16%'
      },
      {
        title: 'Ghi chú (9)'
      }
    ];
  }

  public checkValidate() {
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

    const maVienKiemSat = this.getSppId();
    if (!maVienKiemSat) {
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

  getSppId() {
    if (!this.sppIdSelected) {
      return null;
    }
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
    this.totalRecords = 0;
    this.currentPage = 1;
    this.listReport = [];
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book03/requestReport/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
        'maDonVi': this.getSppId()
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listReport = resJson.responseData;
          this.responseData = resJson.responseData;
          this.totalRecords = this.listReport.length;
          this.listReport.length ? this.btnDisable = true : this.btnDisable = false;
        } else {
          this.listReport = new Array<Book03>();
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

  exportPdf(): void {
    if (this.checkValidate() === false) {
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book03/requestReportPdf/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
//        'danhSachMaQuyetDinh': this.getListQuyetDinh(),
        'maDonVi': this.getSppId()
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_03_tiếp_nhận_tin_báo_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book03/requestReportExcel/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
//        'danhSachMaQuyetDinh': this.getListQuyetDinh(),
        'maDonVi': this.getSppId()
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_03_tiếp_nhận_tin_báo_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'book03/requestReportDocx/'
      , {
        'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
        'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
        'nguoiToCao': this.searchModel.nguoiToCao,
        'nguoiBiToCao': this.searchModel.nguoiBiToCao,
//        'danhSachMaQuyetDinh': this.getListQuyetDinh(),
        'maDonVi': this.getSppId()
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/docx;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Sổ_03_tiếp_nhận_tin_báo_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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
          targetValue.push({...value, stt: stt++});
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

  stringToDateWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(item: Book03): void {
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
        'denouncementId': item.denouncementId,
        'bookCode': '03',
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
