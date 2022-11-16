import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ResponseCode} from '../../../../common/constant/response-code';
import {GroupUser} from '../../../../category/model/category.model';
import {ConfirmationDialogService} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import {ConstantService} from '../../../../common/constant/constant.service';

@Component({
  selector: 'app-detail-group-user',
  templateUrl: './detail-group-user.component.html',
  styleUrls: ['./detail-group-user.component.css']
})
export class DetailGroupUserComponent implements OnInit {
  @Input()
  editData: GroupUser;
  submited = false;
  isLoading: boolean = false;

  formData: FormGroup = this.fb.group({
    id: [''],
    status: ['1'],
    name: ['', [Validators.required]],
    description: ['']
  });

  constructor(
    private constantService: ConstantService,
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
      this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/updateGroupUser/'
        , this.formData.value).toPromise()
        .then(res => res.json())
        .then(responseBody => {
          if (responseBody.responseCode === ResponseCode.SUCCESS) {
            this.toastrService.success('Cập nhật thông tin nhóm người dùng thành công');
            this.closeDialog();
          } else {
            this.toastrService.warning(responseBody.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.toastrService.warning('Hệ thống không có phản hồi.');
          this.isLoading = false;
        });
    } else {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'groupUser/createGroupUser/'
        , {
          'name': this.formData.value.name,
          'description': this.formData.value.description
        }).toPromise()
        .then(res => res.json())
        .then(responseBody => {
          if (responseBody.responseCode === ResponseCode.SUCCESS) {
            this.toastrService.success('Thêm mới nhóm người dùng thành công');
            this.closeDialog();
          } else {
            this.toastrService.warning(responseBody.responseMessage);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.toastrService.warning('Hệ thống không có phản hồi.');
          this.isLoading = false;
        });
    }
  }

  public getUsernameFromFullName(name: string) {
    if (this.editData && this.editData.id) {
      return;
    }
    this.constantService.postRequest(this.constantService.AUTH_URI + 'user/getUsernameFromFullName/'
      , {
        'name': name
      }).toPromise()
      .then(res => res.json())
      .then(responseBody => {
        if (responseBody.responseCode === ResponseCode.SUCCESS) {
          this.formData.controls['username'].setValue(responseBody.responseData);
        } else {

          this.toastrService.warning('Chưa lấy được tài khoản cho tên ' + name);
        }
      })
      .catch(err => {
        this.toastrService.warning('Hệ thống không có phản hồi.');
        console.log(err);
      });
  }
}
