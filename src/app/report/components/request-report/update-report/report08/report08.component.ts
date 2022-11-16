import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestReport, ResponseBody} from '../../../../../common/model/base.model';
import {ReportDetail} from '../../../../models/report-detail';
import {ResponseCode} from '../../../../../common/constant/response-code';
import {ConstantService} from '../../../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {DateService} from '../../../../../common/util/date.service';

@Component({
  selector: 'app-report08',
  templateUrl: './report08.component.html',
  styleUrls: ['./report08.component.css']
})
export class Report08Component implements OnInit {
  @Input() item: RequestReport;
  dataSet!: ReportDetail[];
  @Output() data: EventEmitter<ReportDetail[]> = new EventEmitter<ReportDetail[]>();
  isLoading = false;
  reportInput: { fromDate: string, toDate: string, sppId?: string, name?: string, signature?: string, sppname?: string } = {fromDate: null, toDate: null};
  requestReport: { createdAt: string, date: string };

  constructor(private constantService: ConstantService,
              private toastrService: ToastrService,
              private dateService: DateService) {
  }

  ngOnInit(): void {
    this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/getDetail/', {id: this.item.id})
      .toPromise().then(resp => resp.json())
      .then((respJson: ResponseBody) => {
        if (respJson.responseCode === ResponseCode.SUCCESS) {
          this.dataSet = [...respJson.responseData.reportDetails];
          this.reportInput = respJson.responseData.reportInput;
          this.requestReport = respJson.responseData.requestReport;
          this.data.emit(respJson.responseData);
        } else {
          this.toastrService.warning(respJson.responseMessage);
        }
        this.isLoading = false;
        this.isLoading = false;
      }).catch(() => {
      this.toastrService.error(this.constantService.SYSTEM_ERROR);
      this.isLoading = false;
    });
  }

  updateManual(valueManual: number, id: number): void {
    if (valueManual < 0) {
      this.toastrService.warning('Chỉ nhập số nguyên dương');
    } else {
      this.constantService.postRequest(this.constantService.REPORT_URI + 'requestReport/updateValueManual/', {
        id,
        valueManual
      })
        .toPromise().then(resp => resp.json())
        .then((respJson: ResponseBody) => {
          if (respJson.responseCode === ResponseCode.SUCCESS) {
            console.log(respJson);
          } else {
            this.toastrService.warning(respJson.responseMessage);
          }
          this.isLoading = false;
        }).catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.isLoading = false;
      });
    }
  }

  get fromDate(): Date {
    return this.dateService.stringToDateWithFormat(this.reportInput.fromDate ?
      this.reportInput.fromDate : new Date(), 'HH:mm:ss DD/MM/YYYY');
  }

  get toDate(): Date {
    return this.dateService.stringToDateWithFormat(this.reportInput.toDate ? this.reportInput.toDate : new Date(), 'HH:mm:ss DD/MM/YYYY');
  }
}
