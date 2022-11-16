import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Position, Role, RoleSearch} from '../../../category/model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {PageResponse} from '../../../common/model/base.model';
import {Constant} from '../../../common/constant/constant';
import {DetailRoleComponent} from './detail-role/detail-role.component';

declare var $: any;

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  pageResponse: PageResponse = {
    pageNumber: Constant.PAGE_NUMBER,
    pageSize: Constant.PAGE_SIZE,
    totalPages: 0,
    totalElements: 0
  };
  pageSizeOption: number[] = Constant.PAGE_SIZE_OPTION;
  searchModel: RoleSearch;
  listData: Role[];
  listDataForSearch: Role[];
  isLoading: boolean = false;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<Role>();
    this.searchModel = {name: '', url: '', type: -1, status: -1};
  }

  ngOnInit(): void {
    this.getListData();
  }

  public onSearch() {
    this.getListData();
  }

  public resetSearch() {
    this.searchModel = {name: '', url: '', type: -1, status: -1};
  }

  getListData() {
    this.pageResponse = {
      pageNumber: Constant.PAGE_NUMBER,
      pageSize: Constant.PAGE_SIZE,
      totalPages: 0,
      totalElements: 0
    };
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/getListRole/'
      , this.searchModel).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === '0000') {
          this.listData = responseBody.responseData;
          this.listDataForSearch = responseBody.responseData;
          this.pageResponse.totalElements = this.listData.length;
          this.pageResponse.totalPages = Math.ceil(this.pageResponse.totalElements / this.pageResponse.pageSize);
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Position>();
          this.toastrService.warning(responseBody.responseCode + ' - ' + responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.isLoading = false;
      });
  }

  public addData() {
    const modalRef = this.modalService.open(DetailRoleComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailRoleComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public copyData(formData) {
    const modalRef = this.modalService.open(DetailRoleComponent, {size: 'lg'});
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
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của chức năng [' + formData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.isLoading = true;
            this.constantService.postRequest(this.constantService.AUTH_URI + 'role/updateRole/'
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
          } else {
            this.getListData();
          }
        }
      )
      .catch(() => {
      });
  }

  search(searchKeyword: string): void {
    const filteredList: Role[] = [];
    this.listDataForSearch.forEach((value: Role) => {
      const propValueList = Object.values(value);
      for (let i = 0; i < propValueList.length; i++) {
        if (propValueList[i] && propValueList[i].toString().toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1) {
          filteredList.push(value);
          break;
        }
      }
    });
    if (filteredList.length > 0) {
      this.listData = filteredList;
      this.pageResponse.totalElements = this.listData.length;
      this.pageResponse.totalPages = Math.ceil(this.pageResponse.totalElements / this.pageResponse.pageSize);
    }
  }
}
