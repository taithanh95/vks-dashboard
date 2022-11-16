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
        title: 'Vụ án/Họ và tên bị can (1)',
        width: '5%'
      },
      {
        title: 'QĐ phê chuẩn/Không phê chuẩn lệnh bắt người bị giữ trong trường hợp khẩn cấp (2)',
        width: '10%'
      },
      {
        title: 'Lệnh bắt người bị giữ trong trường hợp khẩn cấp (3)',
        width: '10%'
      },
      {
        title: 'QĐ không phê chuẩn  việc gia hạn tạm giữ (4)',
        width: '10%'
      },
      {
        title: 'QĐ phê chuẩn việc gia hạn tạm giữ Lần 1/Lần 2 (5)',
        width: '10%'
      },
      {
        title: 'QĐ hủy bỏ QĐ/Lệnh Tạm giữ (6)',
        width: '10%'
      },
      {
        title: 'QĐ trả tự do cho người bị tạm giữ (7)',
        width: '10%'
      },
      {
        title: 'QĐ phê chuẩn Lệnh bắt bị can để tạm giam (8)',
        width: '10%'
      },
      {
        title: 'QĐ không phê chuẩn Lệnh bắt bị can để tạm giam (9)',
        width: '10%'
      },
      {
        title: 'QĐ phê chuẩn lệnh tạm giam (10)',
        width: '10%'
      },
      {
        title: 'QĐ không phê chuẩn lệnh tạm giam (11)',
        width: '10%'
      },
      {
        title: 'Yêu cầu áp dụng biện pháp tạm giam bị can (12)',
        width: '10%'
      },
      {
        title: 'Lệnh bắt bị can để tạm giam (13)',
        width: '10%'
      },
      {
        title: 'QĐ gia hạn thời hạn tạm giam bị can Lần 1/Lần 2/Lần 3 (14)',
        width: '10%'
      },
      {
        title: 'QĐ gia hạn thời hạn tạm giam bị can Đặc biệt (15)',
        width: '10%'
      },
      {
        title: 'QĐ hủy bỏ biện pháp tạm giam (16)',
        width: '10%'
      },
      {
        title: 'QĐ thay thế biện pháp ngăn chặn (17)',
        width: '10%'
      },
      {
        title: 'QĐ phê chuẩn/Không phê chuẩn/Hủy bỏ biện pháp bảo lĩnh (18)',
        width: '10%'
      },
      {
        title: 'QĐ về việc bảo lĩnh (19)',
        width: '10%'
      },
      {
        title: 'QĐ phê chuẩn/Không phê chuẩn QĐ về việc đặt tiền đề bảo đảm (20)',
        width: '10%'
      },
      {
        title: 'QĐ về việc đặt tiền để bảo đảm/QĐ hủy bỏ biện pháp đặt tiền để bảo đảm (21)',
        width: '10%'
      },
      {
        title: 'Lệnh cấm đi khỏi nơi cư trú (22)',
        width: '10%'
      },
      {
        title: 'Thông báo về việc áp dụng biện pháp cấm đi khỏi nơi cư trú (23)',
        width: '10%'
      },
      {
        title: 'QĐ hủy bỏ biện pháp cấm đi khỏi nơi cư trú (24)',
        width: '10%'
      },
      {
        title: 'QĐ tạm hoãn xuất cảnh (25)',
        width: '10%'
      },
      {
        title: 'QĐ hủy bỏ biện pháp tạm hoãn xuất cảnh (26)',
        width: '10%'
      },
      {
        title: 'Lệnh tạm giam để truy tố/Thông báo về việc tạm giam bị can (27)',
        width: '10%'
      },
      {
        title: 'Lệnh bắt tạm giam bị can để truy tố (28)',
        width: '10%'
      },
      {
        title: 'QĐ gia hạn thời hạn tạm giam để truy tố (29)',
        width: '10%'
      },
      {
        title: 'QĐ áp giải bị can (30)',
        width: '10%'
      },
      {
        title: 'QĐ dẫn giải (31)',
        width: '10%'
      },
      {
        title: 'Lệnh kê biên tài sản (32)',
        width: '10%'
      },
      {
        title: 'Lệnh khám xét (33)',
        width: '10%'
      },
      {
        title: 'QĐ hủy bỏ biện pháp kê biên tài sản (34)',
        width: '10%'
      },
      {
        title: 'Lệnh phong tỏa tài khoản (35)',
        width: '10%'
      },
      {
        title: 'QĐ hủy bỏ biện pháp phong tỏa tài khoản (36)',
        width: '10%'
      },
      {
        title: 'Ghi chú (37)',
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
              * Loại bỏ các fields không cần thiết mà chỉ lấy 2 fields để đổ ra ComboBox
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
               * Loại bỏ các fields không cần thiết mà chỉ lấy 2 fields để đổ ra ComboBox
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
               * Loại bỏ các fields không cần thiết mà chỉ lấy 2 fields để đổ ra ComboBox
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
   * Sự kiện Bộ luật thay đổi
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
   * Sự kiện Điều luật thay đổi
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
      this.toastrService.warning('Yêu cầu chọn Bộ luật trước');
    }
  }

  /*
   * Sự kiện Khoản thay đổi
   */
  onItemChange(value: any): void {
    this.searchModel.lawPoint = null;
    this.listLawPoint = [];
    this.loadMoreLawPoint();
  }

  handleItemOpenChange(open: boolean): void {
    if (open && !this.searchModel.lawId) {
      this.toastrService.warning('Yêu cầu chọn Điều luật trước');
    }
  }

  /*
   * Sự kiện Điểm thay đổi
   */
  handlePointChange(): void {
    if (open && !this.searchModel.lawItem) {
      this.toastrService.warning('Yêu cầu chọn Khoản trước');
    }
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
          const fileName = 'Sổ_06_sổ_đăng_ký_lệnh_quyết_định_văn_bản_về_áp_dụng_biện_pháp_ngăn_chặn_biện_pháp_cưỡng_chế_' +
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
          const fileName = 'Sổ_06_sổ_đăng_ký_lệnh_quyết_định_văn_bản_về_áp_dụng_biện_pháp_ngăn_chặn_biện_pháp_cưỡng_chế_' +
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
          const fileName = 'Sổ_06_sổ_đăng_ký_lệnh_quyết_định_văn_bản_về_áp_dụng_biện_pháp_ngăn_chặn_biện_pháp_cưỡng_chế_'
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
      this.toastrService.warning('Không tìm thấy dữ liệu cần tra cứu');
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
      this.toastrService.warning('Nội dung ghi chú không vượt quá 200 ký tự!');
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
