import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Commune, District, Province, Village} from '../../../model/category.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-detail-village',
  templateUrl: './detail-village.component.html',
  styleUrls: ['./detail-village.component.css']
})
export class DetailVillageComponent implements OnInit {

  @Input()
  editData: Village;
  isLoading = false;
  submited = false;

  provinceList: Province[];
  districtList: District[];
  communeList: Commune[];

  formData: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    name: ['', [Validators.required]],
    provinceCode: ['', [Validators.required]],
    districtCode: ['', [Validators.required]],
    communeCode: ['', [Validators.required]],
    code: ['', [Validators.required]]
  });

  constructor(private constantService: ConstantService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private ref: ChangeDetectorRef,
              private confirmationDialogService: ConfirmationDialogService
  ) {
  }

  ngOnInit(): void {
    this.getProvinceListData();
    if (this.editData && this.editData.provinceCode) {
      this.getDistrictListData(this.editData.provinceCode);
    }
    if (this.editData && this.editData.districtCode) {
      this.getCommuneListData(this.editData.districtCode);
    }
    if (this.editData) {
      this.formData.patchValue(this.editData);
    }
  }

  closeDialog(): void {
    this.activeModal.close();
  }

  onSubmit() {
    this.submited = true;
    if (this.formData.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.editData && this.editData.id) {
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/createOrUpdateVillage/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Chỉnh sửa thành công');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
        });
    } else {
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/createOrUpdateVillage/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Thêm mới thành công');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
        });
    }
    this.isLoading = false;
  }

  public changeStatus(formData) {
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn dừng hoạt động [' + formData.name + '] ' +
      'trong [' + this.editData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/createOrUpdateVillage/'
              , {
                'code': formData.code,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.toastrService.success( 'Loại bỏ thành công');
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
        this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
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
}
