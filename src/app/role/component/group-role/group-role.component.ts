import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GroupRole, Position, RoleSearch} from '../../../category/model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {DetailGroupRoleComponent} from './detail-group-role/detail-group-role.component';
import {PageResponse} from '../../../common/model/base.model';
import {Constant} from '../../../common/constant/constant';

declare var $: any;

@Component({
  selector: 'app-group-role',
  templateUrl: './group-role.component.html',
  styleUrls: ['./group-role.component.css']
})
export class GroupRoleComponent implements OnInit {
  pageResponse: PageResponse = {
    pageNumber: Constant.PAGE_NUMBER,
    pageSize: Constant.PAGE_SIZE,
    totalPages: 0,
    totalElements: 0
  };
  pageSizeOption: number[] = Constant.PAGE_SIZE_OPTION;
  searchModel: RoleSearch;
  listData: GroupRole[];
  isLoading: boolean = false;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<GroupRole>();
    this.searchModel = {name: '', status: -1};
  }

  ngOnInit(): void {
    this.getListData();
  }

  public onSearch() {
    this.getListData();
  }

  public resetSearch() {
    this.searchModel = {name: '', url: '', status: -1};
  }

  getListData() {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/getListGroupRole/'
      , this.searchModel).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
          this.pageResponse.totalElements = this.listData.length;
          this.pageResponse.totalPages = Math.ceil(this.pageResponse.totalElements / this.pageResponse.pageSize);
        } else {
          this.listData = new Array<Position>();
          this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.isLoading = false;
      });
  }


  public addData() {
    const modalRef = this.modalService.open(DetailGroupRoleComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailGroupRoleComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public copyData(formData) {
    const modalRef = this.modalService.open(DetailGroupRoleComponent, {size: 'lg'});
    formData.id = undefined;
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public onPageChange(event) {
    this.pageResponse.pageNumber = event;
  }

  public onPageSizeOptionChange(event) {
    this.pageResponse.pageSize = event;
    this.pageResponse.pageNumber = 1;
    this.pageResponse.totalPages = Math.ceil(this.pageResponse.totalElements / this.pageResponse.pageSize);
  }

  public changeStatus(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của nhóm chức năng [' + formData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.isLoading = true;
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.AUTH_URI + 'role/updateGroupRole/'
              , {
                'id': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  formData.status = 0;
                  this.toastrService.success('Đổi trạng thái bản ghi thành công');
                  this.getListData();
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
                }
                this.isLoading = false;
              })
              .catch(() => {
                this.toastrService.error(this.constantService.SYSTEM_ERROR);
                this.isLoading = false;
              });
            this.ref.markForCheck();
          }
        }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
