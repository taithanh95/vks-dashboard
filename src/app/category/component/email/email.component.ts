import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Email, EmailSearch} from '../../model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {DateService} from '../../../common/util/date.service';
import * as moment from 'moment';
import {Moment} from 'moment';
import {DatePipe} from '@angular/common';
import {DetailEmailComponent} from './detail-email/detail-email.component';

declare var $: any;


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  searchModel: EmailSearch;
  listData: Email[];
  inProgress: boolean = false;
  content: string;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,
    private dateService: DateService
  ) {
    this.listData = new Array<Email>();
    this.searchModel = {status: -1, toAddress: '', subject: ''};
  }

  ngOnInit(): void {
    this.searchModel.fromDate = this.dateService.getFirstDayOfMonthInString('YYYY-MM-DD');
    this.searchModel.toDate = this.dateService.getCurrentDateInString('YYYY-MM-DD');
    this.getListData();
  }

  public onSearch() {
    if (!this.searchModel.fromDate) {
      this.toastrService.success( 'Chưa nhập từ ngày');
      return;
    }
    if (!this.searchModel.toDate) {
      this.toastrService.success( 'Chưa nhập đến ngày');
      return;
    }
    const fromDate: Moment = moment(this.searchModel.fromDate);
    const toDate: Moment = moment(this.searchModel.toDate);
    if (fromDate > toDate) {
      this.toastrService.success( 'Từ ngày phải nhỏ hơn đến ngày');
      return;
    }
    this.getListData();
  }

  getListData() {
    this.inProgress = true;
    const fromDate = new DatePipe('en-US').transform(this.searchModel.fromDate, 'dd/MM/yyyy');
    const toDate = new DatePipe('en-US').transform(this.searchModel.toDate, 'dd/MM/yyyy');
    this.constantService.postRequest(this.constantService.NOTIFICATION_URI + 'email/getList/'
      , {
        'fromDate': fromDate,
        'toDate': toDate,
        'subject': this.searchModel.subject,
        'toAddress': this.searchModel.toAddress,
        'status': this.searchModel.status
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
          this.totalRecords = this.listData.length;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Email>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
        this.inProgress = false;
      });
  }


  public viewContent(id: number) {
    this.constantService.postRequest(this.constantService.NOTIFICATION_URI + 'email/getContentById/'
      , {
        'id': id
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          let popupWin;
          popupWin = window.open();
          popupWin.document.open();
          popupWin.document.write(resJson.responseData);
          popupWin.document.close();
          /* window.close(); */
          const modalRef = this.modalService.open(popupWin, {size: 'xl'});
          modalRef.result.then(() => {
          }, () => {
          });
        } else {
          // tslint:disable-next-line:max-line-length
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
      });
  }

  public addData() {
    const modalRef = this.modalService.open(DetailEmailComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailEmailComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
    }, () => {
    });
  }

  public onPageChange(event) {
    this.currentPage = event;
    this.recordTo = (this.currentPage * 10) - (10 - this.listData.length);
    this.recordFrom = this.currentPage - 1;
  }

  numberKeyEvent(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }
  }
}
