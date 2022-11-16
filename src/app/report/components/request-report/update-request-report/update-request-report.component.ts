import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import {RequestReport, ResponseBody} from '../../../../common/model/base.model';

@Component({
  selector: 'app-update-request-report',
  templateUrl: './update-request-report.component.html',
  styleUrls: ['./update-request-report.component.css'],
  providers: [
    {
      provide: TreeviewI18n , useValue: Object.assign(new DefaultTreeviewI18n(), {
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
export class UpdateRequestReportComponent implements OnInit {
  @Input() item: RequestReport;
  formData: FormGroup;
  lstReportCode: any = Constant.LST_REPORT_CODE;
  lstVKS: TreeviewItem[];
  configTreeView = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
    maxHeight: 250
  });
  isLoading = false;
  @ViewChild('fromDatePicker') fromDatePicker!: NzDatePickerComponent;
  @ViewChild('toDatePicker') toDatePicker!: NzDatePickerComponent;
  listSppId: number[];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private toastrService: ToastrService,
    private constantService: ConstantService,
    private cookieService: CookieService,
    private dateService: DateService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getVienKiemSatByUsername().then(() => {
      this.getDetail();
    });
  }

  initForm(): void {
    this.formData = this.fb.group({
      id: [null],
      requestReportId: [null],
      reportCode: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      createdAt: [null, [Validators.required]],
      paperType: [null],
      createdBy: [null],
      position: [null],
      signature: [null],
      sppIdList: [null, [Validators.required]],
    });
  }

  async getVienKiemSatByUsername(): Promise<void> {
    this.isLoading = true;
    const data = await this.constantService.postRequest(this.constantService.MANAGE_URI + 'spp/findAllTreeView/'
      , {
        'sppId': this.cookieService.get(this.constantService.ID_SPP)
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
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/detail/', {id: this.item.id})
      .toPromise().then(res => res.json())
      .then((resp: ResponseBody) => {
        if (resp.responseCode === '0000') {
          const requestReport: RequestReport = resp.responseData;
          this.formData.get('reportCode').setValue(requestReport.reportCode);
          requestReport.reportInput.fromDate = this.dateService.stringToDateWithFormat(requestReport.reportInput.fromDate,
            'HH:mm:ss DD/MM/YYYY');
          requestReport.reportInput.toDate = this.dateService.stringToDateWithFormat(requestReport.reportInput.toDate,
            'HH:mm:ss DD/MM/YYYY');
          requestReport.reportInput.createdAt = this.dateService.stringToDateWithFormat(requestReport.reportInput.createdAt,
            'DD/MM/YYYY');
          this.formData.patchValue(requestReport.reportInput);
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

  onFilterChange(value: string): void {
  }

  onDateValueChange(event: Event, formControl: AbstractControl): void {
    const value = (event.target as HTMLInputElement).value;
    try {
      if ((value.includes('/') && value.length >= 10) || (!value.includes('/') && value.length >= 8)) {
        const date = this.dateService.stringToDate(value);
        formControl.setValue(date);
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
  }

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
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.valid) {
      if (this.fromDate.value.getTime() > this.toDate.value.getTime()) {
        this.toastrService.warning('Yêu cầu giá trị từ ngày phải nhỏ hơn hoặc bằng đến ngày');
        this.fromDatePicker.open();
        return;
      }
      if (this.fromDate.value.getTime() > new Date().getTime()) {
        this.toastrService.warning('Yêu cầu giá trị từ ngày nhỏ hơn hoặc bằng ngày hiện tại');
        this.fromDatePicker.open();
        return;
      }
      if (this.toDate.value.getTime() > new Date().getTime()) {
        this.toastrService.warning('Yêu cầu giá trị từ ngày nhỏ hơn hoặc bằng ngày hiện tại');
        this.toDatePicker.open();
        return;
      }
      const request = {
        ...this.formData.value,
        createdAt: this.dateService.dateToString(this.createdAt.value, 'DD/MM/YYYY'),
        fromDate: this.dateService.dateToString(this.dateService.getBeginningOfDay(this.fromDate.value), 'HH:mm:ss DD/MM/YYYY'),
        toDate: this.dateService.dateToString(this.dateService.getEndOfDay(this.toDate.value), 'HH:mm:ss DD/MM/YYYY')
      };
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/updateReportInput/', request).toPromise()
        .then(resp => resp.json())
        .then(resJson => {
          if (resJson.responseCode === ResponseCode.SUCCESS) {
            this.toastrService.success('Cập nhật thành công');
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
    } else {
      this.toastrService.warning('Dữ liệu nhập không hợp lệ. Vui lòng nhập lại');
    }
  }

  resetForm(): void {
    this.formData.reset();
  }

  closeDialog(): void {
    this.modal.destroy({data: 'this the result data'});
  }

}
