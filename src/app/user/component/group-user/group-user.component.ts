import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {PageResponse} from '../../../common/model/base.model';
import {Constant, ModuleUri} from '../../../common/constant/constant';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ResponseCode} from '../../../common/constant/response-code';
import {DetailGroupUserComponent} from './detail-group-user/detail-group-user.component';
import {GroupUserRoleComponent} from './group-user-role/group-user-role.component';
import {GroupUser, SearchGroupUser, User} from '../../../category/model/category.model';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpclientService} from '../../../common/http/httpclient.service';
import {ConstantService} from '../../../common/constant/constant.service';

@Component({
  selector: 'app-group-user',
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.css']
})
export class GroupUserComponent implements OnInit {
  pageResponse: PageResponse = {
    pageNumber: Constant.PAGE_NUMBER,
    pageSize: Constant.PAGE_SIZE,
    totalPages: 0,
    totalElements: 0
  };
  pageSizeOption: number[] = Constant.PAGE_SIZE_OPTION;
  searchModel: SearchGroupUser;
  listData: GroupUser[];
  listDataForSearch: GroupUser[];
  listStatus: any[] = Constant.OBJECT_STATUS;
  isLoading: boolean = false;

  @ViewChild('statusSelect') statusSelect!: NzSelectComponent;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<GroupUser>();
    this.resetSearch();
  }

  ngOnInit(): void {
    this.getListData();
  }

  public resetSearch() {
    this.searchModel = {name: '', description: ''};
  }

  public onSearch() {
    this.getListData();
  }

  getListData() {
    this.pageResponse = {
      pageNumber: Constant.PAGE_NUMBER,
      pageSize: Constant.PAGE_SIZE,
      totalPages: 0,
      totalElements: 0
    };
    this.listData = new Array<User>();
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/getListGroupUser/'
      , this.searchModel).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.listData = responseBody.responseData;
          this.listDataForSearch = responseBody.responseData;
          this.pageResponse.totalElements = this.listData.length;
          this.pageResponse.totalPages = Math.ceil(this.pageResponse.totalElements / this.pageResponse.pageSize);
        } else {
          this.toastrService.warning(responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(err => {
        this.toastrService.error('Hệ thống không có phản hồi.');
        console.log(err);
        this.isLoading = false;
      });
  }


  public addData() {
    const modalRef = this.modalService.open(DetailGroupUserComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailGroupUserComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public copyData(formData) {
    const modalRef = this.modalService.open(DetailGroupUserComponent, {size: 'lg'});
    formData.id = undefined;
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListData();
    }, () => {
      this.getListData();
    });
  }

  public changeGroupUserRole(formData) {
    const modalRef = this.modalService.open(GroupUserRoleComponent, {size: 'lg'});
    modalRef.componentInstance.groupUserId = formData.id;
    modalRef.componentInstance.username = formData.username;
    modalRef.componentInstance.name = formData.name;
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
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của nhóm người dùng [' + formData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.isLoading = true;
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/updateGroupUser/'
              , {
                'id': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(responseBody => {
                if (responseBody.responseCode === ResponseCode.SUCCESS) {
                  formData.status = 0;
                  this.toastrService.success('Đổi trạng thái bản ghi thành công');
                  this.getListData();
                } else {
                  this.toastrService.warning(responseBody.responseMessage);
                }
                this.isLoading = false;
              })
              .catch(err => {
                this.toastrService.error('Hệ thống không có phản hồi.');
                console.log(err);
                this.isLoading = false;
              });
            this.ref.markForCheck();
          }
        }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  search(searchKeyword: string): void {
    const filteredList: User[] = [];
    this.listDataForSearch.forEach((value: User) => {
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
  deleteGroupUser(data){
    console.log(data);
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa nhóm người dùng này không?').then(async (confirmed) => {
      if (confirmed) {
        this.isLoading = true;
        const deleteGroupUser = await this.constantService.postRequest(
          this.constantService.AUTH_URI + 'groupUser/deleteGroupUser/',
          {
            'id': data.id,
            'status': (data.status === 1 ? 0 : 1)
          }
        ).toPromise();
        const resJson = deleteGroupUser.json();
        if (resJson.responseCode === '0000') {
          this.toastrService.success(`Xóa nhóm người dùng ` + data.name + ` thành công`);
          this.isLoading = false;
          this.getListData();
        } else {
          this.toastrService.error(resJson.responseCode + ' - ' + resJson.responseMessage);
          this.isLoading = false;
        }
      }
    }).catch(() => {
      this.isLoading = false;
      this.toastrService.error(this.constantService.SYSTEM_ERROR);
      console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');

    });
  }
}
