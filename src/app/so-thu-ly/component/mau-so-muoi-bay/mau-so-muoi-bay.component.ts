import {Component, OnInit, ViewChild} from '@angular/core';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateService} from '../../../common/util/date.service';
import {Spp} from '../../../category/model/category.model';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {DatePipe} from '@angular/common';
import {Book13, Book17, Book17Search, ColsTable} from '../../model/so-thu-ly.model';
import {WebUtilRemoveFisrtSpace} from '../../../common/util/remove-first-space.class';

@Component({
    selector: 'app-mau-so-muoi-bay',
    templateUrl: './mau-so-muoi-bay.component.html',
    providers: [
        DatePipe
    ]
})
export class MauSoMuoiBayComponent implements OnInit {

    @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
    @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
    @ViewChild('sppIdSelect') sppIdSelect!: NzSelectComponent;

    constructor(
        private constantService: ConstantService,
        private cookieService: CookieService,
        private dateService: DateService,
        private datePipe: DatePipe,
        private toastrService: ToastrService
    ) {
    }

    totalPages: number;
    totalRecords: number;
    currentPage: number = 1;
    recordFrom: number = 0;
    recordTo: number = 10;
    pageSize: number = 10;
    searchModel: Book17Search = {
        caseCode: null,
        caseName: null,
        accuCode: null,
        accuName: null,
        unitId: null,
        judgmentNum: null,
        fromDate: this.dateService.getFirstDayOfYearVKS(),
        toDate: this.dateService.getCurrentDate(),
        judgmentFromDate: null,
        judgmentToDate: null
    };
    listReport: Book17[] = [];
    copyListOfData: Book17[];
    responseData: Book17[];
    inProgress: boolean = false;
    listSpp: Spp[];
    colsTable: ColsTable[];
    editId: any;
    btnDisable: boolean;

    ngOnInit(): void {
        this.getVienKiemSatByUsername();
        this.colsTable = [
            {
                title: 'STT, Ngày, tháng, năm thụ lý (1)',
                width: '3%'
            },
            {
                title: 'Vụ án, việc/ Bị cáo, đương sự bị xem xét lại (2)',
                width: '12%'
            },
            {
                title: 'Bản án bị xem xét lại (Số; ngày, tháng, năm; Nội dung) (3)',
                width: '12%'
            },
            {
                title: 'Yêu cầu, kiến nghị, đề nghị (Số; ngày, tháng, năm; Cơ quan ban hành) (4)',
                width: '12%'
            },
            {
                title: 'Kết quả xem xét lại (Số; ngày, tháng, năm; Nội dung) (5)',
                width: '12%'
            },
            {
                title: 'Ghi chú (6)',
                width: '3%'
            }
        ];
    }

    getVienKiemSatByUsername() {
        this.constantService.postRequest(this.constantService.MANAGE_URI + 'spp/findByUsername/'
            , {
                'username': this.cookieService.get(this.constantService.USERNAME)
            }).toPromise()
            .then(res => res.json())
            .then(resJson => {
                if (resJson.responseCode === '0000') {
                    this.listSpp = resJson.responseData;
                    if (this.listSpp.length > 0) {
                        this.searchModel.unitId = this.listSpp[0].sppId;
                    }
                } else {
                    this.listSpp = new Array<Spp>();
                    this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
                }
            })
            .catch(() => {
                this.toastrService.error(this.constantService.SYSTEM_ERROR);
            });
    }

    public onSearch() {
        if (this.checkValidate() === false) {
            return;
        }
        this.getListData();
    }

