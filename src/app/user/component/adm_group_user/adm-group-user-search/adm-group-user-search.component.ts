import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ConstantService} from '../../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {Router} from '@angular/router';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-adm-group-user-search',
  templateUrl: './adm-group-user-search.component.html',
  styleUrls: ['./adm-group-user-search.component.css']
})
export class AdmGroupUserSearchComponent implements OnInit {
  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisibleCreate: boolean;
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  loading: boolean;

  /*search filter*/
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  datas: any[];
  filterItem: any;
  selectedItem: any;
  sppId: any;
  data: any;

  /* Button display*/
  isUpdBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isBtnUpdDisabled: boolean;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router
  ) {
    this.sppId = this.cookieService.get(this.constantService.ID_SPP);
    this.resetFilter();
  }

  ngOnInit(): void {
    this.resetPage();
    this.doSearch();
  }

  resetPage() {
    this.pageSize = 10;
    this.page = 10;
    this.defaultPage = 10;
    this.pageIndex = 1;
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      groupid: '',
      groupname: ''
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        sppid: this.sppId,
        size: this.defaultPage,
        page: this.defaultPage * (this.pageIndex - 1)
        // page: 0
      };
      this.loading = true;
      this.constantService.get('/dm/AdmGroups/getList', payload).subscribe(res => {
        this.loading = false;
        this.datas = res;
        if (this.datas.length != 0) {
          this.total = this.datas[0].ROWCOUNT;
        } else {
          this.total = 0;
        }
        this.resetBtn();

      }, error => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    this.pageIndex = params.pageIndex;
    this.defaultPage = params.pageSize;
    this.loadDataFromServer();
  }

  doSearch() {
    this.enabledAutoLoadData = true;
    this.resetBtn();
    this.resetPage();
    this.loadDataFromServer();
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.clearSelection(false);
  }

  resetBtn() {
    this.selectedItem = null;
    this.clearSelection(true);
  }

  clearSelection(opt: boolean) {
    this.isDeleteBtn = opt;
    this.isUpdBtn = opt;
    this.isDetailBtn = opt;
    this.isBtnUpdDisabled = opt;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  doDelete(groupid) {
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa nhóm người sử dụng?').then((confirmed) => {
      if (confirmed) {
        this.constantService.postRequest(this.constantService.QUAN_LY_AN + `AdmGroups/delete?groupid=${groupid}`, null)
          .toPromise()
          .then(res => res.json())
          .then(resJson => {
            if (resJson.responseCode === '0000' && !resJson.responseData) {
              this.toastrService.success('Xóa nhóm người sử dụng thành công');
              this.loadDataFromServer();
            } else {
              this.toastrService.error('Lỗi khi xóa nhóm người sử dụng');
            }
          }).catch(err => {
          this.toastrService.error('Có lỗi khi thực hiện: ' + err);
        });
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  showEditForm(data): void {
    this.data = this.toLowercaseFields(data);
    this.data.isEdit = true;
    this.isVisibleCreate = true;
  }

  toLowercaseFields(data) {
    return !data ? null : Object.keys(data).reduce((c, k) => (c[k.toLowerCase()] = data[k] === 'N' ? false : data[k] === 'Y' ? true : data[k], c), {});
  }

  showCreateForm(): void {
    this.data = {};
    this.data.isEdit = false;
    this.isVisibleCreate = true;
  }

  closeModalCreate($event: boolean) {
    this.isVisibleCreate = $event;
  }

  reloadModalCreate($event: boolean) {
    this.isVisibleCreate = $event;
    this.loadDataFromServer();
  }

  showAdmGrant(groupid, groupname) {
    this.router.navigateByUrl('/user/grant-to-group', {
      state: {groupid: groupid, groupname: groupname}
    });
  }
}
