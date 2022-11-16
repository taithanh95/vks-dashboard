import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {RequestReport, ResponseBody} from '../../../../common/model/base.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../../common/constant/constant';
import {DefaultTreeviewI18n, TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {DateService} from '../../../../common/util/date.service';
import {differenceInCalendarDays} from 'date-fns';
import {ResponseCode} from '../../../../common/constant/response-code';

@Component({
  selector: 'app-create-report-period',
  templateUrl: './create-report-period.component.html',
  styleUrls: ['./create-report-period.component.css'],
  providers: [
    {
      provide: TreeviewI18n, useValue: Object.assign(new DefaultTreeviewI18n(), {
        getFilterPlaceholder(): string {
          return 'Tìm kiếm trong danh sách';
        },
        getAllCheckboxText(): string {
          return 'Tất cả';
        },
        getFilterNoItemsFoundText(): string {
          return 'Danh sách rỗng';
        },
        getTooltipCollapseExpandText(isCollapse: boolean): string {
          return isCollapse ? 'Mở rộng' : 'Thu nhỏ';
        }
        // also override other methods if needed
        // getText(selection: TreeviewSelection): string;
        // getAllCheckboxText(): string;
        // getFilterPlaceholder(): string;
        // getFilterNoItemsFoundText(): string;
        // getTooltipCollapseExpandText(isCollapse: boolean): string;
      })
    }
  ]
})
export class CreateReportPeriodComponent implements OnInit {
  @Input() item: RequestReport = null;
  @Input() filter: RequestReport = null;
  formData: FormGroup;
  lstReportCode: any = Constant.LST_REPORT_CODE_PERIOD;
  lstReportPeriod: any = Constant.LST_REPORT_PERIOD;
  lstVKS: TreeviewItem[];
  listSppId: number[];
  configTreeView = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
    maxHeight: 250
  });
  isLoading = false;
  isVisibleSPP = false;
  sppId: any;
  isCheck: string;
  isCheckTypeReport: string;
  lstLawGroup: any;
  lstLaw: any;
  RPT_OLD = ['02', '03', '04', '05', '06', '10', '11', '12'];

  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private toastrService: ToastrService,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private dateService: DateService) {
    this.sppId = this.cookieService.get(this.constantService.ID_SPP);
  }

  ngOnInit(): void {
    this.initForm();
    this.getVienKiemSatByUsername().then(() => {
      if (this.item) {
        this.getDetail();
      } else if (this.filter) {
        this.getDataFilter();
      }
    });
  }

  initForm(): void {
    this.formData = this.fb.group({
      reportCode: [null, [Validators.required]],
      reportPeriod: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      createdAt: [null, [Validators.required]],
      reportType: [null],
      paperType: [null],
      createdBy: [null],
      position: [null],
      signature: [null],
      sppIdList: [this.listSppId, [Validators.required]],
      option: [null],
      groupId: [null],
      codeId: [null],
      lawId: [null],
    });
  }

  async getVienKiemSatByUsername(): Promise<void> {
    this.isLoading = true;
    const data = await this.constantService.postRequest(this.constantService.MANAGE_URI + 'spp/findAllTreeView/'
      , {
        'sppId': this.sppId
      }).toPromise();
    const resp: ResponseBody = data.json();
    if (resp.responseCode === '0000') {
      const treeView: TreeviewItem[] = [];
      resp.responseData.forEach(v => {
        const item = new TreeviewItem({
          text: v.text,
          value: v.value,
          checked: false,
          children: v.children
        });
        item.setCheckedRecursive(false);
        treeView.push(item);
      });
      this.lstVKS = treeView;
      this.isLoading = false;
    } else {
      this.toastrService.warning(resp.responseMessage);
      this.isLoading = false;
    }
  }

  getDetail(): void {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/detail/', {id: this.item.id})
      .toPromise().then(res => res.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          const requestReport: RequestReport = resp.responseData;
          this.formData.get('reportCode').setValue(requestReport.reportCode);
          this.formData.get('reportType').setValue(requestReport.reportType=='1'?'1':'2');
          this.isCheckTypeReport = this.item.reportType;
          requestReport.reportInput.fromDate = this.dateService.stringToDateWithFormat(requestReport.reportInput.fromDate,
            'HH:mm:ss DD/MM/YYYY');
          requestReport.reportInput.toDate = this.dateService.stringToDateWithFormat(requestReport.reportInput.toDate,
            'HH:mm:ss DD/MM/YYYY');
          requestReport.reportInput.createdAt = this.dateService.stringToDateWithFormat(requestReport.reportInput.createdAt,
            'DD/MM/YYYY');

          this.formData.patchValue(requestReport.reportInput);
          this.onInputLawGroup();
          this.onChangeInputLaw();
          this.lstVKS.forEach(parent => {
            parent.checked = parent.value === requestReport.reportInput.sppId;
            if (parent.children && parent.children.length) {
              parent.children.forEach(parent1 => {
                parent1.checked = parent1.value === requestReport.reportInput.sppId;
                if (parent1.children && parent1.children.length) {
                  parent1.children.forEach(parent2 => {
                    parent2.checked = parent2.value === requestReport.reportInput.sppId;
                  });
                }
              });
            }
          });
          this.selectedChange();
          this.isLoading = false;
        } else {
          this.toastrService.warning(resp.responseMessage);
          this.isLoading = false;
        }
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.isLoading = false;
      });
  }

  getDataFilter() {
    let beginAt, endAt;
    if (typeof this.filter.beginAt === 'string' && typeof this.filter.endAt === 'string') {
      beginAt = this.dateService.stringToDateWithFormat(this.filter.beginAt, 'HH:mm:ss DD/MM/YYYY');
      endAt = this.dateService.stringToDateWithFormat(this.filter.endAt, 'HH:mm:ss DD/MM/YYYY');
    } else {
      beginAt = this.filter.beginAt;
      endAt = this.filter.endAt;
    }
    this.formData.get('reportCode').setValue(this.filter.reportCode);
    this.formData.get('fromDate').setValue(beginAt);
    this.formData.get('toDate').setValue(endAt);
  }

  onFilterChange(value: string): void {
  }

  selectedChange(): void {
    const listId = new Array<number>();
    this.lstVKS.forEach(x => {
      if (x.checked) {
        listId.push(x.value);
      }
      if (x.children && x.children.length > 0) {
        x.children.forEach(y => {
          if (y.checked) {
            listId.push(y.value);
          }
          if (y.children && y.children.length > 0) {
            y.children.forEach(z => {
              if (z.checked) {
                listId.push(z.value);
              }
            });
          }
        });
      }
    });
    this.listSppId = listId;
    this.formData.get('sppIdList').setValue(this.listSppId);
  }

  onDateValueChange(event: Event, formControl: AbstractControl): void {
    const value = (event.target as HTMLInputElement).value;
    try {
      if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
        const date = this.dateService.stringToDate(value);
        if (formControl === this.fromDate) {
          formControl.setValue(date.setHours(0, 0, 0));
        } else {
          formControl.setValue(date);
        }
      }
    } catch (error) {
      this.toastrService.error(error.message);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  get reportCode(): AbstractControl {
    return this.formData.get('reportCode');
  }

  get fromDate(): AbstractControl {
    return this.formData.get('fromDate');
  }

  get toDate(): AbstractControl {
    return this.formData.get('toDate');
  }

  get createdAt(): AbstractControl {
    return this.formData.get('createdAt');
  }

  get sppIdList(): AbstractControl {
    return this.formData.get('sppIdList');
  }

  onSubmit(): void {
    this.setLstSpp();
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.valid) {
      console.log('rrrrrrrrrrrrrrrrrrrrr');
      if (this.convertTimeToBeginningOfTheDay(this.fromDate.value).getTime() > this.toDate.value.getTime()) {
        this.toastrService.warning('Yêu cầu giá trị từ ngày phải nhỏ hơn hoặc bằng đến ngày');
        this.fromDatePicker.open();
        return;
      }
      if (this.convertTimeToBeginningOfTheDay(this.fromDate.value).getTime() > new Date().getTime()) {
        this.toastrService.warning('Yêu cầu giá trị từ ngày nhỏ hơn hoặc bằng ngày hiện tại');
        this.fromDatePicker.open();
        return;
      }
      if (this.convertTimeToBeginningOfTheDay(this.toDate.value).getTime() > new Date().getTime()) {
        this.toastrService.warning('Yêu cầu giá trị đến ngày nhỏ hơn hoặc bằng ngày hiện tại');
        this.toDatePicker.open();
        return;
      }
      if (this.reportCode.value == '04' || this.reportCode.value == '10' || this.reportCode.value == '11' || this.reportCode.value == '12') {
        if (!this.formData.value.reportType) {
          this.toastrService.warning('Vui lòng chọn Kiểu báo cáo');
          return;
        }
      }
      const genId = Date.now() + '';
      const request = {
        reportCode: this.reportCode.value,
        reportInput: {
          ...this.formData.value,
          reportCode: null,
          sppname: this.cookieService.get(this.constantService.SPP_NAME),
          createdAt: this.dateService.dateToString(this.createdAt.value, 'DD/MM/YYYY'),
          fromDate: this.dateService.dateToString(this.dateService.getBeginningOfDay(this.fromDate.value), 'HH:mm:ss DD/MM/YYYY'),
          toDate: this.dateService.dateToString(this.dateService.getEndOfDay(this.toDate.value), 'HH:mm:ss DD/MM/YYYY')
        },
        genId: '',
        reportType: '',
        reportTypeUrl: '',
        reportLevel: null,
        sppId: '',
        fromDate: this.formatDate(this.fromDate.value),
        toDate: this.formatDate(this.toDate.value),
        beginAt: this.dateService.dateToString(new Date(), 'HH:mm:ss DD/MM/YYYY'),
        endAt: null
      };
      console.log(request);
      const code = this.formData.value.reportCode;
      const typeReport = this.formData.value.reportType;
      let rptcode = '';
      let rptTypeUrl = '';
      rptcode = (code === '02' && typeReport === '2') ? 'BIEU22019' :
        (code === '03' && typeReport === '2') ? 'BIEU32019' :
          (code === '04' && typeReport === '2') ? 'BIEU42019' :
            (code === '05' && typeReport === '2') ? 'BIEU52019' :
              (code === '06' && typeReport === '2') ? 'BIEU62019' :
                (code === '10' && typeReport === '2') ? 'BIEU102019_1' :
                  (code === '11' && typeReport === '2') ? 'BIEU112019' :
                    (code === '12' && typeReport === '2') ? 'BIEU122019' : '1';
      rptTypeUrl = (code === '02') ? 'BIEU22019' :
        (code === '03') ? 'BIEU32019' :
          (code === '04') ? 'BIEU42019' :
            (code === '05') ? 'BIEU52019' :
              (code === '06') ? 'BIEU62019' :
                (code === '10') ? 'BIEU102019_1' :
                  (code === '11') ? 'BIEU112019' :
                    (code === '12') ? 'BIEU122019' : null;

      if (this.RPT_OLD.includes(code)) {
        request.genId = genId;
        request.reportType = rptcode;
        request.reportTypeUrl = rptTypeUrl;
        let level = this.formData.value.option;
        if (level === '4') {
          level = '';
          const lstSpp = this.formData.value.sppIdList;
          for (const spp of lstSpp) {
            level += ('' + spp + ';');
          }
        }
        request.reportLevel = level;
        request.sppId = this.sppId;

        this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/requestReportAPI', request).toPromise().then(resp => resp.json());
      }
      this.createRequestReport(request);
    } else {
      this.toastrService.warning('Dữ liệu nhập không hợp lệ. Vui lòng nhập lại');
    }
  }

  createRequestReport(request) {
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/create/', request).toPromise()
      .then(resp => resp.json())
      .then(resJson => {
        if (resJson.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success('Thêm mới thành công');
          // Thêm yêu cầu vào danh sách theo dõi
          let listRequestReportNewAndProcessing: RequestReport[] =
            JSON.parse(localStorage.getItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING));
          if (!listRequestReportNewAndProcessing || listRequestReportNewAndProcessing.length === 0) {
            listRequestReportNewAndProcessing = new Array<RequestReport>();
          }
          listRequestReportNewAndProcessing.push(resJson.responseData);
          localStorage.setItem(this.constantService.LIST_REQUEST_REPORT_NEW_AND_PROCESSING,
            JSON.stringify(listRequestReportNewAndProcessing));
          this.closeDialog();
          this.resetForm();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error('Hệ thống không có phản hồi.');
        this.isLoading = false;
      });
  }

  changeStatus(genId: String, status: Number) {
    this.constantService.getRequest(this.constantService.REPORT_URI + `requestPeriodReport/changeStatus?genId=${genId}&status=${status}`)
      .toPromise()
      .then(resp => resp.json())
      .then(resJson => {
        if (resJson.responseCode === ResponseCode.SUCCESS) {
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.isLoading = false;
      });
  }

  convertTimeToBeginningOfTheDay(date: Date): Date {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  resetForm(): void {
    this.formData.reset();
  }

  closeDialog(): void {
    this.modal.destroy({data: 'this the result data'});
  }

  isCheckOption(option) {
    this.isVisibleSPP = option === '4' ? true : false;
  }

  setLstSpp() {
    if (!this.isVisibleSPP) {
      this.formData.get('sppIdList').setValue([this.sppId]);
    }
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('');
  }

  onReportChange(value: any): void {
    this.isCheck = value;
  }

  onReportTypeChange(value: any): void {
    this.isCheckTypeReport = value;
  }

  onInputLawGroup(): void {
    this.constantService.get('SppAccused/getListLawGroup', {code: this.formData.get('codeId').value}).subscribe(res => {
      if (res) {
        this.lstLawGroup = res;
      } else {
        this.lstLawGroup = [];
      }
    });
  }

  onChangeInputLaw(): void {
    const payload = {
      size: 10,
      page: 0,
      groupId: this.formData.get('groupId').value
    };
    this.constantService.get('/dm/LstLaw/getList', payload).subscribe(res => {
      if (res) {
        this.lstLaw = res.datas;
      } else {
        this.lstLaw = [];
      }
    });
  }

  onInputLaw(value: string): void {
    const payload = {
      size: 10,
      page: 0,
      groupId: this.formData.get('groupId').value,
      lawName: value
    };
    this.constantService.get('/dm/LstLaw/getList', payload).subscribe(res => {
      if (res) {
        this.lstLaw = res.datas;
      } else {
        this.lstLaw = [];
      }
    });
  }

  toLawOption(l) {
    return `${l.lawId === null ? '' : 'Điều ' + l.lawId}${l.item === null || l.item === 0 ? '' : (' - Khoản ' + l.item)}${l.point === null ? '' : (' - Điểm ' + l.point)}${l.lawId === null ? '' : ' - ' + l.lawName}`;
  }
}
