import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AdmGroups, GroupRole, GroupUser, SearchUser, User} from '../../../category/model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {UserRoleComponent} from './user-role/user-role.component';
import {PageResponse} from '../../../common/model/base.model';
import {Constant} from '../../../common/constant/constant';
import {Router} from '@angular/router';
import {Inspector} from '../../../category/model/category.model';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pageResponse: PageResponse = {
    pageNumber: Constant.PAGE_NUMBER,
    pageSize: Constant.PAGE_SIZE,
    totalPages: 0,
    totalElements: 0
  };
  pageSizeOption: number[] = Constant.PAGE_SIZE_OPTION;
  searchModel: SearchUser;
  listData: User[];
  listGroupUser: GroupUser[];
  listDataForSearch: User[];
  isLoading: boolean = false;

  sppId: string;
  data: User;
  isVisible;
  listSpp: any[];
  listDepart: any[];
  listInspectors: Inspector[];
  listGroup: AdmGroups[];

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router
  ) {
    this.listData = new Array<User>();
    this.sppId = this.cookieService.get(this.constantService.ID_SPP);
    this.resetSearch();
  }

  ngOnInit(): void {
    this.getListGroupUser();
    this.getListData();
    this.getListSpps(this.cookieService.get(this.constantService.ID_SPP), '');
    this.getLstDepart(this.searchModel.sppid);
    this.getListGroupOfSpp(this.cookieService.get(this.constantService.ID_SPP), this.cookieService.get(this.constantService.ID_SPP));
  }

  public resetSearch() {
    this.searchModel = {username: '', name: '', status: -1, sppid: this.cookieService.get(this.constantService.ID_SPP), inspcode: ''};
  }

  sppChange() {
    const sppid = this.searchModel.sppid ? this.searchModel.sppid : null;
    this.getListInspector(this.searchModel.sppid ? this.searchModel.sppid : sppid);
    this.getLstDepart(sppid);
  }

  departChange() {
    const sppid = this.searchModel.departid ? this.searchModel.departid : this.searchModel.sppid ? this.searchModel.sppid : null;
    this.getListInspector(sppid);
  }

  getListSpps(sppid, query) {
    this.constantService.get('/dm/LstSPP/getSpps', {sppid: sppid, query: query})
      .subscribe(resJson => {
        if (resJson != null) {
          this.listSpp = resJson;
        }
      }, err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  getLstDepart(sppId) {
    this.constantService.get(`dm/AdmDepertments/getListSpp?sppid=${sppId}`)
      .subscribe(resJson => {
        if (resJson != null) {
          this.listDepart = resJson;
        }
      }, err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  getListInspector(sppid) {
    this.constantService.get(`/dm/AdmUsers/getLstInspector?sppid=${sppid}`)
      .subscribe(resJson => {
        if (resJson) {
          this.listInspectors = resJson;
        }
      }, err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');

        console.log(err);
      });
  }

  getListGroupOfSpp(csppid, sppid) {
    this.constantService.get('/dm/AdmGrant/getLstGroupOfSpp/', {csppid: csppid, sppid: sppid})
      .subscribe(resJson => {

        if (resJson != null) {
          this.listGroup = resJson;
        }
      }, (err) => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
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
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'user/getList/'
      , this.searchModel).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
          this.listDataForSearch = resJson.responseData;
          this.pageResponse.totalElements = this.listData.length;
          this.pageResponse.totalPages = Math.ceil(this.pageResponse.totalElements / this.pageResponse.pageSize);
        } else {
          this.listData = new Array<User>();
          this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.isLoading = false;
      });
  }

  getListGroupUser() {
    this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/getListGroupUser/'
      , {
        'status': 1
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === '0000') {
          this.listGroupUser = responseBody.responseData;
        } else {
          this.listGroupUser = new Array<GroupUser>();

          this.toastrService.warning(responseBody.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }

  showAdmGrant(data) {
    this.router.navigateByUrl('user/grant-group-to-user', {state: {userid: data.username, fullname: data.name}});
  }

  showAdmGrantToUser(data) {
    this.router.navigateByUrl('user/grant-to-user', {state: {userid: data.username, fullname: data.name}});
  }

  public addData() {
    this.data = {};
    this.isVisible = true;
    // const modalRef = this.modalService.open(DetailUserComponent, {size: 'lg'});
    // modalRef.result.then(() => {
    //   this.getListData();
    // }, () => {
    //   this.getListData();
    // });
  }

  public editData(formData) {
    this.data = formData;
    this.isVisible = true;
    // const modalRef = this.modalService.open(DetailUserComponent, {size: 'lg'});
    // modalRef.componentInstance.editData = formData;
    // modalRef.result.then(() => {
    //   this.getListData();
    // }, () => {
    //   this.getListData();
    // });
  }

  closeModal($event) {
    this.isVisible = $event;
    this.getListData();
  }

  public changeUserRole(formData) {
    const modalRef = this.modalService.open(UserRoleComponent, {size: 'lg'});
    modalRef.componentInstance.userId = formData.id;
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

  public resetPassword(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn reset mật khẩu của tài khoản [' + formData.username + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.isLoading = true;
            this.constantService.postRequest(this.constantService.AUTH_URI + 'password/resetPasswordByAdmin'
              , {
                'id': formData.id
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.toastrService.success('Reset mật khẩu thành công, mật khẩu mới là 123456');
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

  async deleteUser(data) {
    const user = {
      'id': data.id,
      'username': data.username,
      'password': data.password,
      'name': data.name,
      'groupUserId': data.groupUserId,
      'email': data.email,
      'type': data.type,
      'phone': data.phone,
      'sppid': data.sppid,
      'inspcode': data.inspcode,
      'expiredate': data.expiredate,
      'departid': data.departid,
      'groupid': data.groupid
    };
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa tài khoản này không?').then(async (confirmed) => {
      if (confirmed) {
        this.isLoading = true;
        await this.deleteOldUser(user);
        const deleteNewUser = await this.deleteNewUser(user);
        const resJson = deleteNewUser.json();
        if (resJson.responseCode === '0000') {
          this.toastrService.success(`Xóa tài khoản ` + data.username + ` thành công`);
          this.isLoading = false;
          this.getListData();
        } else {
          this.toastrService.error(resJson.responseCode + ' - ' + resJson.responseMessage);
          this.isLoading = false;
        }
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  async deleteOldUser(data) {
    return this.constantService.postRequest(this.constantService.API_QUANLYAN + 'user/handleDeleteUserOld', {user: data}).toPromise();
  }

  async deleteNewUser(data) {
    return this.constantService.postRequest(this.constantService.AUTH_URI + 'user/delete/', {user: data}).toPromise();

  }
}
