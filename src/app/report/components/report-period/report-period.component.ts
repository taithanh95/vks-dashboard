import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constant} from '../../../common/constant/constant';
import {RequestReport, ResponseBody} from '../../../common/model/base.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {DatePipe} from '@angular/common';
import {DateService} from '../../../common/util/date.service';
import * as moment from 'moment';
import {ResponseCode} from '../../../common/constant/response-code';
import {UpdateReportComponent} from '../request-report/update-report/update-report.component';
import {CreateReportPeriodComponent} from './create-report-period/create-report-period.component';
import {DetailReportPeriodComponent} from './detail-report-period/detail-report-period.component';
import {UpdateReportPeriodComponent} from './update-report-period/update-report-period.component';

@Component({
  selector: 'app-report-period',
  templateUrl: './report-period.component.html',
  styleUrls: ['./report-period.component.css']
})
export class ReportPeriodComponent implements OnInit {
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
          // n???u y??u c???u ???? chuy???n sang tr???ng th??i ho??n th??nh th?? th???c hi???n remove kh???i danh s??ch theo d??i
          if (result) {
            const index = requestReports.indexOf(x);
            requestReports.splice(index, 1);
            // C???p nh???t l???i Danh s??ch
            this.getListReport(this.formData.value);
          }
        }
        localStorage.setItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING, JSON.stringify(requestReports));
      }
    }, 300000);
  }

  async checkRequestReportStatus(requestReport: RequestReport) {
    const request = <RequestReport>(await this.findById(requestReport.id));
    return new Promise((resolve) => {
      let done = false;
      if (request && request.status !== requestReport.status) {
        if (request.status === 3) {
          this.toastrService.success('M?? y??u c???u ' + requestReport.id + ' c???a Bi???u ' + requestReport.reportCode + '/2019 ???? x??? l?? th??nh c??ng.');
          done = true;
        } else if (request.status === 2) {
          this.toastrService.warning('M?? y??u c???u ' + requestReport.id + ' c???a Bi???u ' + requestReport.reportCode + '/2019 b???t ?????u x??? l??.');
        } else if (request.status === 4) {
          done = true;
          this.toastrService.error('M?? y??u c???u ' + requestReport.id + ' c???a Bi???u ' + requestReport.reportCode + '/2019 ???? x??? l?? KH??NG th??nh c??ng.');
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
      //   title: 'Ch???n',
      //   width: '3%'
      // },
      {
        title: 'STT',
        width: '3%'
      },
      {
        title: 'M?? y??u c???u',
        width: '6%'
      },
      {
        title: 'B??o c??o s???',
        width: '5%'
      },
      {
        title: 'Th???i gian y??u c???u',
        width: '10%'
      },
      {
        title: 'Th???i gian th???c hi???n',
        width: '10%'
      },
      {
        title: 'Th???i gian ho??n th??nh',
        width: '10%'
      },
      {
        title: 'Tr???ng th??i',
        width: '6%'
      },
      {
        title: 'Thao t??c',
        width: '12%'
      }];
  }

  onDateValueChange(event: any, formControl: AbstractControl): void {
    const value = event.target.value;
    if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
      if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
        this.toastrService.error('Sai ?????nh d???ng ng??y th??ng dd/MM/yyyy.');
        formControl.setValue(null);
        return;
      }
      const date: Date = this.stringendAtWithFormat(value, 'DDMMYYYY');
      if (isNaN(date.getTime())) {
        this.toastrService.error('Ng??y th??ng kh??ng h???p l???.');
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
      this.toastrService.warning('Vui l??ng nh???p c??c tr?????ng b???t bu???c ????nh d???u *');
    } else {
      const beginAt = this.convertTimeToBeginningOfTheDay(request.beginAt);
      const endAt = this.convertTimeToBeginningOfTheDay(request.endAt);
      if (beginAt.getTime() > endAt.getTime()) {
        this.toastrService.warning('T??? ng??y ph???i nh??? h??n ?????n ng??y');
        this.beginAt.setValue(null);
        return;
      }
      if (beginAt.getTime() > new Date().getTime()) {
        this.toastrService.warning(`T??? ng??y kh??ng l???n h??n ng??y hi???n t???i ${this.dateService.dateToString(new Date(), 'DD/MM/YYYY')}`);
        this.beginAt.setValue(null);
        return;
      }
      if (endAt.getTime() > new Date().getTime()) {
        this.toastrService.warning(`?????n ng??y kh??ng l???n h??n ng??y hi???n t???i ${this.dateService.dateToString(new Date(), 'DD/MM/YYYY')}`);
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/getList/', request)
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
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/getListRequestReportNewAndProcessing/', {})
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
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/findById/', {id: id})
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
      nzTitle: 'G???i y??u c???u b??o c??o',
      nzContent: CreateReportPeriodComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzFooter: [
        {
          label: 'Ghi l???i',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'X??c nh???n',
            nzContent: 'B???n c?? ch???c ch???n mu???n l??u d??? li???u kh??ng?',
            nzOkType: 'default',
            nzOkText: 'C??',
            nzOnOk: () => modalRef.getContentComponent().onSubmit(),
            nzCancelText: 'Kh??ng',
            nzOnCancel: () => modalRef.destroy(),
          })
        },
        {
          label: 'H???y b???',
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
      nzTitle: 'G???i y??u c???u b??o c??o',
      nzContent: CreateReportPeriodComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        filter
      },
      nzFooter: [
        {
          label: 'Ghi l???i',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'X??c nh???n',
            nzContent: 'B???n c?? ch???c ch???n mu???n l??u d??? li???u kh??ng?',
            nzOkType: 'default',
            nzOkText: 'C??',
            nzOnOk: () => modalRef.getContentComponent().onSubmit(),
            nzCancelText: 'Kh??ng',
            nzOnCancel: () => modalRef.destroy(),

          })
        },
        {
          label: 'H???y b???',
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
      nzTitle: 'Xem y??u c???u b??o c??o',
      nzContent: DetailReportPeriodComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzFooter: [
        {
          label: '????ng',
          type: 'default',
          onClick: () => modalRef.destroy()
        }
      ]
    });
  }

  showModalUpdate(item: RequestReport): void {
    const modalRef = this.modal.create({
      nzTitle: 'C???p nh???t y??u c???u b??o c??o',
      nzContent: UpdateReportPeriodComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzFooter: [
        {
          label: 'Ghi l???i',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'X??c nh???n',
            nzContent: 'B???n c?? ch???c ch???n mu???n l??u d??? li???u kh??ng?',
            nzOkType: 'default',
            nzOkText: 'C??',
            nzOnOk: () => modalRef.getContentComponent().onSubmit(),
            nzCancelText: 'Kh??ng',
            nzOnCancel: () => modalRef.destroy(),
          })
        },
        {
          label: 'H???y b???',
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
      nzTitle: 'X??c nh???n',
      nzContent: 'B???n c?? ch???c ch???n mu???n x??a b???n ghi kh??ng?',
      nzClosable: false,
      nzAutofocus: null,
      nzOkType: 'default',
      nzOkText: 'Kh??ng',
      nzOnOk: () => modalRef.destroy(),
      nzCancelText: 'C??',
      nzOnCancel: () => {
        setTimeout(() => {
          this.isLoading = true;
          this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/delete/', {id})
            .toPromise().then(resp => resp.json())
            .then((respJson: ResponseBody) => {
              if (respJson.responseCode === ResponseCode.SUCCESS) {
                this.toastrService.success('X??a th??nh c??ng');
                // X??a b???n ghi kh???i danh s??ch theo d??i
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
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/requestReportPdf/'
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
              fileName = 'BI???U_01_TH???NG_K??_TH???C_H??NH_QUY???N_C??NG_T???_KI???M_S??T_VI???C_TI???P_NH???N_GI???I_QUY???T_T???_GI??C_TIN_B??O_V???_T???I_PH???M_KI???N_NGH???_KH???I_T???_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '07') {
              fileName = 'BI???U_07_TH???NG_K??_KI???M_S??T_VI???C_T???M_GI???,_T???M_GIAM_V??_THI_H??NH_??N_H??NH_S???_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '08') {
              fileName = 'BI???U_08_TH???NG_K??_GI???I_QUY???T_T???_GI??C_TIN_B??O_T???I_PH???M_KI???N_NGH???_KH???I_T???_C???A_C??_QUAN_??I???U_TRA_VI???N_KI???M_S??T_NH??N_D??N_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '09') {
              fileName = 'BI???U_09_TH???NG_K??_K???T_QU???_??I???U_TRA_C??C_V???_??N_H??NH_S???_C???A_C??_QUAN_??I???U_TRA_VI???N_KI???M_S??T_NH??N_D??N_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '33') {
              fileName = 'BI???U_33_TH???NG_K??_VI_PH???M_PH??P_LU???T_TRONG_HO???T_?????NG_T??_PH??P_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '02') {
              fileName = 'BI???U_02_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '03') {
              fileName = 'BI???U_03_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '06') {
              fileName = 'BI???U_06_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '11') {
              fileName = 'BI???U_11_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '12') {
              fileName = 'BI???U_12_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '10') {
              fileName = 'BI???U_10_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '04') {
              fileName = 'BI???U_04_' +
                this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.pdf';
            } else if (item.reportCode === '05') {
              fileName = 'BI???U_05_' +
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
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/requestReportPdf/'
        , {
          'id': item.id
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.base64Pdf = 'data:application/pdf;base64,' + resJson.responseData;
            this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
              `<object data="${this.base64Pdf}" type="application/pdf" class="w-100" height="650">Kh??ng ?????c ???????c file pdf</object>`);
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
      nzTitle: 'BI???U S??? ' + item.reportCode,
      nzContent: UpdateReportComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        item
      },
      nzClassName: 'modal-xl',
      nzWidth: '960px',
      nzFooter: [
        {
          label: '????ng',
          type: 'default',
          onClick: () => modalRef.destroy()
        },
        {
          label: 'Xem b??o c??o hi???u ch???nh',
          type: 'primary',
          loading: false,
          onClick(): void {
            this.loading = true;
            modalRef.getContentComponent().onViewReportManual();
            setTimeout(() => (this.loading = false), 1000);
          }
        },
        {
          label: 'Xem b??o c??o h??? th???ng',
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
