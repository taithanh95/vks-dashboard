import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {GroupRole, Param, Position, Supplier} from '../../../model/category.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConstantService} from '../../../../common/constant/constant.service';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-detail-position',
  templateUrl: './detail-position.component.html',
  styleUrls: ['./detail-position.component.css']
})
export class DetailPositionComponent implements OnInit {

  @Input()
  editData: Position;
  isLoading = false;
  submited = false;
  inProgress: boolean = false;
  listSupplier: Supplier[];
  listUserType: Param[];
  listGroupRole: GroupRole[];

  formData: FormGroup = this.fb.group({
    id: [''],
    supplierId: [''],
    userType: [''],
    name: ['', [Validators.required]],
    status: ['']
  });

  constructor(private constantService: ConstantService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              public activeModal: NgbActiveModal,
              private ref: ChangeDetectorRef,
              private confirmationDialogService: ConfirmationDialogService
  ) {
  }

  ngOnInit(): void {
    this.getListSupplier();
    this.getListUserType();
    if (this.editData) {
      this.formData.patchValue(this.editData);
      this.getListGroupRole();
    }
  }

  getListSupplier() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'supplier/getList/'
      , {
        'status': -1
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listSupplier = resJson.responseData;
        }
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
      });
  }

  getListUserType() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'param/findByGroup/'
      , {
        'group': this.constantService.USER_TYPE.toUpperCase()
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listUserType = resJson.responseData;
        }
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
      });
  }

  getListGroupRole() {
    this.constantService.postRequest(this.constantService.CATEGORY_URI + 'position/getListGroupRoleByPosition/'
      , {
        'supplierId': this.editData.supplierId,
        'positionId': this.editData.id
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listGroupRole = resJson.responseData;
        }
      })
      .catch(err => {
        this.toastrService.success( 'Có lỗi khi thực hiện: ' + err);
      });
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
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'position/updatePosition/'
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
      this.constantService.postRequest(this.constantService.CATEGORY_URI + 'position/createPosition/'
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


  public changeStatusPositionGroupRole(formData) {
    // tslint:disable-next-line:max-line-length
    this.confirmationDialogService.confirm('Xác nhận..', 'Bạn có chắc chắn ' + (formData.status === 1 ? 'loại bỏ' : 'gán') + ' chức năng [' + formData.name + '] ' +
      'khỏi nhóm chức năng [' + this.editData.name + ']?')
      .then((confirmed) => {
          if (confirmed) {
            this.inProgress = true;
            this.constantService.postRequest(this.constantService.CATEGORY_URI + 'position/updateStatusPositionGroupRole/'
              , {
                'supplierId': this.editData.supplierId,
                'positionId': this.editData.id,
                'groupRoleId': formData.id,
                'status': (formData.status === 1 ? 0 : 1)
              }).toPromise()
              .then(res => res.json())
              .then(resJson => {
                if (resJson.responseCode === '0000') {
                  this.toastrService.success( (formData.status === 1 ? 'Loại bỏ' : 'Gán') + ' thành công');
                  formData.status = (formData.status === 1 ? 0 : 1);
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.toastrService.success( resJson.responseCode + ' - ' + resJson.responseMessage);
                }
                this.inProgress = false;
              })
              .catch(err => {
                this.toastrService.success( 'Hệ thống không có phản hồi.' + err);
                this.inProgress = false;
              });
            this.ref.markForCheck();
          }
        }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
