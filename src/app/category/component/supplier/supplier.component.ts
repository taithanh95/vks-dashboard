import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Supplier, SupplierSearch} from '../../model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {DetailSupplierComponent} from './detail-supplier/detail-supplier.component';

declare var $: any;

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  searchModel: SupplierSearch;
  listData: Supplier[];
  inProgress: boolean = false;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<Supplier>();
    this.searchModel = {code: '', name: '', status: -1, alias: '', address: '', phone: ''};
  }

  ngOnInit(): void {
    this.getListData();
  }

  public onSearch() {
    this.getListData();
  }

  getListData() {
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'supplier/getList/'
      , {
        'code': this.searchModel.code,
        'name': this.searchModel.name,
        'address': this.searchModel.address,
        'alias': this.searchModel.alias,
        'status': this.searchModel.status
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
          this.totalRecords = this.listData.length;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Supplier>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.inProgress = false;
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
        this.inProgress = false;
      });
  }

  public addData() {
    const modalRef = this.modalService.open(DetailSupplierComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailSupplierComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
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

  public changeStatus(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của thôn xóm [' + formData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/updateVillageStatus/'
              , {
                'id': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  formData.status = 0;
                  this.toastrService.success( 'Đổi trạng thái bản ghi thành công');
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
}
