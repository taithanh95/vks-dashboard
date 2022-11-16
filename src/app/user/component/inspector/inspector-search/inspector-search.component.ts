import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ConstantService } from '../../../../common/constant/constant.service';
import { ToastrService } from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-inspector-search',
  templateUrl: './inspector-search.component.html',
  styleUrls: ['./inspector-search.component.css']
})
export class InspectorSearchComponent implements OnInit {

  /* Show Dialogs*/
  isVisibleDetail: boolean;
  isVisibleEdit: boolean;
  isVisibleCreate: boolean;
  isVisibleChange: boolean;
  /*page*/
  page: any;
  pageSize: any;
  defaultPage: any;
  pageIndex: any;
  total: any;
  totalPages: any;
  loading: boolean;
  /*search filter*/
  enabledAutoLoadData = false; // Tự động lấy dữ liệu sau khi tải trang
  datas: any[];
  filterItem: any;
  selectedItem: any;
  sppId = this.cookieService.get(this.constantService.ID_SPP);
  data: any;

  /*LIST DƠN VỊ */
  lstSpp = [];
  lstSppIsDepart = [];

  /* Button display*/
  isUpdBtn: boolean;
  isInsBtn: boolean;
  isDeleteBtn: boolean;
  isDetailBtn: boolean;
  isChangeBtn: boolean;

  constructor(
    private constantService: ConstantService,
    private toastrService: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    private confirmationDialogService: ConfirmationDialogService,

  ) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.pageSize = 20;
    this.page = 20;
    this.defaultPage = 20;
    this.pageIndex = 1;
    this.getListSpp();
  }

  resetFilter() {
    this.resetBtn();
    this.filterItem = {
      inspcode: '',
      fullname: '',
      sppid: '',
      currentsppid: '',
    };
  }

  loadDataFromServer(): void {
    if (this.enabledAutoLoadData) {
      this.filterItem.pageSize = this.defaultPage;
      this.filterItem.rowIndex = this.defaultPage * (this.pageIndex - 1);
      this.filterItem.sortOrder = 'ASC';
      const payload = {
        ...this.filterItem,
        sppid: this.filterItem?.sppid?.SPPID ? this.filterItem?.sppid?.SPPID : null,
        currentsppid: this.filterItem?.currentsppid?.SPPID ? this.filterItem?.currentsppid?.SPPID : null
      }
      this.loading = true;
      this.constantService.post('dm/LstInspector/search1', payload)
        .subscribe(res => {
          this.loading = false;
          this.datas = res;
          if (this.datas.length != 0) {
            this.total = this.datas[0].ROWCOUNT;
          }else {
            this.total = 0;
          }
          this.resetBtn();

        }, error => {
          this.toastrService.error(error);
        });
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
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

  private resetPage() {
    this.pageSize = 20;
    this.page = 20;
    this.defaultPage = 20;
    this.pageIndex = 1;
  }

  showDetail(): void {
    this.isVisibleDetail = true;
  }

  closeDetail(isClose: boolean): void {
    this.isVisibleDetail = isClose;
  }

  showEditForm(data): void {
    this.data = {...data};
    this.isVisibleEdit = true;
  }

  closeEditForm(isClose: boolean): void {
    this.isVisibleEdit = isClose;
  }

  showCreateForm(): void {
    this.isVisibleCreate = true;
  }

  closeCreateForm(isClose: boolean): void {
    this.isVisibleCreate = isClose;
  }

  showChangeForm(data): void {
    this.data = {...data};
    this.isVisibleChange = true;
    this.isChangeBtn = this.data.STATUS === 'Y' ? false : true;
  }

  closeChangeForm(isClose: boolean): void {
    this.isVisibleChange = isClose;
  }

  onRowSelect(item) {
    this.selectedItem = item;
    this.toggleButtons();
  }

  resetBtn() {
    this.selectedItem = null;
    this.isDeleteBtn = true;
    this.isUpdBtn = true;
    this.isDetailBtn = true;
    this.isInsBtn = true;
    this.isChangeBtn = true;
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1)

  currentPageDataChange($event: any[]): void {
  }

  toggleButtons() {
    if (this.selectedItem) {
      const temp = this.filterItem.sendtype === 'U';
      this.isDeleteBtn = temp;
      this.isUpdBtn = temp;
      this.isInsBtn = temp;
      this.isDetailBtn = false;
    } else {
      this.isDeleteBtn = false;
      this.isUpdBtn = false;
      this.isInsBtn = false;
      this.isDetailBtn = true;
    }
    this.isChangeBtn = this.data.STATUS === 'Y' ? false : true;
  }

  getListSpp(): void {
    this.constantService.get('dm/LstInspector/getListSpp', {
      sppid: this.sppId
    }).subscribe(res => {
      this.loading = false;
      this.lstSpp = res;
      this.filterItem.sppid = res[0];
      this.onInputSppIsDepart();
    }, () => {
      alert('Lỗi dữ liệu');
    });
  }

  onInputSppIsDepart(): void {
    this.constantService.get('dm/LstInspector/getListSppIsDepart', {
      sppid: this.filterItem?.sppid?.SPPID
    }).subscribe(res => {
      this.loading = false;
      this.lstSppIsDepart = res;
      this.filterItem.currentsppid = null;
    }, () => {
      alert('Lỗi dữ liệu');
    });
  }

  convert(f): any {
    return f === 'Y' ? 'Có' : 'Không'
  }

  convert1(f): any {
    let __res = '';
    if (f != null) {
      const lstPosition = f.split(',');
      lstPosition.forEach(data => {
        if (data === 'KH') {
          __res += __res ? ',Khác ' : 'Khác ';
        } else if (data === 'DT') {
          __res += __res ? ', Điều tra viên' : 'Điều tra viên';
        } else if (data === 'LD') {
          __res += __res ? ', Lãnh đạo' : 'Lãnh đạo';
        } else if (data === 'KS') {
          __res += __res ? ', Kiểm sát viên' : 'Kiểm sát viên';
        }
      });
    }
    return __res;
  }

  doDelete(INSPCODE) {
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa người xử lý?').then((confirmed) => {
      if (confirmed) {
        this.constantService.postRequest(this.constantService.QUAN_LY_AN + 'LstInspector/delete', {inspcode: INSPCODE})
          .toPromise()
          .then(res => {
            if (res) {
              this.toastrService.success('Xóa người xử lý thành công');
              this.loadDataFromServer();
            } else {
              this.toastrService.error('Lỗi khi xóa người xử lý');
            }
          }).catch(err =>{
          this.toastrService.error('Có lỗi khi xóa người xử lý' + err);
        });
      }
      }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    toLowercaseFields(data) {
      return !data ? null : Object.keys(data).reduce((c, k) => (c[k.toLowerCase()] = data[k] === 'N' ? false : data[k] === 'Y' ? true : data[k], c), {});
    }
  }