    checkValidate(): boolean {
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

        this.searchModel.fromDate = this.convertTimeToBeginningOfTheDay(this.searchModel.fromDate);
        this.searchModel.toDate = this.convertTimeToBeginningOfTheDay(this.searchModel.toDate);

        if (this.searchModel.fromDate.getTime() > this.searchModel.toDate.getTime()) {
            this.toastrService.warning('Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
            this.fromDatePicker.open();
            return false;
        }

        if (!this.searchModel.unitId) {
            this.toastrService.warning('Chưa chọn đơn vị');
            this.sppIdSelect.onHostClick();
            return false;
        }
        return true;
    }

    getListData() {
        if (this.checkValidate() === false) {
            return;
        }

        this.totalRecords = 0;
        this.currentPage = 1;
        this.listReport = [];
        this.inProgress = true;
        this.constantService.postRequest(this.constantService.REPORT_URI + 'book17/requestReport/'
            , {
                'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
                'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
                'judgmentFromDate': this.datePipe.transform(this.searchModel.judgmentFromDate, 'dd/MM/yyyy'),
                'judgmentToDate': this.datePipe.transform(this.searchModel.judgmentToDate, 'dd/MM/yyyy'),
                'judgmentNum': this.searchModel.judgmentNum,
                'caseCode': this.searchModel.caseCode,
                'caseName': this.searchModel.caseName,
                'accuCode': this.searchModel.accuCode,
                'accuName': this.searchModel.accuName,
                'unitId': this.searchModel.unitId
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
        this.constantService.postRequest(this.constantService.REPORT_URI + 'book17/requestReportPdf/'
            , {
                'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
                'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
                'judgmentFromDate': this.datePipe.transform(this.searchModel.judgmentFromDate, 'dd/MM/yyyy'),
                'judgmentToDate': this.datePipe.transform(this.searchModel.judgmentToDate, 'dd/MM/yyyy'),
                'judgmentNum': this.searchModel.judgmentNum,
                'caseCode': this.searchModel.caseCode,
                'caseName': this.searchModel.caseName,
                'accuCode': this.searchModel.accuCode,
                'accuName': this.searchModel.accuName,
                'unitId': this.searchModel.unitId
            }).toPromise()
            .then(res => res.json())
            .then(resJson => {
                if (resJson.responseCode === '0000') {
                    const linkSource = 'data:application/pdf;base64,' + resJson.responseData;
                    const downloadLink = document.createElement('a');
                    const fileName = 'Sổ_17_sổ_quản_lý_thủ_tục_xem_xét_lại_quyết_định_của_hđtp_tòa_án_nhân_dân_tối_cao' +
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
        this.constantService.postRequest(this.constantService.REPORT_URI + 'book17/requestReportExcel/'
            , {
                'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
                'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
                'judgmentFromDate': this.datePipe.transform(this.searchModel.judgmentFromDate, 'dd/MM/yyyy'),
                'judgmentToDate': this.datePipe.transform(this.searchModel.judgmentToDate, 'dd/MM/yyyy'),
                'judgmentNum': this.searchModel.judgmentNum,
                'caseCode': this.searchModel.caseCode,
                'caseName': this.searchModel.caseName,
                'accuCode': this.searchModel.accuCode,
                'accuName': this.searchModel.accuName,
                'unitId': this.searchModel.unitId
            }).toPromise()
            .then(res => res.json())
            .then(resJson => {
                if (resJson.responseCode === '0000') {
                    const linkSource = 'data:application/excel;base64,' + resJson.responseData;
                    const downloadLink = document.createElement('a');
                    const fileName = 'Sổ_17_sổ_quản_lý_thủ_tục_xem_xét_lại_quyết_định_của_hđtp_tòa_án_nhân_dân_tối_cao' +
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
        this.constantService.postRequest(this.constantService.REPORT_URI + 'book17/requestReportDocx/'
            , {
                'fromDate': this.datePipe.transform(this.searchModel.fromDate, 'dd/MM/yyyy'),
                'toDate': this.datePipe.transform(this.searchModel.toDate, 'dd/MM/yyyy'),
                'judgmentFromDate': this.datePipe.transform(this.searchModel.judgmentFromDate, 'dd/MM/yyyy'),
                'judgmentToDate': this.datePipe.transform(this.searchModel.judgmentToDate, 'dd/MM/yyyy'),
                'judgmentNum': this.searchModel.judgmentNum,
                'caseCode': this.searchModel.caseCode,
                'caseName': this.searchModel.caseName,
                'accuCode': this.searchModel.accuCode,
                'accuName': this.searchModel.accuName,
                'unitId': this.searchModel.unitId
            }).toPromise()
            .then(res => res.json())
            .then(resJson => {
                if (resJson.responseCode === '0000') {
                    const linkSource = 'data:application/docx;base64,' + resJson.responseData;
                    const downloadLink = document.createElement('a');
                    const fileName = 'Sổ_17_sổ_quản_lý_thủ_tục_xem_xét_lại_quyết_định_của_hđtp_tòa_án_nhân_dân_tối_cao' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.docx';
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

    copyData(): Book17[] {
        return this.copyListOfData = this.responseData;
    }

    /*
     * Tim kiem du lieu
     */
    search(searchKeyword: string): void {
        const filteredList: Book17[] = [];
        this.copyData().forEach((value: Book17) => {
            const propValueList = Object.values(value);
            for (let i = 0; i < propValueList.length; i++) {
                if (propValueList[i] && propValueList[i].toString().toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1) {
                    filteredList.push(value);
                    break;
                }
            }
        });
        if (filteredList.length === 0) {
            this.toastrService.warning('Không tìm thấy dữ liệu cần tra cứu');
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

    onJudgmentFromDateValueChange(event: any): void {
        const value = event.target.value;
        if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
            if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
                this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
                this.searchModel.judgmentFromDate = null;
                return;
            }
            const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
            if (isNaN(date.getTime())) {
                this.toastrService.warning('Ngày tháng không hợp lệ.');
                this.searchModel.judgmentFromDate = null;
                return;
            } else {
                this.searchModel.judgmentFromDate = date;
            }
        }
    }

    onJudgmentToDateValueChange(event: any): void {
        const value = event.target.value;
        if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
            if (!value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && (value.includes('/') && value.length >= 10)) {
                this.toastrService.warning('Sai định dạng ngày tháng dd/MM/yyyy.');
                this.searchModel.judgmentToDate = null;
                return;
            }
            const date: Date = this.stringToDateWithFormat(value, 'DDMMYYYY');
            if (isNaN(date.getTime())) {
                this.toastrService.warning('Ngày tháng không hợp lệ.');
                this.searchModel.judgmentToDate = null;
                return;
            } else {
                this.searchModel.judgmentToDate = date;
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

  startEdit(id: string, regicode?: string): void {
    this.editId = {casecode:id ,regicode: regicode};
  }

  checkEditNt = (id: string, regicode?: string) => id === this.editId?.casecode && regicode === this.editId?.regicode

  stopEdit(item: Book17): void {
    this.editId = null;
    item.s_column_6 = WebUtilRemoveFisrtSpace.onHandle(item.s_column_6);
    if (item.s_column_6 && item.s_column_6.length > 200) {
      this.toastrService.warning('Nội dung ghi chú không vượt quá 200 ký tự!');
      item.s_column_6 = null;
      return;
    }
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'notebook/createOrUpdate/'
      , {
        'casecode': item.s_casecode,
        'regicode': item.s_regicode,
        'bookCode': '17',
        'note': item.s_column_6
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
