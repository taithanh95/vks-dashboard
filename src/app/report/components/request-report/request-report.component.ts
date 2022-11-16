/* tslint:disable:max-line-length */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../common/constant/constant';
import {DatePipe} from '@angular/common';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {CreateRequestReportComponent} from './create-request-report/create-request-report.component';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {DateService} from '../../../common/util/date.service';
import {ResponseCode} from '../../../common/constant/response-code';
import {RequestReport, ResponseBody} from '../../../common/model/base.model';
import {DetailRequestReportComponent} from './detail-request-report/detail-request-report.component';
import {UpdateRequestReportComponent} from './update-request-report/update-request-report.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {UpdateReportComponent} from './update-report/update-report.component';

@Component({
  selector: 'app-bao-cao-search-list',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.css']
})
export class RequestReportComponent implements OnInit {
  isLoading = false;
  colsTable: any;
  lstReportCode: any = Constant.LST_REPORT_CODE;
  lstReportStatus: any = Constant.LST_REPORT_STATUS;
  lstRequestReport: RequestReport[] = [];
  totalPages = 1;
  totalElements = 0;
  pageNumber = 1;
  pageSize = 10;
  formData: FormGroup;
  isVisible = false;
  selectedItem?: RequestReport;
  setOfCheckedId = new Set<number>();
  innerHtml: SafeHtml;
  base64Pdf: any;
  scroll = null;
  RPT_OLD = ['04', '10', '11', '12'];

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private datePipe: DatePipe,
    private dateService: DateService,
    private sanitizer: DomSanitizer) {
  }

  async ngOnInit() {
    this.initFormAndTable();
    const listRequestReportNewAndProcessing = <RequestReport[]>(await this.getListRequestReportNewAndProcessing());
    if (listRequestReportNewAndProcessing && listRequestReportNewAndProcessing.length > 0) {
      localStorage.setItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING, JSON.stringify(listRequestReportNewAndProcessing));
    } else {
      localStorage.setItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING, JSON.stringify(new Array<RequestReport>()));
    }
    setInterval(async () => {
      const requestReports: RequestReport[] =
        JSON.parse(localStorage.getItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING));
      if (requestReports && requestReports.length > 0) {
        for (const x of requestReports) {
          const result = <Boolean>(await this.checkRequestReportStatus(x));
          // nếu yêu cầu đã chuyển sang trạng thái hoàn thành thì thực hiện remove khỏi danh sách theo dõi
          if (result) {
            const index = requestReports.indexOf(x);
            requestReports.splice(index, 1);
            // Cập nhật lại Danh sách
            this.getListReport(this.formData.value);
          }
        }
        localStorage.setItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING, JSON.stringify(requestReports));
      }
    }, 3000);
  }

  async checkRequestReportStatus(requestReport: RequestReport) {
    const request = <RequestReport>(await this.findById(requestReport.id));
    return new Promise((resolve) => {
      let done = false;
      if (request && request.status !== requestReport.status) {
        if (request.status === 3) {
          this.toastrService.success('Mã yêu cầu ' + requestReport.id + ' của Biểu ' + requestReport.reportCode + '/2019 đã xử lý thành công.');
          done = true;
        } else if (request.status === 2) {
          this.toastrService.warning('Mã yêu cầu ' + requestReport.id + ' của Biểu ' + requestReport.reportCode + '/2019 bắt đầu xử lý.');
        } else if (request.status === 4) {
          done = true;
          this.toastrService.error('Mã yêu cầu ' + requestReport.id + ' của Biểu ' + requestReport.reportCode + '/2019 đã xử lý KHÔNG thành công.');
        }
      }
      resolve(done);
    });
  }

  initFormAndTable(): void {
    this.formData = this.fb.group({
      reportCode: [null],
      beginAt: [this.dateService.getFirstDayOfMonth(), [Validators.required]],
      endAt: [this.dateService.getCurrentDate(), [Validators.required]],
      status: [null],
    });
    this.getListReport(this.formData.value);
    this.colsTable = [
      // {
      //   title: 'Chọn',
      //   width: '3%'
      // },
      {
        title: 'STT',
        width: '3%'
      },
      {
        title: 'Mã yêu cầu',
        width: '6%'
      },
      {
        title: 'Biểu thống kê số',
        width: '10%'
      },
      {
        title: 'Thời gian yêu cầu',
        width: '10%'
      },
      {
        title: 'Thời gian thực hiện',
        width: '10%'
      },
      {
        title: 'Thời gian hoàn thành',
        width: '10%'
      },
      {
        title: 'Trạng thái',
        width: '6%'
      },
      {
        title: 'Thao tác',
        width: '10%'
      }];
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.error('Sai định dạng ngày tháng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringendAtWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.error('Ngày tháng không hợp lệ.');
        formControl.setValue(null);
        return;
      } else {
        formControl.setValue(date);
      }
    }
  }

  dateToString(date: Date | string): string {
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'dd/MM/yyyy');
    } else {
      return this.datePipe.transform(this.convertTimeToBeginningOfTheDay(date), 'dd/MM/yyyy');
    }
  }

  stringendAtWithFormat(inputString: string, format: string): Date {
    return moment(inputString, format).toDate();
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  convertTimeToBeginningOfTheDay(date: Date | string): Date {
    if (date instanceof Date) {
      date.setHours(0, 0, 0, 0);
    } else {
      date = this.stringendAtWithFormat(date, 'dd/MM/yyyy');
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  getTotalPagesOfList(): number {
    return Math.ceil(this.lstRequestReport.length / this.pageSize);
  }

  getTotalElements(): number {
    return this.lstRequestReport.length;
  }

  onChangePageIndex(pageNumber: number): void {
    this.pageNumber = pageNumber;
  }

  onChangePageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  onSearch(request: RequestReport): void {
    for (const key in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(key)) {
        this.formData.controls[key].markAsDirty();
        this.formData.controls[key].updateValueAndValidity();
      }
    }
    if (this.formData.invalid) {
      this.toastrService.warning('Vui lòng nhập các trường bắt buộc đánh dấu *');
    } else {
      const beginAt = this.convertTimeToBeginningOfTheDay(request.beginAt);
      const endAt = this.convertTimeToBeginningOfTheDay(request.endAt);
      if (beginAt.getTime() > endAt.getTime()) {
        this.toastrService.warning('Từ ngày phải nhỏ hơn đến ngày');
        this.beginAt.setValue(null);
        return;
      }
      if (beginAt.getTime() > new Date().getTime()) {
        this.toastrService.warning(`Từ ngày không lớn hơn ngày hiện tại ${this.dateService.dateToString(new Date(), 'DD/MM/YYYY')}`);
        this.beginAt.setValue(null);
        return;
      }
      if (endAt.getTime() > new Date().getTime()) {
        this.toastrService.warning(`Đến ngày không lớn hơn ngày hiện tại ${this.dateService.dateToString(new Date(), 'DD/MM/YYYY')}`);
        this.endAt.setValue(null);
        return;
      }
      this.getListReport(request);
    }
  }

  getListReport(request: RequestReport): void {
    this.isLoading = true;
    request.beginAt = this.dateService.dateToString(this.beginAt.value, 'HH:mm:ss DD/MM/YYYY');
    request.endAt = this.dateService.dateToString(this.endAt.value, 'HH:mm:ss DD/MM/YYYY');
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/getList/', request)
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.scroll = {x: '1200px', y: '240px'};
          this.lstRequestReport = respJson.responseData;
          this.totalPages = this.getTotalPagesOfList();
          this.totalElements = this.getTotalElements();
        } else if (respJson.responseCode === '0007') {
          this.toastrService.warning(respJson.responseMessage);
          this.lstRequestReport = null;
          this.totalPages = 1;
          this.totalElements = 0;
        } else {
          this.toastrService.warning(respJson.responseMessage);
        }
        this.isLoading = false;
      }).catch(() => {
      this.toastrService.error(this.constantService.SYSTEM_ERROR);
      this.isLoading = false;
    });
  }

  getListRequestReportNewAndProcessing() {
    return new Promise((resolve) => {
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/getListRequestReportNewAndProcessing/', {})
        .toPromise().then(resp => resp.json())
        .then((respJson: ResponseBody) => {
          if (respJson.responseCode === ResponseCode.SUCCESS) {
            resolve(respJson.responseData);
          } else {
            resolve(new Array<RequestReport>());
          }
        }).catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    });
  }

  findById(id: number) {
    return new Promise((resolve) => {
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/findById/', {id: id})
        .toPromise().then(resp => resp.json())
        .then((respJson: ResponseBody) => {
          if (respJson.responseCode === ResponseCode.SUCCESS) {
            resolve(respJson.responseData);
          }
        }).catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    });
  }

  get beginAt(): AbstractControl {
    return this.formData.get('beginAt');
  }

  get endAt(): AbstractControl {
    return this.formData.get('endAt');
  }

  get reportCode(): AbstractControl {
    return this.formData.get('reportCode');
  }

  showModal(item?: RequestReport): void {
    const modalRef = this.modal.create({
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzTitle: 'Gửi yêu cầu báo cáo',
      nzContent: CreateRequestReportComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzFooter: [
        {
          label: 'Ghi lại',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn lưu dữ liệu không?',
            nzOkType: 'default',
            nzOkText: 'Có',
            nzOnOk: () => modalRef.getContentComponent().onSubmit(),
            nzCancelText: 'Không',
            nzOnCancel: () => modalRef.destroy(),
          })
        },
        {
          label: 'Hủy bỏ',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.getListReport(this.formData.value);
    });
  }

  showModalCreate(filter?: RequestReport): void {
    const modalRef = this.modal.create({
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzTitle: 'Gửi yêu cầu báo cáo',
      nzContent: CreateRequestReportComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        filter
      },
      nzFooter: [
        {
          label: 'Ghi lại',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn lưu dữ liệu không?',
            nzOkType: 'default',
            nzOkText: 'Có',
            nzOnOk: () => modalRef.getContentComponent().onSubmit(),
            nzCancelText: 'Không',
            nzOnCancel: () => modalRef.destroy(),

          })
        },
        {
          label: 'Hủy bỏ',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.getListReport(this.formData.value);
    });
  }

  showModalView(item: RequestReport): void {
    const modalRef = this.modal.create({
      nzTitle: 'Xem yêu cầu báo cáo',
      nzContent: DetailRequestReportComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzFooter: [
        {
          label: 'Đóng',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
  }

  showModalUpdate(item: RequestReport): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cập nhật yêu cầu báo cáo',
      nzContent: UpdateRequestReportComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzFooter: [
        {
          label: 'Ghi lại',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn lưu dữ liệu không?',
            nzOkType: 'default',
            nzOkText: 'Có',
            nzOnOk: () => modalRef.getContentComponent().onSubmit(),
            nzCancelText: 'Không',
            nzOnCancel: () => modalRef.destroy(),
          })
        },
        {
          label: 'Hủy bỏ',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.getListReport(this.formData.value);
    });
  }

  showDeleteConfirm(id: number): void {
    const modalRef: NzModalRef = this.modal.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa bản ghi không?',
      nzClosable: false,
      nzAutofocus: null,
      nzOkType: 'default',
      nzOkText: 'Không',
      nzOnOk: () => modalRef.destroy(),
      nzCancelText: 'Có',
      nzOnCancel: () => {
        setTimeout(() => {
          this.isLoading = true;
          this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/delete/', {id})
            .toPromise().then(resp => resp.json())
            .then((respJson: ResponseBody) => {
              if (respJson.responseCode === ResponseCode.SUCCESS) {
                this.toastrService.success('Xóa thành công');
                // Xóa bản ghi khỏi danh sách theo dõi
                const requestReports: RequestReport[] =
                  JSON.parse(localStorage.getItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING));
                if (requestReports && requestReports.length > 0) {
                  requestReports.forEach(x => {
                    if (x.id === id) {
                      const index = requestReports.indexOf(x);
                      requestReports.splice(index, 1);
                    }
                  });
                  localStorage.setItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING, JSON.stringify(requestReports));
                }
                this.getListReport(this.formData.value);
              } else {
                this.toastrService.warning(respJson.responseMessage);
              }
              this.isLoading = false;
            }).catch(() => {
            this.toastrService.error(this.constantService.SYSTEM_ERROR);
            this.isLoading = false;
          });
          modalRef.close();
        }, 1000);
      }
    });
    modalRef.afterClose.subscribe(() => {
      this.getListReport(this.formData.value);
    });
  }

  onSelect(item: RequestReport): void {
    this.selectedItem = item;
    this.onItemChecked(item.id, true);
  }

  onItemChecked(id: number, checked: boolean): void {
    this.lstRequestReport.forEach(item => {
      if (item.id !== id) {
        this.updateCheckedSet(item.id, false);
      } else {
        if (checked) {
          this.selectedItem = item;
        } else {
          this.selectedItem = null;
        }
        this.updateCheckedSet(item.id, checked);
      }
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  exportPdf(item: RequestReport): void {
    this.isLoading = true;
    if (item.reportCode) {
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/requestReportPdf/'
        , {
          'id': item.id
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
            const downloadLink = document.createElement('a');
            let fileName = '';
            if (item.reportCode === '01') {
              fileName = 'BIỂU_01_THỐNG_KÊ_THỰC_HÀNH_QUYỀN_CÔNG_TỐ_KIẾM_SÁT_VIỆC_TIẾP_NHẬN_GIẢI_QUYẾT_TỐ_GIÁC_TIN_BÁO_VỀ_TỘI_PHẠM_KIẾN_NGHỊ_KHỞI_TỐ_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '07') {
              fileName = 'BIỂU_07_THỐNG_KÊ_KIỂM_SÁT_VIỆC_TẠM_GIỮ,_TẠM_GIAM_VÀ_THI_HÀNH_ÁN_HÌNH_SỰ_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '08') {
              fileName = 'BIỂU_08_THỐNG_KÊ_GIẢI_QUYẾT_TỐ_GIÁC_TIN_BÁO_TỘI_PHẠM_KIẾN_NGHỊ_KHỞI_TỐ_CỦA_CƠ_QUAN_ĐIỀU_TRA_VIỆN_KIỂM_SÁT_NHÂN_DÂN_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '09') {
              fileName = 'BIỂU_09_THỐNG_KÊ_KẾT_QUẢ_ĐIỀU_TRA_CÁC_VỤ_ÁN_HÌNH_SỰ_CỦA_CƠ_QUAN_ĐIỀU_TRA_VIỆN_KIỂM_SÁT_NHÂN_DÂN_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '33') {
              fileName = 'BIỂU_33_THỐNG_KÊ_VI_PHẠM_PHÁP_LUẬT_TRONG_HOẠT_ĐỘNG_TƯ_PHÁP_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '02') {
              fileName = 'BIỂU_02_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '03') {
              fileName = 'BIỂU_03_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '06') {
              fileName = 'BIỂU_06_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '11') {
              fileName = 'BIỂU_11_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '12') {
              fileName = 'BIỂU_12_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '10') {
              fileName = 'BIỂU_10_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '04') {
              fileName = 'BIỂU_04_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '05') {
              fileName = 'BIỂU_05_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            }
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          } else {
            this.toastrService.warning(resJson.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
          this.isLoading = false;
        });
    }
  }

  onViewReport(item: RequestReport) {
    if (this.RPT_OLD.includes(item.reportCode)) {
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/requestReportPdf/'
        , {
          'id': item.id
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.base64Pdf = 'data:application/pdf;base64,' + resJson.responseData;
            this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
              `<object data="${this.base64Pdf}" type="application/pdf" class="w-100" height="650">Không đọc được file pdf</object>`);
            this.isVisible = !this.isVisible;
          } else {
            this.toastrService.warning(resJson.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
          this.isLoading = false;
        });
    } else {
      this.onUpdateReport(item);
    }
  }

  onUpdateReport(item: RequestReport) {
    const modalRef = this.modal.create({
      nzTitle: 'BIỂU SỐ ' + item.reportCode,
      nzContent: UpdateReportComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzFooter: [
        {
          label: 'Đóng',
          type: 'default',
          onClick: () => modalRef.destroy()
        },
        {
          label: 'Xem báo cáo hiệu chỉnh',
          type: 'primary',
          loading: false,
          onClick(): void {
            this.loading = true;
            modalRef.getContentComponent().onViewReportManual();
            setTimeout(() => (this.loading = false), 1000);
          }
        },
        {
          label: 'Xem báo cáo hệ thống',
          type: 'primary',
          loading: false,
          onClick(): void {
            this.loading = true;
            modalRef.getContentComponent().onViewReport();
            setTimeout(() => (this.loading = false), 1000);
          }
        }
      ]
    });
    modalRef.afterClose.subscribe(() => {
      this.getListReport(this.formData.value);
    });
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
