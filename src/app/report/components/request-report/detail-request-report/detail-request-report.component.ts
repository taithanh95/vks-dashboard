import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../../common/constant/constant';
import {DefaultTreeviewI18n, TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {RequestReport, ResponseBody} from '../../../../common/model/base.model';
import {DateService} from '../../../../common/util/date.service';

@Component({
  selector: 'app-detail-request-report',
  templateUrl: './detail-request-report.component.html',
  styleUrls: ['./detail-request-report.component.css'],
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
export class DetailRequestReportComponent implements OnInit {
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
  isCheck: string;
  isCheckTypeReport: string;
  lstLawGroup: any;
  lstLaw: any;
  isVisibleSPP = false;
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
    this.formData.disable();
    this.getVienKiemSatByUsername().then(() => {
      this.getDetail();
    });
  }

  initForm(): void {
    this.formData = this.fb.group({
      reportCode: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      createdAt: [null, [Validators.required]],
      paperType: [null],
      createdBy: [null],
      position: [null],
      signature: [null],
      reportType: [null],
      lawId: null,
      codeId: null,
      groupId: null,
      sppIdList: [this.listSppId, [Validators.required]],
      option: [null],

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
      this.lstVKS = resp.responseData.map(v => {
        return new TreeviewItem({
          text: v.text,
          value: v.value,
          checked: false,
          children: v.children
        });
      });
      // this.lstVKS = resp.responseData;
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
            parent.disabled = parent.value !== requestReport.reportInput.sppId;
            if (parent.children && parent.children.length) {
              parent.children.forEach(parent1 => {
                parent1.checked = parent1.value === requestReport.reportInput.sppId;
                parent1.disabled = parent1.value !== requestReport.reportInput.sppId;
                if (parent1.children && parent1.children.length) {
                  parent1.children.forEach(parent2 => {
                    parent2.checked = parent2.value === requestReport.reportInput.sppId;
                    parent2.disabled = parent2.value !== requestReport.reportInput.sppId;
                  });
                }
              });
            }
          });
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

  get fromDate(): AbstractControl {
    return this.formData.get('fromDate');
  }

  get toDate(): AbstractControl {
    return this.formData.get('toDate');
  }
  onReportChange(value: any): void {
    this.isCheck = value;
  }
  closeDialog(): void {
    this.modal.destroy({data: 'this the result data'});
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
  isCheckOption(option) {
    this.isVisibleSPP = option === '4' ? true : false;
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
}
