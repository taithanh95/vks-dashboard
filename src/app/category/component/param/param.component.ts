import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Http} from '@angular/http';

import {ConstantService} from '../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Param} from '../../model/category.model';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DetailParamComponent} from './detail-param/detail-param.component';

declare var $: any;

@Component({
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.css']
})
export class ParamComponent implements OnInit, OnDestroy {
  inProgress: boolean = false;
  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  searchModel: Param;
  listData: Param[];

  constructor(private cookieService: CookieService,
              private modalService: NgbModal,
              private constantService: ConstantService,
              private toastrService: ToastrService,
              private http: Http,
              private router: Router,
              private ref: ChangeDetectorRef,
              private confirmationDialogService: ConfirmationDialogService) {
    this.listData = new Array<Param>();
    this.resetForm();
  }

  onSearch() {
    this.getListData();
  }

  ngOnInit() {
    this.getListData();
  }

  ngOnDestroy() {
  }

  upperCase() {
    this.searchModel.group.toUpperCase();
    this.searchModel.code.toUpperCase();
  }

  getListData() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'param/getListParam/'
      , this.searchModel).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Param>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
      });
  }

  resetForm() {
    this.searchModel = {group: '', code: '', value: '', name: '', status: -1};
  }

  public onPageChange(event) {
    this.currentPage = event;
    this.recordTo = (this.currentPage * 10) - (10 - this.listData.length);
    this.recordFrom = this.currentPage - 1;
  }


  public changeStatus(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của tham số này?')
      .then((confirmed) => {
          if (confirmed) {
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.CATEGORY_URI + 'param/update/'
              , {
                'id': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.toastrService.success( 'Cập nhật thành công');
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
                }
              })
              .catch(err => {
                this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
              });
            this.ref.markForCheck();
          }
        }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  // public addData() {
  //   if (this.param.group === '') {
  //     this.toastrService.success( 'Chưa nhập nhóm tham số');
  //     return;
  //   }
  //   if (this.param.code === '') {
  //     this.toastrService.success( 'Chưa nhập mã tham s');
  //     return;
  //   }
  //   if (this.param.value === '') {
  //     this.toastrService.success( 'Chưa nhập giá trị tham số');
  //     return;
  //   }
  //   if (this.param.status === null || this.param.status === -1) {
  //     this.toastrService.success( 'Trạng thái tham số phải là Hoạt động hoặc không hoạt động');
  //     return;
  //   }
  //   this.constantService.postRequest(this.constantService.CATEGORY_URI + 'param/create/'
  //     , {
  //       'group': this.param.group,
  //       'code': this.param.code,
  //       'value': this.param.value,
  //       'name': this.param.name,
  //       'status': this.param.status
  //     }).toPromise()
  //     .then(res => res.json())
  //     .then(resJson => {
  //       if (resJson.responseCode === '0000') {
  //         this.toastrService.success( 'Thêm mới thành công');
  //         this.getListData();
  //       } else {
  //         // tslint:disable-next-line:max-line-length
  //         this.listData = new Array<Param>();
  //         this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
  //       }
  //     })
  //     .catch(err => {
  //       this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
  //     });
  // }

  public addData() {
    const modalRef = this.modalService.open(DetailParamComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailParamComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
    });
  }
}
