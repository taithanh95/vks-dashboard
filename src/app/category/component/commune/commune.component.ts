import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AreaSearch, Commune, District, Province} from '../../model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {DetailCommuneComponent} from './detail-commune/detail-commune.component';

declare var $: any;

@Component({
  selector: 'app-commune',
  templateUrl: './commune.component.html',
  styleUrls: ['./commune.component.css']
})
export class CommuneComponent implements OnInit {

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  searchModel: AreaSearch;
  listData: Commune[];
  provinceList: Province[];
  districtList: District[];

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.listData = new Array<District>();
    this.searchModel = {code: '', name: '', status: -1, provinceCode: '', districtCode: ''};
  }

  ngOnInit(): void {
    this.getListDataPage(1, this.searchModel);
    this.getProvinceListData();
  }

  public onSearch() {
    this.getListDataPage(1, this.searchModel);
  }

  getDistrictListData(provinceCode: string) {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/findDistrictByProvinceCode/'
      , {
        'provinceCode': provinceCode
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.districtList = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.districtList = new Array<District>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
      });
  }

  getProvinceListData() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/getListProvince/'
      , {
        'status': -1
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.provinceList = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.provinceList = new Array<Province>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
      });
  }

  getListDataPage(page: number, searchData?: any) {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/getPageCommune/'
      , {
        'pageNumber': page,
        'pageSize': this.constantService.size,
        'dataRequest': this.searchModel
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData.data;
          this.totalPages = resJson.responseData.totalPages;
          this.totalRecords = resJson.responseData.totalElements;
          $('NumberOfRecords').hide();
          this.recordTo = (this.currentPage * 10) - (10 - this.listData.length);
          $('NumberOfRecords').show();
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<District>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
      });
  }

  public addData() {
    const modalRef = this.modalService.open(DetailCommuneComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListDataPage(1, this.searchModel);
    }, () => {
      this.getListDataPage(1, this.searchModel);
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailCommuneComponent, {size: 'lg'});
    modalRef.componentInstance.editData = formData;
    modalRef.result.then(() => {
      this.getListDataPage(this.currentPage, this.searchModel);
    }, () => {
      this.getListDataPage(this.currentPage, this.searchModel);
    });
  }

  public onPageChange(event) {
    this.currentPage = event;
    this.recordTo = (this.currentPage * 10) - (10 - this.listData.length);
    this.recordFrom = this.currentPage - 1;
    this.getListDataPage(event, this.searchModel);
  }

  numberKeyEvent(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }
  }

  public changeStatus(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn thay đổi trạng thái của phường xã [' + formData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/updateCommuneStatus/'
              , {
                'id': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  formData.status = 0;
                  this.toastrService.success( 'Đổi trạng thái bản ghi thành công');
                  this.getListDataPage(this.currentPage, this.searchModel);
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

  public resetSearch() {
    this.searchModel = {code: '', name: '', status: -1, provinceCode: '', districtCode: ''};
  }
}
