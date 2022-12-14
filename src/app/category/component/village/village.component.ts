import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AreaSearch, Commune, District, Province, Village} from '../../model/category.model';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {ConfirmationDialogService} from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {DetailVillageComponent} from './detail-village/detail-village.component';

declare var $: any;

@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  styleUrls: ['./village.component.css']
})
export class VillageComponent implements OnInit {

  totalPages: number;
  totalRecords: number;
  currentPage: number = 1;
  recordFrom: number = 0;
  recordTo: number = 10;
  searchModel: AreaSearch;
  listData: Village[];
  communeList: Commune[];
  districtList: District[];
  provinceList: Province[];

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

  getListDataPage(page: number, searchData?: any) {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/getPageVillage/'
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
        this.toastrService.success( 'H??? th???ng kh??ng c?? ph???n h???i.' + err);
      });
  }

  getCommuneListData(districtCode: string) {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/findCommuneByDistrictCode/'
      , {
        'districtCode': districtCode
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.communeList = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.districtList = new Array<District>();
          this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
        }
      })
      .catch(err => {
        this.toastrService.success( 'H??? th???ng kh??ng c?? ph???n h???i.' + err);
      });
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
        this.toastrService.success( 'H??? th???ng kh??ng c?? ph???n h???i.' + err);
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
        this.toastrService.success( 'H??? th???ng kh??ng c?? ph???n h???i.' + err);
      });
  }


  public addData() {
    const modalRef = this.modalService.open(DetailVillageComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.getListDataPage(1, this.searchModel);
    }, () => {
      this.getListDataPage(1, this.searchModel);
    });
  }

  public editData(formData) {
    const modalRef = this.modalService.open(DetailVillageComponent, {size: 'lg'});
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
    this.confirmationDialogService.confirm('X??c nh???n..', 'B???n c?? ch???c ch???n thay ?????i tr???ng th??i c???a th??n x??m [' + formData.name + ']?')
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
                  this.toastrService.success( '?????i tr???ng th??i b???n ghi th??nh c??ng');
                  this.getListDataPage(this.currentPage, this.searchModel);
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
                }
              })
              .catch(err => {
                this.toastrService.success( 'H??? th???ng kh??ng c?? ph???n h???i.' + err);
              });
            this.ref.markForCheck();
          }
        }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
