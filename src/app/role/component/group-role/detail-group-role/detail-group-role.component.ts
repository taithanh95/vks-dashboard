import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {GroupRole, Role} from '../../../../category/model/category.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {ResponseCode} from '../../../../common/constant/response-code';

@Component({
  selector: 'app-detail-group-role',
  templateUrl: './detail-group-role.component.html',
  styleUrls: ['./detail-group-role.component.css']
})
export class DetailGroupRoleComponent implements OnInit {

  @Input()
  editData: GroupRole;
  submited = false;

  listData: Role[];
  isLoading: boolean = false;

  formData: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    type: ['1'],
    name: [''],
    description: [''],
    code: [''],
    url: [''],
    icon: ['icon-puzzle']
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
    if (this.editData) {
      this.formData.patchValue(this.editData);
      this.getListData(this.editData.id);
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
    this.isLoading = true;
    if (this.editData && this.editData.id) {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'role/updateGroupRole/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success('Ch???nh s???a th??nh c??ng');
            this.closeDialog();
          } else {
            this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.toastrService.error('C?? l???i khi th???c hi???n: ' + err);
          this.isLoading = false;
        });
    } else {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'role/createGroupRole/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(resJson => {
          if (resJson.responseCode === '0000') {
            this.toastrService.success('Th??m m???i th??nh c??ng');
            this.closeDialog();
          } else {
            this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.toastrService.error('C?? l???i khi th???c hi???n: ' + err);
          this.isLoading = false;
        });
    }
    this.isLoading = false;
  }

  public changeStatus(formData) {
    this.confirmationDialogService.confirm('X??c nh???n..', 'B???n c?? ch???c ch???n ' + (formData.status === 1 ? 'lo???i b???' : 'g??n') + ' ch???c n??ng [' + formData.name + '] ' +
      'kh???i nh??m ch???c n??ng [' + this.editData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.isLoading = true;
            const cloneFromData = Object.assign({}, formData);
            this.constantService.postRequest(this.constantService.AUTH_URI + 'role/mergeGroupRoleMap/'
              , {
                'groupRoleId': this.editData.id,
                'roleId': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.toastrService.success((formData.status === 1 ? 'Lo???i b???' : 'G??n') + ' th??nh c??ng');
                  formData.status = (formData.status === 1 ? 0 : 1);
                  this.getListData(this.editData.id);
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
          } else {
            this.getListData(this.editData.id);
          }
        }
      )
      .catch(() => {
        this.getListData(this.editData.id);
        console.log('Ng?????i d??ng tho??t h???p tho???i hi???n l??n m?? kh??ng ???n v??o n??t ?????ng ??.');
      });
  }

  public upGroupRoleMap(formData) {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/upGroupRoleMap/'
      , {
        'groupRoleId': this.editData.id,
        'roleId': formData.id,
        'priority': formData.priority
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success('Th???c hi???n th??nh c??ng');
          this.getListData(this.editData.id);
        } else {
          this.toastrService.warning(responseBody.responseCode + ' - ' + responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.isLoading = false;
  }

  public downGroupRoleMap(formData) {
    this.isLoading = true;
    const cloneFromData = Object.assign({}, formData);
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/downGroupRoleMap/'
      , {
        'groupRoleId': this.editData.id,
        'roleId': formData.id,
        'priority': formData.priority
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.toastrService.success('Th???c hi???n th??nh c??ng');
          this.getListData(this.editData.id);
        } else {
          this.toastrService.warning(responseBody.responseCode + ' - ' + responseBody.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.isLoading = false;
  }

  getListData(groupRoleId: number) {
    this.isLoading = true;
    this.constantService.postRequest(this.constantService.AUTH_URI + 'role/findRoleByGroupRoleId/'
      , {
        'groupRoleId': groupRoleId
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listData = resJson.responseData;
        } else {
          // tslint:disable-next-line:max-line-length
          this.listData = new Array<Role>();
          this.toastrService.warning(resJson.responseCode + ' - ' + resJson.responseMessage);
        }
        this.isLoading = false;
      })
      .catch(() => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
        this.isLoading = false;
      });
  }


}
