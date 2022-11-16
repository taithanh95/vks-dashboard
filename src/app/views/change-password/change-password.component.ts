import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {ToastrService} from 'ngx-toastr';
import {ConstantService} from '../../common/constant/constant.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],

})
export class ChangePasswordComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  formData: FormGroup;
  submited = false;
  againtPasswork: any;

  constructor(
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private constantService: ConstantService
  ) {
  }

  inProgress: boolean = false;

  ngOnInit(): void {
    this.resetData();
  }

  resetData() {
    this.formData = this.fb.group({
      id: [''],
      username: ['', [Validators.required]],
      passwordOld: ['', [Validators.required]],
      passwordNew: [''],
      againtPasswork: ['']
    });
  }


  handleCancel(): void {
    this.isVisible = false;
    this.closeModal.emit(false);
    this.resetData();
  }

  checkPasswork() {
    const ex = this.formData.value.passwordNew;
    const reg = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$';
    if (!String(ex).match(new RegExp(reg))) {
      this.formData.get('passwordNew').setErrors({error: 'Mật khẩu phải có ít nhất 8 ký tự, gồm ít nhất 3 yếu tố: Chữ hoa, chữ thường, chữ số và ký tự đặc biệt!'});
    }
  }

  checkPassworkAgaint() {
    const ex = this.formData.value.passwordNew;
    const np = this.formData.value.againtPasswork;
    if (ex !== np) {
      this.formData.get('againtPasswork').setErrors({error: 'Mật khẩu không trùng khớp!'});
    }
  }

  onSubmit() {
    this.submited = true;
    let valid = true;

    if (this.formData.value.passwordNew && this.formData.value.againtPasswork &&
      this.formData.value.passwordNew !== this.formData.value.againtPasswork) {
      this.toastrService.warning('Mật khẩu mới và nhập lại mật khẩu không giống nhau, cần kiểm tra lại');
      return;
    }

    if (!this.formData.value.username) {
      this.toastrService.warning('Tên đăng nhập bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.passwordOld) {
      this.toastrService.warning('Mật khẩu cũ bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.passwordNew) {
      this.toastrService.warning('Mật khẩu mới bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.value.againtPasswork) {
      this.toastrService.warning('Nhập lại mật khẩu bắt buộc nhập');
      valid = false;
    }
    if (!this.formData.valid) {
      this.toastrService.warning('Các trường đầu vào đang không đúng!');
      valid = false;
    }
    if (valid) {
      this.changePassword();
    } else {
      this.inProgress = false;
    }
  }

  async changePassword() {
    try {
      this.inProgress = true;
      await this.changePasswordOld();
      const changePasswordNew = await this.changePasswordNew();
      const resJson = changePasswordNew.json();
      if (resJson.responseCode === '0000') {
        this.toastrService.success('Đổi mật khẩu thành công');
        this.handleCancel();
      } else {
        this.toastrService.error(resJson.responseCode + ' - ' + resJson.responseMessage);
      }
      this.inProgress = false;
    } catch (err) {
      const meserr = err.json();
      this.toastrService.error(meserr.detail);
      this.inProgress = false;
    }
  }

  async changePasswordOld() {
    await this.constantService.postRequest(this.constantService.API_QUANLYAN + 'user/changePassword'
      , {
        userid: this.formData.value.username,
        passwordOld: btoa(this.formData.value.passwordOld),
        passwordNew: btoa(this.formData.value.passwordNew)
      }
    ).toPromise();
  }

  async changePasswordNew() {
    return this.constantService.postRequest(this.constantService.AUTH_URI + 'password/changePasswordByUser'
      , {
        passwordOld: btoa(this.formData.value.passwordOld),
        passwordNew: btoa(this.formData.value.passwordNew)
      }).toPromise();
  }
}
