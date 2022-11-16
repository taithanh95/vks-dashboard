import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestReport} from '../../../../common/model/base.model';
import {ReportDetail} from '../../../models/report-detail';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.css']
})
export class EditReportComponent implements OnInit {
  @Input() item: RequestReport;
  dataSet!: ReportDetail[];
  isLoading = false;
  @Output() data: EventEmitter<ReportDetail[]> = new EventEmitter<ReportDetail[]>();

  innerHtml: SafeHtml;
  base64Pdf: any;
  isVisible = false;

  constructor(private constantService: ConstantService,
              private toastrService: ToastrService,
              private sanitizer: DomSanitizer,
              private modal: NzModalRef) {
  }

  ngOnInit(): void {
  }

  onViewReport() {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/requestReportPdf/'
      , {
        'id': this.item.id
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
  }

  onViewReportManual() {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestPeriodReport/requestReportPdfManual/'
      , {
        'id': this.item.id
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
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }
}
