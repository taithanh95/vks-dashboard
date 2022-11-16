import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Param, Position, PositionSearch, Supplier} from '../../model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {DetailPositionComponent} from './detail-position/detail-position.component';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';

declare var $: any;

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  searchModel: PositionSearch;
  listData: Position[];
  inProgress: boolean = false;
  listSupplier: Supplier[];
  listUserType: Param[];

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<Position>();
    this.searchModel = {name: '', supplierId: -1, userType: -1, status: -1};
  }

  ngOnInit(): void {
    this.getListSupplier();
    this.getListUserType();
    this.getListData();
  }

  getListSupplier() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'supplier/getList/'
      , {
        'status': -1
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listSupplier = resJson.responseData;
        }
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
      });
  }

  getListUserType() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'param/findByGroup/'
      , {
        'group': this.constantService.USER_TYPE.toUpperCase()
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listUserType = resJson.responseData;
        }
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
      });
  }

  public onSearch() {
    this.getListData();
  }

  public resetSearch() {
    this.searchModel = {name: '', status: -1};
  }

  getListData() {
    this.inProgress = true;
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'position/getListPosition/'
      , this.searchModel).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
          this.totalRecords = this.listData.length;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Position>();
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
    const modalRef = this.modalService.open(DetailPositionComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailPositionComponent, {size: 'lg'});
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
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của bản ghi')
      .then((confirmed) => {
          if (confirmed) {
            this.constantService.postRequest(this.constantService.CATEGORY_URI + '/position/updatePosition/'
              , {
                'id': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  formData.status = 0;
                  this.toastrService.success( 'Đổi trạng thái bản ghi thành công');
                  this.getListData();
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
