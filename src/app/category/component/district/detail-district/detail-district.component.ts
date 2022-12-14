import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Commune, District, Province} from '../../../model/category.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-detail-district',
  templateUrl: './detail-district.component.html',
  styleUrls: ['./detail-district.component.css']
})
export class DetailDistrictComponent implements OnInit {

  @Input()
  editData: District;
  isLoading = false;
  submited = false;

  listData: Commune[];
  provinceList: Province[];

  formData: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    name: ['', [Validators.required]],
    provinceCode: ['', [Validators.required]],
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
    if (this.editData) {
      this.formData.patchValue(this.editData);
      this.getListData(this.editData.code);
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
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/createOrUpdateDistrict/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Ch???nh s???a th??nh c??ng');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'C?? l???i khi th???c hi???n: ' + err);
        });
    } else {
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/createOrUpdateDistrict/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success( 'Th??m m???i th??nh c??ng');
            this.closeDialog();
          } else {
            this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
          }
        })
        .catch(err => {
          this.toastrService.success( 'C?? l???i khi th???c hi???n: ' + err);
        });
    }
    this.isLoading = false;
  }

  public changeStatus(formData) {
    this.confirmationDialogService.confirm('X??c nh???n..', 'B???n c?? ch???c ch???n d???ng ho???t ?????ng [' + formData.name + '] ' +
      'trong [' + this.editData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/createOrUpdateDistrict/'
              , {
                'code': formData.code,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.toastrService.success( 'Lo???i b??? th??nh c??ng');
                  if (this.editData) {
                    this.getListData(this.editData.code);
                  }
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

  getListData(districtCode: string) {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'area/findCommuneByDistrictCode/'
      , {
        'districtCode': districtCode
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Commune>();
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
}
